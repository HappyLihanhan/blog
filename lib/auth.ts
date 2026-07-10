const USER_EMAIL_HEADER = "oai-authenticated-user-email";

export function authenticatedEmail(request: Request): string | null {
  const email = request.headers.get(USER_EMAIL_HEADER)?.trim().toLowerCase();
  return email || null;
}

export function requireAdmin(request: Request): string | Response {
  const email = authenticatedEmail(request);
  if (email) return email;
  return Response.json({ error: "请先通过 Sites 私有访问验证" }, { status: 401 });
}

export function isAuthResponse(value: string | Response): value is Response {
  return value instanceof Response;
}
