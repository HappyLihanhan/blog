import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

test("build includes the random question page and protected admin upload channel", async () => {
  const [page, admin, quizScript, adminScript, staticBank] = await Promise.all([
    readFile(new URL("../quiz.html", import.meta.url), "utf8"),
    readFile(new URL("../admin.html", import.meta.url), "utf8"),
    readFile(new URL("../quiz.js", import.meta.url), "utf8"),
    readFile(new URL("../admin.js", import.meta.url), "utf8"),
    readFile(new URL("../data/question-banks.json", import.meta.url), "utf8"),
  ]);
  const parsedStaticBank = JSON.parse(staticBank);
  assert.equal(parsedStaticBank.version, 1);
  assert.equal(Array.isArray(parsedStaticBank.sources), true);
  assert.equal(Array.isArray(parsedStaticBank.questions), true);
  assert.equal(parsedStaticBank.sources.some((source) => source.id === "preset"), false);
  assert.match(page, /data-quiz-stage/);
  assert.match(page, /data-quiz-modal/);
  assert.match(page, /data-quiz-category-options/);
  assert.match(page, /question-categories\.js[^]*quiz\.js/);
  assert.match(page, /data-grade-result/);
  assert.match(quizScript, /\/api\/question-bank\/grade/);
  assert.match(admin, /data-content-type="questionBank"/);
  assert.match(admin, /data-question-bank-files/);
  assert.match(admin, /data-question-bank-category-stats/);
  assert.match(admin, /\.xlsx/);
  assert.match(adminScript, /\/api\/admin\/question-banks/);
});

test("random question navigation appears directly after portfolio", async () => {
  const pages = ["index.html", "notes.html", "projects.html", "portfolio.html", "resume.html", "about.html", "quiz.html"];
  for (const filename of pages) {
    const html = await readFile(new URL(`../${filename}`, import.meta.url), "utf8");
    assert.match(html, /portfolio\.html">作品集<\/a>\s*<a href="\.\/quiz\.html">随机题库<\/a>/);
  }
});

test("GitHub Pages falls back to the published static question bank", async () => {
  const [categoryScript, script] = await Promise.all([
    readFile(new URL("../question-categories.js", import.meta.url), "utf8"),
    readFile(new URL("../quiz.js", import.meta.url), "utf8"),
  ]);
  const elements = new Map();
  const requestedPaths = [];
  const element = () => ({
    listeners: {},
    addEventListener(type, listener) { this.listeners[type] = listener; },
    classList: { add() {}, remove() {}, toggle() {} },
    disabled: true,
    hidden: false,
    innerHTML: "",
    max: "",
    scrollIntoView() {},
    textContent: "",
    value: "5",
  });
  class FakeInput {
    constructor(value, checked) {
      this.value = value;
      this.checked = checked;
    }
    matches(selector) {
      return selector === "[data-quiz-category]";
    }
  }
  const document = {
    addEventListener() {},
    body: { classList: { add() {}, remove() {} } },
    createElement: element,
    querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, element());
      return elements.get(selector);
    },
  };
  const fetch = async (path) => {
    requestedPaths.push(path);
    if (path === "/api/question-bank") {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    }
    if (path === "./data/question-banks.json") {
      return Response.json({
        sources: [{ id: "preset", filename: "preset.csv" }],
        questions: [
          { id: "q1", sourceId: "preset", question: "C++ 虚函数表如何工作？", answer: "虚函数表保存虚函数地址，对象通过虚指针访问。" },
          { id: "q2", sourceId: "preset", question: "TCP 为什么需要三次握手？", answer: "用于同步初始序列号并确认双方收发能力。" },
          { id: "q3", sourceId: "preset", question: "延迟渲染的 G-Buffer 保存哪些数据？", answer: "保存法线、材质和深度等信息。" },
          { id: "q4", sourceId: "preset", question: "你能接受项目技术栈调整吗？", answer: "可以。" },
        ],
      });
    }
    throw new Error(`Unexpected fetch: ${path}`);
  };

  const context = {
    document,
    fetch,
    location: { hostname: "ian.github.io" },
    Response,
    setTimeout,
    HTMLInputElement: FakeInput,
  };
  vm.runInNewContext(categoryScript, context);
  vm.runInNewContext(script, context);
  await new Promise((resolve) => setTimeout(resolve, 20));

  assert.deepEqual(requestedPaths, ["./data/question-banks.json"]);
  assert.equal(elements.get("[data-quiz-count]").textContent, "3");
  assert.match(elements.get("[data-quiz-category-options]").innerHTML, /C\+\+/);
  assert.match(elements.get("[data-quiz-category-options]").innerHTML, /计算机基础/);
  assert.match(elements.get("[data-quiz-category-options]").innerHTML, /图形学/);
  assert.equal(elements.get("[data-start-quiz]").disabled, false);

  const categoryOptions = elements.get("[data-quiz-category-options]");
  categoryOptions.listeners.change({ target: new FakeInput("cpp", false) });
  assert.equal(elements.get("[data-quiz-count]").textContent, "2");
  categoryOptions.listeners.change({ target: new FakeInput("computer-fundamentals", false) });
  categoryOptions.listeners.change({ target: new FakeInput("graphics", false) });
  assert.equal(elements.get("[data-quiz-count]").textContent, "0");
  assert.equal(elements.get("[data-start-quiz]").disabled, true);
});
