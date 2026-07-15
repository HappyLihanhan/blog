import { uploadPortfolioMedia } from "@/lib/blog-store";
import { isAuthResponse, requireAdmin } from "@/lib/auth";
import { errorResponse, HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const actor = requireAdmin(request); if (isAuthResponse(actor)) return actor;
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !file.size) throw new HttpError(400, "请选择图片或视频");
    return Response.json(await uploadPortfolioMedia(file, actor), { status: 201 });
  } catch (error) { return errorResponse(error); }
}
