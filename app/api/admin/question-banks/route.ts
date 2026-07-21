import { isAuthResponse, requireAdmin } from "@/lib/auth";
import { errorResponse, HttpError } from "@/lib/http";
import { addQuestionBankFile, getQuestionBankState, listMergedQuestions } from "@/lib/question-bank";
import { summarizeQuestionCategories } from "@/lib/question-category";

export async function GET(request: Request) {
  const actor = requireAdmin(request);
  if (isAuthResponse(actor)) return actor;
  try {
    const [state, merged] = await Promise.all([getQuestionBankState(), listMergedQuestions()]);
    return Response.json({
      sources: state.sources,
      questionCount: merged.length,
      referenceCount: merged.filter((item) => item.answer).length,
      categorySummary: summarizeQuestionCategories(merged),
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
    return Response.json({ source: await addQuestionBankFile(file, actor) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
