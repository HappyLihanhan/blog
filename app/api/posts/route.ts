import { listPosts } from "@/lib/blog-store";
import { errorResponse } from "@/lib/http";

export async function GET() {
  try {
    return Response.json({ posts: await listPosts() });
  } catch (error) {
    return errorResponse(error);
  }
}
