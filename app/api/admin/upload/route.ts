import { uploadImage } from "@/lib/blog-store";
import { isAuthResponse, requireAdmin } from "@/lib/auth";
import { errorResponse, HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const actor = requireAdmin(request);
  if (isAuthResponse(actor)) return actor;
  try {
    const form = await request.formData();
    const image = form.get("image");
    if (!(image instanceof File) || !image.size) throw new HttpError(400, "请选择图片");
    return Response.json({ url: await uploadImage(image, actor) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
