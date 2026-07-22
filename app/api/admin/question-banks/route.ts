import { isAuthResponse, requireAdmin } from "@/lib/auth";
import { errorResponse, HttpError } from "@/lib/http";
import { addQuestionBankFile, getQuestionBankState, listMergedQuestions } from "@/lib/question-bank";
import { questionCategoryDefinitions, summarizeQuestionCategories } from "@/lib/question-category";

export async function GET(request: Request) {
  const actor = requireAdmin(request);
  if (isAuthResponse(actor)) return actor;
  try {
    const [state, merged] = await Promise.all([getQuestionBankState(), listMergedQuestions()]);
    return Response.json({
      sources: state.sources,
      questionCount: merged.length,
      referenceCount: merged.filter((item) => item.answer).length,
      categories: questionCategoryDefinitions(state.categories),
      categorySummary: summarizeQuestionCategories(merged, state.categories),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  const actor = requireAdmin(request);
  if (isAuthResponse(actor)) return actor;
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !file.size) throw new HttpError(400, "请选择 CSV 或 XLSX 文件");
    const source = await addQuestionBankFile(file, actor, {
      mode: form.get("targetMode"),
      categoryId: form.get("categoryId"),
      categoryName: form.get("categoryName"),
    });
    return Response.json({ source }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
