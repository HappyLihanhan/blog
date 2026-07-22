import type { QuestionCategoryDefinition } from "@/lib/question-category";

export type QuestionBankUploadTargetInput = {
  mode?: unknown;
  categoryId?: unknown;
  categoryName?: unknown;
};

export type QuestionBankUploadTarget =
  | { mode: "auto" }
  | { mode: "existing"; categoryId: string }
  | { mode: "new"; categoryId: string; category: QuestionCategoryDefinition };

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : String(value ?? "").trim();
}

export function resolveQuestionBankUploadTarget(
  input: QuestionBankUploadTargetInput,
  categories: QuestionCategoryDefinition[],
  createId: () => string = () => crypto.randomUUID(),
): QuestionBankUploadTarget {
  const mode = clean(input.mode) || "auto";
  if (mode === "auto") return { mode: "auto" };

  if (mode === "existing") {
    const categoryId = clean(input.categoryId);
    if (!categories.some((item) => item.id === categoryId)) {
      throw new Error("选择的子题库不存在，请刷新后重试");
    }
    return { mode, categoryId };
  }

  if (mode === "new") {
    const label = clean(input.categoryName);
    if (!label) throw new Error("请填写新子题库名称");
    if (label.length > 40) throw new Error("子题库名称不能超过 40 个字符");
    if (categories.some((item) => item.label.toLocaleLowerCase("zh-CN") === label.toLocaleLowerCase("zh-CN"))) {
      throw new Error("同名子题库已存在，请直接选择已有子题库");
    }
    const categoryId = `custom-${clean(createId())}`;
    return { mode, categoryId, category: { id: categoryId, label } };
  }

  throw new Error("无效的题库归类方式");
}
