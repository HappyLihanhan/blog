import { createPortfolioItem, listPortfolio, normalizePortfolioItem } from "@/lib/blog-store";
import { isAuthResponse, requireAdmin } from "@/lib/auth";
import { errorResponse, readJson } from "@/lib/http";

export async function GET(request: Request) {
  const actor = requireAdmin(request); if (isAuthResponse(actor)) return actor;
  try { return Response.json({ items: await listPortfolio() }); }
  catch (error) { return errorResponse(error); }
}

export async function POST(request: Request) {
  const actor = requireAdmin(request); if (isAuthResponse(actor)) return actor;
  try {
    const item = normalizePortfolioItem(await readJson(request));
    await createPortfolioItem(item, actor);
    return Response.json({ item }, { status: 201 });
  } catch (error) { return errorResponse(error); }
}
