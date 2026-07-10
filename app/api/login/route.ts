import { authenticatedEmail } from "@/lib/auth";

export async function POST(request: Request) {
  const email = authenticatedEmail(request);
  if (!email) return Response.json({ error: "请先通过 Sites 私有访问验证" }, { status: 401 });
  return Response.json({ user: email });
}
