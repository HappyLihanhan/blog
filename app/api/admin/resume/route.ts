import { getResume, saveResume } from "@/lib/blog-store";
import { isAuthResponse, requireAdmin } from "@/lib/auth";
import { errorResponse, readJson } from "@/lib/http";

export async function GET(request: Request) {
  const actor = requireAdmin(request);
  if (isAuthResponse(actor)) return actor;
  try {
    return Response.json(await getResume());
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request) {
  const actor = requireAdmin(request);
  if (isAuthResponse(actor)) return actor;
  try {
    const payload = await readJson<Record<string, unknown>>(request);
    await saveResume(payload, actor);
    return Response.json(payload);
  } catch (error) {
    return errorResponse(error);
  }
}
