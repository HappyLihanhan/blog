import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";
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
