import { deleteTrack } from "@/lib/blog-store";
import { isAuthResponse, requireAdmin } from "@/lib/auth";
import { errorResponse } from "@/lib/http";

type Context = { params: Promise<{ id: string }> };

export async function DELETE(request: Request, context: Context) {
  const actor = requireAdmin(request);
  if (isAuthResponse(actor)) return actor;
  try {
    const { id } = await context.params;
    await deleteTrack(decodeURIComponent(id), actor);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
