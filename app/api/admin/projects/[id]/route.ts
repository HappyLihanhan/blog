import { deleteProject, normalizeProject, updateProject } from "@/lib/blog-store";
import { isAuthResponse, requireAdmin } from "@/lib/auth";
import { errorResponse, readJson } from "@/lib/http";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  const actor = requireAdmin(request);
  if (isAuthResponse(actor)) return actor;
  try {
    const { id } = await context.params;
    const project = normalizeProject(await readJson(request));
    await updateProject(decodeURIComponent(id), project, actor);
    return Response.json({ project });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, context: Context) {
  const actor = requireAdmin(request);
  if (isAuthResponse(actor)) return actor;
  try {
    const { id } = await context.params;
    await deleteProject(decodeURIComponent(id), actor);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
