import { isAuthResponse, requireAdmin } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { deleteQuestionBank } from "@/lib/question-bank";

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = requireAdmin(request);
  if (isAuthResponse(actor)) return actor;
  try {
    const { id } = await context.params;
    await deleteQuestionBank(id, actor);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
