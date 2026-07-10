import { listProjects } from "@/lib/blog-store";
import { errorResponse } from "@/lib/http";

export async function GET() {
  try {
    return Response.json({ projects: await listProjects() });
  } catch (error) {
    return errorResponse(error);
  }
}
