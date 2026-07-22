import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

test("the existing-sub-bank selector falls back to the category summary", async () => {
  const script = await readFile(new URL("../admin.js", import.meta.url), "utf8");
  const start = script.indexOf("function renderQuestionBankAdmin()");
  const end = script.indexOf("\nasync function loadQuestionBankForAdmin", start);
  assert.ok(start >= 0 && end > start, "question-bank renderer should be extractable");

  const existingCategory = { innerHTML: "", value: "" };
  const context = {
    state: {
      questionBank: {
        sources: [],
        questionCount: 350,
        referenceCount: 350,
        categorySummary: [
          { id: "cpp", label: "C++", count: 87 },
          { id: "computer-fundamentals", label: "计算机基础", count: 197 },
          { id: "graphics", label: "图形学", count: 29 },
          { id: "game-engine", label: "游戏引擎", count: 37 },
        ],
      },
    },
    els: {
      questionBankExistingCategory: existingCategory,
      questionBankTotal: { textContent: "" },
      questionBankReferences: { textContent: "" },
      questionBankCategoryStats: { innerHTML: "" },
      questionBankList: { innerHTML: "" },
    },
    escapeHtml(value) { return String(value); },
    setText(element, value) { element.textContent = value; },
  };

  vm.runInNewContext(`${script.slice(start, end)}\nrenderQuestionBankAdmin();`, context);

  assert.match(existingCategory.innerHTML, /value="cpp"/);
  assert.match(existingCategory.innerHTML, /C\+\+/);
  assert.doesNotMatch(existingCategory.innerHTML, /暂无子题库/);
});
