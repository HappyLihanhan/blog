import { listTracks } from "@/lib/blog-store";
import { errorResponse } from "@/lib/http";

export async function GET() {
  try {
    return Response.json({ tracks: await listTracks() });
  } catch (error) {
    return errorResponse(error);
  }
}
