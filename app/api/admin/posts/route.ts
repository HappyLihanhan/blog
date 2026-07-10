import { createPost, listPosts, normalizePost } from "@/lib/blog-store";
import { isAuthResponse, requireAdmin } from "@/lib/auth";
import { errorResponse, readJson } from "@/lib/http";

export async function GET(request: Request) {
  const actor = requireAdmin(request);
  if (isAuthResponse(actor)) return actor;
  try {
    return Response.json({ posts: await listPosts() });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  const actor = requireAdmin(request);
  if (isAuthResponse(actor)) return actor;
  try {
    const post = normalizePost(await readJson(request));
    await createPost(post);
    return Response.json({ post }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
