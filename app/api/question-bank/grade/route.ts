import { getRuntimeString } from "@/db";
import { authenticatedEmail } from "@/lib/auth";
import { gradeLocally, gradeWithOpenAI } from "@/lib/ai-grader";
import { errorResponse, HttpError, readJson } from "@/lib/http";
import { consumeAiQuota, findQuestion } from "@/lib/question-bank";

type GradeRequest = { questionId?: unknown; answer?: unknown };

async function safetyId(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

export async function POST(request: Request) {
  try {
    const body = await readJson<GradeRequest>(request);
    const questionId = String(body.questionId || "").trim();
    const answer = String(body.answer || "").trim();
    if (!questionId) throw new HttpError(400, "缺少题目 ID");
    if (!answer) throw new HttpError(400, "请先输入你的答案");
    if (answer.length > 6000) throw new HttpError(400, "答案不能超过 6000 个字符");
    const question = await findQuestion(questionId);
    const apiKey = getRuntimeString("OPENAI_API_KEY");
    if (!apiKey) return Response.json(gradeLocally(question, answer));

    const identity = authenticatedEmail(request) || request.headers.get("cf-connecting-ip") || "anonymous";
    const identifier = await safetyId(identity);
    await consumeAiQuota(identifier);
    try {
      return Response.json(await gradeWithOpenAI({
        question,
        userAnswer: answer,
        apiKey,
        model: getRuntimeString("OPENAI_MODEL") || "gpt-5.6-luna",
        safetyIdentifier: identifier,
      }));
    } catch {
      return Response.json(gradeLocally(question, answer, true));
    }
  } catch (error) {
    return errorResponse(error);
  }
}
