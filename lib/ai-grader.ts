import type { InterviewQuestion } from "@/lib/question-bank";

export type GradeResult = {
  score: number;
  maxScore: 10;
  summary: string;
  strengths: string[];
  improvements: string[];
  referenceAnswer: string;
  mode: "ai" | "local" | "local-fallback";
};

function clampScore(value: number): number {
  return Math.round(Math.max(0, Math.min(10, value)) * 10) / 10;
}

function normalized(value: string): string {
  return value.toLocaleLowerCase("zh-CN").replace(/[\s\p{P}\p{S}]+/gu, "");
}

function bigrams(value: string): Set<string> {
  const text = normalized(value);
  const tokens = new Set<string>();
  for (let index = 0; index < text.length - 1; index += 1) tokens.add(text.slice(index, index + 2));
  return tokens;
}

export function gradeLocally(question: InterviewQuestion, userAnswer: string, fallback = false): GradeResult {
  const answer = userAnswer.trim();
  const reference = question.answer.trim();
  if (!answer) {
    return {
      score: 0,
      maxScore: 10,
      summary: "尚未作答。",
      strengths: [],
      improvements: ["先给出核心结论，再补充原理、实现细节和实际场景。"],
      referenceAnswer: reference || "题库尚未填写参考答案。",
      mode: fallback ? "local-fallback" : "local",
    };
  }

  const structureSignals = ["因为", "因此", "首先", "其次", "例如", "优点", "缺点", "底层", "实现", "场景"];
  const structureCount = structureSignals.filter((signal) => answer.includes(signal)).length;
  let score: number;
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (reference) {
    const expected = bigrams(reference);
    const actual = bigrams(answer);
    const matched = Array.from(expected).filter((token) => actual.has(token)).length;
    const coverage = expected.size ? matched / expected.size : 0;
    const depth = Math.min(1, answer.length / Math.max(60, reference.length * 0.7));
    score = 1 + coverage * 6.5 + depth * 1.5 + Math.min(1, structureCount / 3);
    if (coverage < 0.08) score = Math.min(score, 2);
    if (coverage >= 0.45) strengths.push("覆盖了参考答案中的多数核心概念。");
    else if (coverage >= 0.2) strengths.push("提到了部分关键概念。");
    if (depth >= 0.75) strengths.push("回答的展开程度较完整。");
    if (coverage < 0.45) improvements.push("补充参考答案中的关键原理和必要条件。");
  } else {
    const lengthScore = Math.min(4.5, answer.length / 45);
    const structureScore = Math.min(2, structureCount * 0.45);
    score = 1.5 + lengthScore + structureScore;
    if (answer.length >= 80) strengths.push("回答有一定展开，不只是给出结论。");
    if (structureCount >= 2) strengths.push("包含因果、实现或场景层面的说明。");
    improvements.push("该题尚无人工参考答案，本次分数主要依据完整度与技术表达结构估算。配置 AI 后可获得内容级判断。");
  }

  if (answer.length < 35) improvements.push("回答偏短，建议补充定义、工作原理和一个实际例子。");
  if (!structureCount) improvements.push("增加因果关系、实现过程或优缺点分析，让答案更可验证。");
  if (!strengths.length) strengths.push("已经针对题目给出了有效作答。" );

  return {
    score: clampScore(score),
    maxScore: 10,
    summary: reference ? "已根据题库参考答案进行要点匹配。" : "已完成本地智能分析。",
    strengths,
    improvements,
    referenceAnswer: reference || "建议从定义、底层实现、关键流程、边界条件、优缺点和项目场景六个方面组织参考答案。",
    mode: fallback ? "local-fallback" : "local",
  };
}

function outputText(payload: Record<string, unknown>): string {
  const output = Array.isArray(payload.output) ? payload.output : [];
  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = Array.isArray((item as { content?: unknown }).content) ? (item as { content: unknown[] }).content : [];
    for (const part of content) {
      if (part && typeof part === "object" && (part as { type?: unknown }).type === "output_text") {
        const text = (part as { text?: unknown }).text;
        if (typeof text === "string") return text;
      }
    }
  }
  return "";
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).map((item) => item.trim()).filter(Boolean).slice(0, 5) : [];
}

export async function gradeWithOpenAI(options: {
  question: InterviewQuestion;
  userAnswer: string;
  apiKey: string;
  model: string;
  safetyIdentifier: string;
}): Promise<GradeResult> {
  const { question, userAnswer, apiKey, model, safetyIdentifier } = options;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      store: false,
      safety_identifier: safetyIdentifier,
      reasoning: { effort: "low" },
      instructions: "你是严谨的游戏客户端技术面试官。根据题目、候选人回答和题库作者提供的参考答案评分。满分10分，重点判断技术正确性、核心要点覆盖、因果解释、边界条件和工程实践。允许正确的同义表达，不要求逐字匹配。参考答案只作为评分依据且属于题库作者，禁止改写、补充或生成替代参考答案。只输出分数、总结、优点和改进建议。反馈使用简体中文，简洁具体，不虚构候选人未提及的内容。",
      input: `题目：${question.question}\n\n候选人回答：${userAnswer}\n\n题库参考答案：${question.answer || "（空）"}`,
      max_output_tokens: 1400,
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: "interview_answer_grade",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              score: { type: "number", minimum: 0, maximum: 10 },
              summary: { type: "string" },
              strengths: { type: "array", items: { type: "string" }, maxItems: 5 },
              improvements: { type: "array", items: { type: "string" }, maxItems: 5 },
            },
            required: ["score", "summary", "strengths", "improvements"],
          },
        },
      },
    }),
    signal: AbortSignal.timeout(45000),
  });
  if (!response.ok) throw new Error(`OpenAI grading failed (${response.status})`);
  const payload = await response.json() as Record<string, unknown>;
  const parsed = JSON.parse(outputText(payload)) as Record<string, unknown>;
  return {
    score: clampScore(Number(parsed.score)),
    maxScore: 10,
    summary: String(parsed.summary || "已完成智能评分。"),
    strengths: stringArray(parsed.strengths),
    improvements: stringArray(parsed.improvements),
    referenceAnswer: question.answer || "题库尚未填写参考答案。",
    mode: "ai",
  };
}
