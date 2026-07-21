import assert from "node:assert/strict";
import test from "node:test";
import { strToU8, zipSync } from "fflate";

import { readQuestionSheets } from "../lib/question-bank-import.ts";


test("reads question and answer columns from an xlsx worksheet", async () => {
  const workbook = zipSync({
    "xl/sharedStrings.xml": strToU8(`
      <sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
        <si><t>题目</t></si><si><t>答案</t></si>
        <si><t>什么是多态？</t></si><si><t>同一接口可以对应不同实现。</t></si>
      </sst>
    `),
    "xl/worksheets/sheet1.xml": strToU8(`
      <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>
        <row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c></row>
        <row r="2"><c r="A2" t="s"><v>2</v></c><c r="B2" t="s"><v>3</v></c></row>
      </sheetData></worksheet>
    `),
  });
  const file = new File([workbook], "questions.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const sheets = await readQuestionSheets(file);

  assert.deepEqual(sheets, [[
    ["题目", "答案"],
    ["什么是多态？", "同一接口可以对应不同实现。"],
  ]]);
});

test("continues to read quoted csv cells", async () => {
  const file = new File([
    '\uFEFF题目,答案\n"进程,线程有什么区别？","进程拥有资源，线程共享进程资源。"\n',
  ], "questions.csv", { type: "text/csv" });

  const sheets = await readQuestionSheets(file);

  assert.deepEqual(sheets, [[
    ["题目", "答案"],
    ["进程,线程有什么区别？", "进程拥有资源，线程共享进程资源。"],
  ]]);
});
