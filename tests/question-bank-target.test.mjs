import assert from "node:assert/strict";
import test from "node:test";

import { resolveQuestionBankUploadTarget } from "../lib/question-bank-target.ts";

const categories = [
  { id: "cpp", label: "C++" },
  { id: "graphics", label: "图形学" },
  { id: "existing-custom", label: "已有专项" },
];

test("an omitted upload target keeps automatic classification", () => {
  assert.deepEqual(resolveQuestionBankUploadTarget({}, categories), { mode: "auto" });
});

test("an existing sub-bank must point at a known category", () => {
  assert.deepEqual(
    resolveQuestionBankUploadTarget({ mode: "existing", categoryId: "graphics" }, categories),
    { mode: "existing", categoryId: "graphics" },
  );
  assert.throws(
    () => resolveQuestionBankUploadTarget({ mode: "existing", categoryId: "missing" }, categories),
    /选择的子题库不存在/,
  );
});

test("a new sub-bank gets a durable id and rejects duplicate names", () => {
  assert.deepEqual(
    resolveQuestionBankUploadTarget(
      { mode: "new", categoryName: " 米哈游客户端 " },
      categories,
      () => "fixed-id",
    ),
    {
      mode: "new",
      categoryId: "custom-fixed-id",
      category: { id: "custom-fixed-id", label: "米哈游客户端" },
    },
  );
  assert.throws(
    () => resolveQuestionBankUploadTarget({ mode: "new", categoryName: "已有专项" }, categories),
    /同名子题库已存在/,
  );
});
