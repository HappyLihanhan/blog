export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new HttpError(400, "请求数据格式不正确");
  }
}

export function errorResponse(error: unknown): Response {
  if (error instanceof HttpError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message.includes("UNIQUE constraint failed")) {
    return Response.json({ error: "ID 已存在" }, { status: 409 });
  }
  return Response.json({ error: "服务器处理失败" }, { status: 500 });
}
