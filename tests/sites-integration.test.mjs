import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { strToU8, zipSync } from "fflate";
import { Miniflare } from "miniflare";

const root = new URL("../", import.meta.url);
const ownerHeaders = { "oai-authenticated-user-email": "owner@example.com" };
const sourcePosts = JSON.parse(await readFile(new URL("../data/posts.json", import.meta.url), "utf8")).posts;
const sourceProjects = JSON.parse(await readFile(new URL("../data/projects.json", import.meta.url), "utf8")).projects;
const sourceResume = JSON.parse(await readFile(new URL("../data/resume.json", import.meta.url), "utf8"));
const sourceTracks = JSON.parse(await readFile(new URL("../data/music.json", import.meta.url), "utf8")).tracks;

async function serveStaticAsset(request) {
  const pathname = decodeURIComponent(new URL(request.url).pathname).replace(/^\/+/, "");
  try {
    const body = await readFile(new URL(`../dist/client/${pathname}`, import.meta.url));
    const contentTypes = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".png": "image/png",
      ".webp": "image/webp",
      ".mp3": "audio/mpeg",
    };
    const extension = pathname.match(/\.[^.]+$/)?.[0] ?? "";
    return new Response(body, { headers: { "content-type": contentTypes[extension] ?? "application/octet-stream" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

async function createRuntime() {
  const mf = new Miniflare({
    modules: true,
    modulesRules: [{ type: "ESModule", include: ["**/*.js"] }],
    scriptPath: fileURLToPath(new URL("../dist/server/index.js", import.meta.url)),
    compatibilityDate: "2026-05-15",
    compatibilityFlags: ["nodejs_compat"],
    d1Databases: ["DB"],
    r2Buckets: ["MEDIA"],
    serviceBindings: { ASSETS: serveStaticAsset },
  });
  try {
    const db = await mf.getD1Database("DB");
    const migration = await readFile(new URL("../drizzle/0000_dear_dakota_north.sql", import.meta.url), "utf8");
    for (const statement of migration.split("--> statement-breakpoint").map((item) => item.trim()).filter(Boolean)) {
      await db.prepare(statement).run();
    }
    return mf;
  } catch (error) {
    await mf.dispose();
    throw error;
  }
}

test("serves the migrated blog and protects write APIs", async () => {
  const mf = await createRuntime();
  try {
    const homepage = await mf.dispatchFetch("http://localhost/index.html");
    assert.equal(homepage.status, 200);
    assert.match(await homepage.text(), /ian's Blog/);

    const postsResponse = await mf.dispatchFetch("http://localhost/api/posts");
    assert.equal(postsResponse.status, 200);
    const posts = await postsResponse.json();
    assert.equal(posts.posts.length, sourcePosts.length);
    assert.equal(posts.posts[0].title, sourcePosts[0].title);
    assert.deepEqual(posts.posts.map(({ id }) => id), sourcePosts.map(({ id }) => id));

    const [projectsResponse, resumeResponse, musicResponse] = await Promise.all([
      mf.dispatchFetch("http://localhost/api/projects"),
      mf.dispatchFetch("http://localhost/api/resume"),
      mf.dispatchFetch("http://localhost/api/music"),
    ]);
    assert.deepEqual((await projectsResponse.json()).projects.map(({ id }) => id), sourceProjects.map(({ id }) => id));
    assert.equal((await resumeResponse.json()).name, sourceResume.name);
    assert.deepEqual((await musicResponse.json()).tracks.map(({ id }) => id), sourceTracks.map(({ id }) => id));

    const anonymousAdmin = await mf.dispatchFetch("http://localhost/api/admin/posts");
    assert.equal(anonymousAdmin.status, 401);

    const session = await mf.dispatchFetch("http://localhost/api/session", { headers: ownerHeaders });
    assert.equal(session.status, 200);
    assert.deepEqual(await session.json(), { user: "owner@example.com" });

    const newPost = {
      id: "sites-preview-test",
      title: "Sites Preview Test",
      date: "2026-07-10",
      category: "计算机基础",
      tags: ["test"],
      pinned: false,
      summary: "integration test",
      body: ["ok"],
    };
    const created = await mf.dispatchFetch("http://localhost/api/admin/posts", {
      method: "POST",
      headers: { ...ownerHeaders, "content-type": "application/json" },
      body: JSON.stringify(newPost),
    });
    assert.equal(created.status, 201);

    const afterCreate = await mf.dispatchFetch("http://localhost/api/posts");
    assert.equal((await afterCreate.json()).posts.length, sourcePosts.length + 1);

    const deleted = await mf.dispatchFetch("http://localhost/api/admin/posts/sites-preview-test", {
      method: "DELETE",
      headers: ownerHeaders,
    });
    assert.equal(deleted.status, 200);

    const imageForm = new FormData();
    imageForm.append("image", new File([new Uint8Array([137, 80, 78, 71])], "test.png", { type: "image/png" }));
    const encodedImageForm = new Response(imageForm);
    const uploaded = await mf.dispatchFetch("http://localhost/api/admin/upload", {
      method: "POST",
      headers: { ...ownerHeaders, "content-type": encodedImageForm.headers.get("content-type") },
      body: await encodedImageForm.arrayBuffer(),
    });
    assert.equal(uploaded.status, 201, await uploaded.clone().text());
    const uploadedPath = (await uploaded.json()).url;
    assert.match(uploadedPath, /^\/media\/uploads\//);
    const storedImage = await mf.dispatchFetch(new URL(uploadedPath, "http://localhost"));
    assert.equal(storedImage.status, 200);
    assert.equal(storedImage.headers.get("content-type"), "image/png");

  } finally {
    await mf.dispose();
  }
});

test("serves questions without leaking answers and merges uploaded CSV files", async () => {
  const mf = await createRuntime();
  try {
    const publicQuestionBank = await mf.dispatchFetch("http://localhost/api/question-bank");
    assert.equal(publicQuestionBank.status, 200);
    const publicQuestionData = await publicQuestionBank.json();
    assert.equal(publicQuestionData.questions.length, 0);
    assert.deepEqual(publicQuestionData.categorySummary.map(({ id, count }) => ({ id, count })), [
      { id: "cpp", count: 0 },
      { id: "computer-fundamentals", count: 0 },
      { id: "graphics", count: 0 },
      { id: "game-engine", count: 0 },
    ]);

    const csvForm = new FormData();
    csvForm.append("file", new File([
      "题目,参考答案\nC++ 虚函数如何实现,通过虚函数表和虚指针实现动态分派\n你能接受项目技术栈调整吗,可以\n",
    ], "extra.csv", { type: "text/csv" }));
    const encodedCsvForm = new Response(csvForm);
    const uploadedQuestions = await mf.dispatchFetch("http://localhost/api/admin/question-banks", {
      method: "POST",
      headers: { ...ownerHeaders, "content-type": encodedCsvForm.headers.get("content-type") },
      body: await encodedCsvForm.arrayBuffer(),
    });
    assert.equal(uploadedQuestions.status, 201, await uploadedQuestions.clone().text());
    const sourceId = (await uploadedQuestions.json()).source.id;

    const uploadedPublicBank = await mf.dispatchFetch("http://localhost/api/question-bank");
    const uploadedPublicData = await uploadedPublicBank.json();
    assert.equal(uploadedPublicData.questions.length, 1);
    assert.equal(uploadedPublicData.questions[0].category, "cpp");
    assert.equal(uploadedPublicData.categorySummary.find((item) => item.id === "cpp").count, 1);
    assert.equal("answer" in uploadedPublicData.questions[0], false);
    const grade = await mf.dispatchFetch("http://localhost/api/question-bank/grade", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ questionId: uploadedPublicData.questions[0].id, answer: "测试回答包含原理和实现。" }),
    });
    assert.equal(grade.status, 200, await grade.clone().text());
    assert.equal((await grade.json()).mode, "local");

    const xlsx = zipSync({
      "xl/worksheets/sheet1.xml": strToU8('<x:worksheet xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><x:sheetData><x:row r="4"><x:c r="A4" t="str"><x:v>序号</x:v></x:c><x:c r="B4" t="str"><x:v>题目</x:v></x:c></x:row><x:row r="5"><x:c r="A5"><x:v>1</x:v></x:c><x:c r="B5" t="str"><x:v>TCP 三次握手为什么需要三次？</x:v></x:c></x:row></x:sheetData></x:worksheet>'),
    });
    const xlsxForm = new FormData();
    xlsxForm.append("file", new File([xlsx], "extra.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
    const encodedXlsxForm = new Response(xlsxForm);
    const uploadedXlsx = await mf.dispatchFetch("http://localhost/api/admin/question-banks", {
      method: "POST",
      headers: { ...ownerHeaders, "content-type": encodedXlsxForm.headers.get("content-type") },
      body: await encodedXlsxForm.arrayBuffer(),
    });
    assert.equal(uploadedXlsx.status, 201, await uploadedXlsx.clone().text());
    const xlsxSource = (await uploadedXlsx.json()).source;
    const xlsxSourceId = xlsxSource.id;
    assert.equal(xlsxSource.answerCount, 0);

    const existingTargetForm = new FormData();
    existingTargetForm.append("file", new File([
      "题目,参考答案\n请做自我介绍并说明为什么选择游戏客户端方向,介绍项目经历与岗位动机\n",
    ], "forced-graphics.csv", { type: "text/csv" }));
    existingTargetForm.append("targetMode", "existing");
    existingTargetForm.append("categoryId", "graphics");
    const encodedExistingTargetForm = new Response(existingTargetForm);
    const existingTargetUpload = await mf.dispatchFetch("http://localhost/api/admin/question-banks", {
      method: "POST",
      headers: { ...ownerHeaders, "content-type": encodedExistingTargetForm.headers.get("content-type") },
      body: await encodedExistingTargetForm.arrayBuffer(),
    });
    assert.equal(existingTargetUpload.status, 201, await existingTargetUpload.clone().text());
    const existingTargetSourceId = (await existingTargetUpload.json()).source.id;

    const newTargetForm = new FormData();
    newTargetForm.append("file", new File([
      "题目,参考答案\nC++ 客户端帧循环如何组织,按固定更新和渲染阶段组织\n",
    ], "mihoyo-client.csv", { type: "text/csv" }));
    newTargetForm.append("targetMode", "new");
    newTargetForm.append("categoryName", "米哈游客户端专项");
    const encodedNewTargetForm = new Response(newTargetForm);
    const newTargetUpload = await mf.dispatchFetch("http://localhost/api/admin/question-banks", {
      method: "POST",
      headers: { ...ownerHeaders, "content-type": encodedNewTargetForm.headers.get("content-type") },
      body: await encodedNewTargetForm.arrayBuffer(),
    });
    assert.equal(newTargetUpload.status, 201, await newTargetUpload.clone().text());
    const newTargetSource = (await newTargetUpload.json()).source;
    assert.match(newTargetSource.categoryId, /^custom-/);

    const targetedPublicBank = await mf.dispatchFetch("http://localhost/api/question-bank");
    const targetedPublicData = await targetedPublicBank.json();
    assert.equal(
      targetedPublicData.questions.find((item) => item.question.includes("三次握手"))?.hasReference,
      false,
    );
    assert.equal(
      targetedPublicData.questions.find((item) => item.question.includes("自我介绍"))?.category,
      "graphics",
    );
    assert.equal(
      targetedPublicData.categorySummary.find((item) => item.id === newTargetSource.categoryId)?.label,
      "米哈游客户端专项",
    );
    assert.equal(
      targetedPublicData.categorySummary.find((item) => item.id === newTargetSource.categoryId)?.count,
      1,
    );

    const adminQuestionBank = await mf.dispatchFetch("http://localhost/api/admin/question-banks", { headers: ownerHeaders });
    assert.equal(adminQuestionBank.status, 200);
    const adminQuestionData = await adminQuestionBank.json();
    assert.equal(adminQuestionData.sources.length, 4);
    assert.equal(adminQuestionData.categorySummary.reduce((sum, item) => sum + item.count, 0), 4);
    assert.equal(adminQuestionData.categories.some((item) => item.id === newTargetSource.categoryId), true);

    const deletedQuestionBank = await mf.dispatchFetch(`http://localhost/api/admin/question-banks/${encodeURIComponent(sourceId)}`, {
      method: "DELETE",
      headers: ownerHeaders,
    });
    assert.equal(deletedQuestionBank.status, 200);
    const deletedXlsx = await mf.dispatchFetch(`http://localhost/api/admin/question-banks/${encodeURIComponent(xlsxSourceId)}`, {
      method: "DELETE",
      headers: ownerHeaders,
    });
    assert.equal(deletedXlsx.status, 200);
    for (const id of [existingTargetSourceId, newTargetSource.id]) {
      const deletedTarget = await mf.dispatchFetch(`http://localhost/api/admin/question-banks/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: ownerHeaders,
      });
      assert.equal(deletedTarget.status, 200);
    }
  } finally {
    await mf.dispose();
  }
});

test("packages Sites metadata, migrations, and the social preview", async () => {
  const [hosting, migration, socialCard] = await Promise.all([
    readFile(new URL("../dist/.openai/hosting.json", import.meta.url), "utf8"),
    readFile(new URL("../dist/.openai/drizzle/0000_dear_dakota_north.sql", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/og.png", import.meta.url)),
  ]);
  const hostingConfig = JSON.parse(hosting);
  assert.equal(hostingConfig.project_id, "appgprj_6a50eae6ae708191ba7b580ef673f46c");
  assert.equal(hostingConfig.d1, "DB");
  assert.equal(hostingConfig.r2, "MEDIA");
  assert.match(migration, /ian-blog-initial-content/);
  assert.ok(socialCard.length > 100_000);
  assert.ok(fileURLToPath(root).length > 0);
});
