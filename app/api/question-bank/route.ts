import { listMergedQuestions, getQuestionBankState } from "@/lib/question-bank";
import { resolveQuestionCategory, summarizeQuestionCategories } from "@/lib/question-category";
import { errorResponse } from "@/lib/http";

export async function GET() {
  try {
    const [questions, state] = await Promise.all([listMergedQuestions(), getQuestionBankState()]);
    return Response.json({
      questions: questions.map((item) => ({
        id: item.id,
        question: item.question,
        category: resolveQuestionCategory(item),
        hasReference: Boolean(item.answer),
      })),
      categories: state.categories,
      categorySummary: summarizeQuestionCategories(questions, state.categories),
      sourceCount: state.sources.length,
      referenceCount: questions.filter((item) => item.answer).length,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
