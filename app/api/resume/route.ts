import { getResume } from "@/lib/blog-store";
import { errorResponse } from "@/lib/http";

export async function GET() {
  try {
    return Response.json(await getResume());
  } catch (error) {
    return errorResponse(error);
  }
}
