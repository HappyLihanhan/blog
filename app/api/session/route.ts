import { authenticatedEmail } from "@/lib/auth";

export async function GET(request: Request) {
  const email = authenticatedEmail(request);
  if (!email) return Response.json({ error: "请先登录后台" }, { status: 401 });
  return Response.json({ user: email });
}
