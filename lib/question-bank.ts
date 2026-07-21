import { getD1 } from "@/db";
import { HttpError } from "@/lib/http";
import { readQuestionSheets } from "@/lib/question-bank-import";
import { isQuestionInScope } from "@/lib/question-scope";

export type QuestionBankSource = {
  id: string;
  filename: string;
  importedAt: string;
  questionCount: number;
  answerCount: number;
  preset?: boolean;
};

export type InterviewQuestion = {
  id: string;
  sourceId: string;
  question: string;
  answer: string;
};

export type QuestionBankState = {
  version: number;
  sources: QuestionBankSource[];
  questions: InterviewQuestion[];
};

const QUESTION_HEADERS = new Set(["question", "questions", "题目", "问题", "面试题", "题干"]);
const ANSWER_HEADERS = new Set(["answer", "answers", "答案", "参考答案", "个人答案", "回答", "解析"]);
let storageReady: Promise<void> | null = null;

function now(): string {
  return new Date().toISOString();
}

function ensureStorage(): Promise<void> {
  if (!storageReady) {
    const db = getD1();
    storageReady = db.batch([
      db.prepare("CREATE TABLE IF NOT EXISTS site_documents (key text PRIMARY KEY NOT NULL, payload text NOT NULL, updated_at text NOT NULL)"),
      db.prepare("CREATE TABLE IF NOT EXISTS content_revisions (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, entity_type text NOT NULL, entity_id text NOT NULL, payload text NOT NULL, action text NOT NULL, actor_email text NOT NULL, created_at text NOT NULL)"),
      db.prepare("CREATE INDEX IF NOT EXISTS content_revisions_entity_idx ON content_revisions (entity_type, entity_id)"),
      db.prepare("CREATE TABLE IF NOT EXISTS ai_grade_usage (id text PRIMARY KEY NOT NULL, actor_key text NOT NULL, created_at text NOT NULL)"),
      db.prepare("CREATE INDEX IF NOT EXISTS ai_grade_usage_actor_idx ON ai_grade_usage (actor_key, created_at)"),
    ]).then(() => undefined).catch((error) => {
      storageReady = null;
      throw error;
    });
  }
  return storageReady;
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : String(value ?? "").trim();
}

function normalizeState(value: unknown): QuestionBankState | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Partial<QuestionBankState>;
  if (!Array.isArray(raw.sources) || !Array.isArray(raw.questions)) return null;
  const sources = raw.sources
    .map((source) => ({
      id: clean(source?.id),
      filename: clean(source?.filename),
      importedAt: clean(source?.importedAt),
      questionCount: Number(source?.questionCount) || 0,
      answerCount: Number(source?.answerCount) || 0,
      preset: source?.preset === true,
    }))
    .filter((source) => source.id && source.filename && !source.preset);
  const sourceIds = new Set(sources.map((source) => source.id));
  const questions = raw.questions
    .map((item) => ({
      id: clean(item?.id),
      sourceId: clean(item?.sourceId),
      question: clean(item?.question),
      answer: clean(item?.answer),
    }))
    .filter((item) => item.id && item.question && sourceIds.has(item.sourceId));
  return { version: 1, sources, questions };
}

export async function getQuestionBankState(): Promise<QuestionBankState> {
  await ensureStorage();
  const row = await getD1().prepare("SELECT payload FROM site_documents WHERE key = 'question-banks'").first<{ payload: string }>();
  if (row) {
    try {
      const stored = normalizeState(JSON.parse(row.payload));
      if (stored) return stored;
    } catch {
      // Fall back to the audited seed bundled with the site.
    }
  }
  return { version: 1, sources: [], questions: [] };
}

function questionKey(value: string): string {
  return value.toLocaleLowerCase("zh-CN").replace(/[\s\p{P}\p{S}]+/gu, "");
}

export async function listMergedQuestions(): Promise<InterviewQuestion[]> {
  const state = await getQuestionBankState();
  const merged = new Map<string, InterviewQuestion>();
  for (const item of state.questions) {
    if (!isQuestionInScope(item.question, item.answer)) continue;
    const key = questionKey(item.question);
    const current = merged.get(key);
    if (!current) merged.set(key, { ...item });
    else if (!current.answer && item.answer) current.answer = item.answer;
  }
  return Array.from(merged.values());
}

export async function findQuestion(id: string): Promise<InterviewQuestion> {
  const questions = await listMergedQuestions();
  const question = questions.find((item) => item.id === id);
  if (!question) throw new HttpError(404, "题目不存在或已被移除");
  return question;
}

function headerKey(value: string): string {
  return value.trim().toLocaleLowerCase("zh-CN").replace(/[\s_-]+/g, "");
}

function readQuestionsFromSheets(file: File, sheets: string[][][], sourceId: string): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];
  let foundQuestionHeader = false;
  let foundAnswerHeader = false;
  for (const rows of sheets) {
    const headerRowIndex = rows.findIndex((row) => row.some((cell) => QUESTION_HEADERS.has(headerKey(cell))));
    if (headerRowIndex < 0) continue;
    foundQuestionHeader = true;
    const headers = rows[headerRowIndex].map(headerKey);
    const questionColumn = headers.findIndex((header) => QUESTION_HEADERS.has(header));
    const answerColumn = headers.findIndex((header) => ANSWER_HEADERS.has(header));
    if (answerColumn < 0) continue;
    foundAnswerHeader = true;
    for (const row of rows.slice(headerRowIndex + 1)) {
      const question = clean(row[questionColumn]);
      if (!question) continue;
      const answer = clean(row[answerColumn]);
      if (!isQuestionInScope(question, answer)) continue;
      questions.push({
        id: `${sourceId}-${String(questions.length + 1).padStart(4, "0")}`,
        sourceId,
        question,
        answer,
      });
    }
  }
  if (!foundQuestionHeader) throw new HttpError(400, "没有找到题目列，请使用“问题/题目/question”作为表头");
  if (!foundAnswerHeader) throw new HttpError(400, "没有找到答案列，请使用“答案/参考答案/个人答案/answer”作为表头");
  if (!questions.length) throw new HttpError(400, `${file.name} 中没有符合 C++、计算机基础或图形学范围的题目`);
  return questions;
}

async function saveState(state: QuestionBankState, actor: string, action: string, sourceId: string, detail: unknown): Promise<void> {
  await ensureStorage();
  const db = getD1();
  await db.batch([
    db.prepare("INSERT INTO content_revisions (entity_type, entity_id, payload, action, actor_email, created_at) VALUES ('question-bank', ?, ?, ?, ?, ?)")
      .bind(sourceId, JSON.stringify(detail), action, actor, now()),
    db.prepare("INSERT INTO site_documents (key, payload, updated_at) VALUES ('question-banks', ?, ?) ON CONFLICT(key) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at")
      .bind(JSON.stringify(state), now()),
  ]);
}

export async function addQuestionBankFile(file: File, actor: string): Promise<QuestionBankSource> {
  if (!/\.(csv|xlsx)$/i.test(file.name)) throw new HttpError(400, "只支持 CSV 和 XLSX 文件");
  if (file.size > 5 * 1024 * 1024) throw new HttpError(400, "题库文件不能超过 5MB");
  const state = await getQuestionBankState();
  const sourceId = `file-${crypto.randomUUID()}`;
  let sheets: string[][][];
  try {
    sheets = await readQuestionSheets(file);
  } catch (error) {
    throw new HttpError(400, error instanceof Error ? error.message : "题库文件读取失败");
  }
  const questions = readQuestionsFromSheets(file, sheets, sourceId);
  const source: QuestionBankSource = {
    id: sourceId,
    filename: file.name,
    importedAt: now(),
    questionCount: questions.length,
    answerCount: questions.filter((item) => item.answer).length,
  };
  state.sources.push(source);
  state.questions.push(...questions);
  await saveState(state, actor, "upload", source.id, source);
  return source;
}

export async function deleteQuestionBank(sourceId: string, actor: string): Promise<void> {
  const state = await getQuestionBankState();
  const source = state.sources.find((item) => item.id === sourceId);
  if (!source) throw new HttpError(404, "题库文件不存在");
  if (source.preset) throw new HttpError(400, "预置题库不能从后台删除");
  state.sources = state.sources.filter((item) => item.id !== sourceId);
  state.questions = state.questions.filter((item) => item.sourceId !== sourceId);
  await saveState(state, actor, "delete", sourceId, source);
}

export async function consumeAiQuota(actorKey: string): Promise<void> {
  await ensureStorage();
  const db = getD1();
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const [actor, total] = await Promise.all([
    db.prepare("SELECT COUNT(*) AS count FROM ai_grade_usage WHERE actor_key = ? AND created_at >= ?").bind(actorKey, hourAgo).first<{ count: number }>(),
    db.prepare("SELECT COUNT(*) AS count FROM ai_grade_usage WHERE created_at >= ?").bind(dayAgo).first<{ count: number }>(),
  ]);
  if ((actor?.count ?? 0) >= 30) throw new HttpError(429, "智能评分次数过多，请稍后再试");
  if ((total?.count ?? 0) >= 500) throw new HttpError(429, "今日智能评分额度已用完，请明天再试");
  await db.batch([
    db.prepare("DELETE FROM ai_grade_usage WHERE created_at < ?").bind(dayAgo),
    db.prepare("INSERT INTO ai_grade_usage (id, actor_key, created_at) VALUES (?, ?, ?)").bind(crypto.randomUUID(), actorKey, now()),
  ]);
}
