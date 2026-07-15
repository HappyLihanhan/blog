import { deletePortfolioItem, normalizePortfolioItem, updatePortfolioItem } from "@/lib/blog-store";
import { isAuthResponse, requireAdmin } from "@/lib/auth";
import { errorResponse, readJson } from "@/lib/http";

type Context = { params: Promise<{ id: string }> };
export async function PUT(request: Request, context: Context) {
  const actor = requireAdmin(request); if (isAuthResponse(actor)) return actor;
  try {
    const { id } = await context.params;
    const item = normalizePortfolioItem(await readJson(request));
    await updatePortfolioItem(decodeURIComponent(id), item, actor);
    return Response.json({ item });
  } catch (error) { return errorResponse(error); }
}
export async function DELETE(request: Request, context: Context) {
  const actor = requireAdmin(request); if (isAuthResponse(actor)) return actor;
  try { const { id } = await context.params; await deletePortfolioItem(decodeURIComponent(id), actor); return Response.json({ ok: true }); }
  catch (error) { return errorResponse(error); }
}
