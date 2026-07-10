import { listTracks, uploadTrack } from "@/lib/blog-store";
import { isAuthResponse, requireAdmin } from "@/lib/auth";
import { errorResponse, HttpError } from "@/lib/http";

export async function GET(request: Request) {
  const actor = requireAdmin(request);
  if (isAuthResponse(actor)) return actor;
  try {
    return Response.json({ tracks: await listTracks() });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  const actor = requireAdmin(request);
  if (isAuthResponse(actor)) return actor;
  try {
    const form = await request.formData();
    const audio = form.get("audio");
    if (!(audio instanceof File) || !audio.size) throw new HttpError(400, "请选择音频文件");
    const track = await uploadTrack(audio, String(form.get("title") || ""), String(form.get("artist") || ""), actor);
    return Response.json({ track }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
