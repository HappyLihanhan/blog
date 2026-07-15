import { getD1, getMediaBucket } from "@/db";
import { HttpError } from "@/lib/http";
import portfolioSeed from "@/data/portfolio.json";

export type BlogPost = {
  id: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  pinned: boolean;
  summary: string;
  body: string[];
};

export type BlogProject = {
  id: string;
  title: string;
  date: string;
  type: string;
  tags: string[];
  summary: string;
  body: string[];
};

export type PortfolioMedia = { type: "image" | "video" | "iframe"; src: string; poster?: string; alt?: string; title?: string };
export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  badge: string;
  summary: string;
  tags: string[];
  cover: PortfolioMedia;
  demo?: PortfolioMedia;
};

export type MusicTrack = {
  id: string;
  title: string;
  artist: string;
  url: string;
  filename: string;
  createdAt: string;
};

type PostRow = Omit<BlogPost, "tags" | "body" | "pinned"> & {
  tags: string;
  body: string;
  pinned: number;
};

type ProjectRow = Omit<BlogProject, "tags" | "body"> & {
  tags: string;
  body: string;
};

function now(): string {
  return new Date().toISOString();
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).map((item) => item.trim()).filter(Boolean) : [];
}

function parseList(value: string): string[] {
  try {
    return stringList(JSON.parse(value));
  } catch {
    return [];
  }
}

export function normalizePost(value: Partial<BlogPost>): BlogPost {
  const id = stringValue(value.id);
  const title = stringValue(value.title);
  if (!id || !title) throw new HttpError(400, "文章 ID 和标题不能为空");
  return {
    id,
    title,
    date: stringValue(value.date),
    category: stringValue(value.category),
    tags: stringList(value.tags),
    pinned: value.pinned === true,
    summary: stringValue(value.summary),
    body: stringList(value.body),
  };
}

export function normalizeProject(value: Partial<BlogProject>): BlogProject {
  const id = stringValue(value.id);
  const title = stringValue(value.title);
  if (!id || !title) throw new HttpError(400, "项目 ID 和标题不能为空");
  return {
    id,
    title,
    date: stringValue(value.date),
    type: stringValue(value.type) || title,
    tags: stringList(value.tags),
    summary: stringValue(value.summary),
    body: stringList(value.body),
  };
}

function normalizePortfolioMedia(value: unknown, fallbackType: PortfolioMedia["type"]): PortfolioMedia {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const requestedType = stringValue(raw.type);
  const type = requestedType === "image" || requestedType === "video" || requestedType === "iframe" ? requestedType : fallbackType;
  return { type, src: stringValue(raw.src), poster: stringValue(raw.poster), alt: stringValue(raw.alt), title: stringValue(raw.title) };
}

export function normalizePortfolioItem(value: Partial<PortfolioItem>): PortfolioItem {
  const id = stringValue(value.id);
  const title = stringValue(value.title);
  if (!id || !title) throw new HttpError(400, "作品 ID 和标题不能为空");
  const cover = normalizePortfolioMedia(value.cover, "image");
  if (!cover.src) throw new HttpError(400, "请上传或填写作品封面");
  const demo = value.demo && normalizePortfolioMedia(value.demo, "video");
  return {
    id,
    title,
    category: stringValue(value.category) || "其他作品",
    badge: stringValue(value.badge) || stringValue(value.category) || "作品",
    summary: stringValue(value.summary),
    tags: stringList(value.tags),
    cover,
    ...(demo?.src ? { demo } : {}),
  };
}

function postFromRow(row: PostRow): BlogPost {
  return { ...row, tags: parseList(row.tags), body: parseList(row.body), pinned: Boolean(row.pinned) };
}

function projectFromRow(row: ProjectRow): BlogProject {
  return { ...row, tags: parseList(row.tags), body: parseList(row.body) };
}

export async function listPosts(): Promise<BlogPost[]> {
  const rows = await getD1()
    .prepare("SELECT id, title, date, category, tags, pinned, summary, body FROM posts ORDER BY position, id")
    .all<PostRow>();
  return rows.results.map(postFromRow);
}

export async function createPost(post: BlogPost): Promise<void> {
  const db = getD1();
  const next = await db.prepare("SELECT COALESCE(MIN(position), 0) - 1 AS value FROM posts").first<{ value: number }>();
  await db
    .prepare("INSERT INTO posts (id, title, date, category, tags, pinned, summary, body, position, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(post.id, post.title, post.date, post.category, JSON.stringify(post.tags), post.pinned ? 1 : 0, post.summary, JSON.stringify(post.body), next?.value ?? 0, now())
    .run();
}

export async function updatePost(originalId: string, post: BlogPost, actor: string): Promise<void> {
  const db = getD1();
  const current = await db.prepare("SELECT * FROM posts WHERE id = ?").bind(originalId).first<Record<string, unknown>>();
  if (!current) throw new HttpError(404, "文章不存在");
  await db.batch([
    db.prepare("INSERT INTO content_revisions (entity_type, entity_id, payload, action, actor_email, created_at) VALUES ('post', ?, ?, 'update', ?, ?)").bind(originalId, JSON.stringify(current), actor, now()),
    db.prepare("UPDATE posts SET id = ?, title = ?, date = ?, category = ?, tags = ?, pinned = ?, summary = ?, body = ?, updated_at = ? WHERE id = ?").bind(post.id, post.title, post.date, post.category, JSON.stringify(post.tags), post.pinned ? 1 : 0, post.summary, JSON.stringify(post.body), now(), originalId),
  ]);
}

export async function deletePost(id: string, actor: string): Promise<void> {
  const db = getD1();
  const current = await db.prepare("SELECT * FROM posts WHERE id = ?").bind(id).first<Record<string, unknown>>();
  if (!current) throw new HttpError(404, "文章不存在");
  await db.batch([
    db.prepare("INSERT INTO content_revisions (entity_type, entity_id, payload, action, actor_email, created_at) VALUES ('post', ?, ?, 'delete', ?, ?)").bind(id, JSON.stringify(current), actor, now()),
    db.prepare("DELETE FROM posts WHERE id = ?").bind(id),
  ]);
}

export async function listProjects(): Promise<BlogProject[]> {
  const rows = await getD1()
    .prepare("SELECT id, title, date, type, tags, summary, body FROM projects ORDER BY position, id")
    .all<ProjectRow>();
  return rows.results.map(projectFromRow);
}

export async function createProject(project: BlogProject): Promise<void> {
  const db = getD1();
  const next = await db.prepare("SELECT COALESCE(MIN(position), 0) - 1 AS value FROM projects").first<{ value: number }>();
  await db
    .prepare("INSERT INTO projects (id, title, date, type, tags, summary, body, position, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(project.id, project.title, project.date, project.type, JSON.stringify(project.tags), project.summary, JSON.stringify(project.body), next?.value ?? 0, now())
    .run();
}

export async function updateProject(originalId: string, project: BlogProject, actor: string): Promise<void> {
  const db = getD1();
  const current = await db.prepare("SELECT * FROM projects WHERE id = ?").bind(originalId).first<Record<string, unknown>>();
  if (!current) throw new HttpError(404, "项目复盘不存在");
  await db.batch([
    db.prepare("INSERT INTO content_revisions (entity_type, entity_id, payload, action, actor_email, created_at) VALUES ('project', ?, ?, 'update', ?, ?)").bind(originalId, JSON.stringify(current), actor, now()),
    db.prepare("UPDATE projects SET id = ?, title = ?, date = ?, type = ?, tags = ?, summary = ?, body = ?, updated_at = ? WHERE id = ?").bind(project.id, project.title, project.date, project.type, JSON.stringify(project.tags), project.summary, JSON.stringify(project.body), now(), originalId),
  ]);
}

export async function deleteProject(id: string, actor: string): Promise<void> {
  const db = getD1();
  const current = await db.prepare("SELECT * FROM projects WHERE id = ?").bind(id).first<Record<string, unknown>>();
  if (!current) throw new HttpError(404, "项目复盘不存在");
  await db.batch([
    db.prepare("INSERT INTO content_revisions (entity_type, entity_id, payload, action, actor_email, created_at) VALUES ('project', ?, ?, 'delete', ?, ?)").bind(id, JSON.stringify(current), actor, now()),
    db.prepare("DELETE FROM projects WHERE id = ?").bind(id),
  ]);
}

export async function listPortfolio(): Promise<PortfolioItem[]> {
  const row = await getD1().prepare("SELECT payload FROM site_documents WHERE key = 'portfolio'").first<{ payload: string }>();
  let items: unknown = portfolioSeed.items;
  if (row) {
    try {
      const stored = JSON.parse(row.payload) as unknown;
      if (Array.isArray(stored)) {
        // The first portfolio release could leave an uninitialised empty array in D1.
        items = stored.length ? stored : portfolioSeed.items;
      } else if (stored && typeof stored === "object" && Array.isArray((stored as { items?: unknown }).items)) {
        items = (stored as { items: unknown[] }).items;
      }
    } catch { items = portfolioSeed.items; }
  }
  return Array.isArray(items) ? items.map((item) => normalizePortfolioItem(item as Partial<PortfolioItem>)) : [];
}

async function savePortfolio(items: PortfolioItem[], actor: string, action: string, entityId: string): Promise<void> {
  const db = getD1();
  await db.batch([
    db.prepare("INSERT INTO content_revisions (entity_type, entity_id, payload, action, actor_email, created_at) VALUES ('portfolio', ?, ?, ?, ?, ?)").bind(entityId, JSON.stringify(await listPortfolio()), action, actor, now()),
    db.prepare("INSERT INTO site_documents (key, payload, updated_at) VALUES ('portfolio', ?, ?) ON CONFLICT(key) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at").bind(JSON.stringify({ version: 1, initialized: true, items }), now()),
  ]);
}

export async function createPortfolioItem(item: PortfolioItem, actor: string): Promise<void> {
  const items = await listPortfolio();
  if (items.some((entry) => entry.id === item.id)) throw new HttpError(409, "作品 ID 已存在");
  await savePortfolio([item, ...items], actor, "create", item.id);
}

export async function updatePortfolioItem(originalId: string, item: PortfolioItem, actor: string): Promise<void> {
  const items = await listPortfolio();
  const index = items.findIndex((entry) => entry.id === originalId);
  if (index < 0) throw new HttpError(404, "作品不存在");
  if (item.id !== originalId && items.some((entry) => entry.id === item.id)) throw new HttpError(409, "作品 ID 已存在");
  items[index] = item;
  await savePortfolio(items, actor, "update", originalId);
}

export async function deletePortfolioItem(id: string, actor: string): Promise<void> {
  const items = await listPortfolio();
  if (!items.some((entry) => entry.id === id)) throw new HttpError(404, "作品不存在");
  await savePortfolio(items.filter((entry) => entry.id !== id), actor, "delete", id);
}

export async function getResume(): Promise<Record<string, unknown>> {
  const row = await getD1().prepare("SELECT payload FROM site_documents WHERE key = 'resume'").first<{ payload: string }>();
  if (!row) return {};
  try {
    return JSON.parse(row.payload) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function saveResume(payload: Record<string, unknown>, actor: string): Promise<void> {
  const db = getD1();
  const current = await getResume();
  await db.batch([
    db.prepare("INSERT INTO content_revisions (entity_type, entity_id, payload, action, actor_email, created_at) VALUES ('resume', 'resume', ?, 'update', ?, ?)").bind(JSON.stringify(current), actor, now()),
    db.prepare("INSERT INTO site_documents (key, payload, updated_at) VALUES ('resume', ?, ?) ON CONFLICT(key) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at").bind(JSON.stringify(payload), now()),
  ]);
}

export async function listTracks(): Promise<MusicTrack[]> {
  const rows = await getD1()
    .prepare("SELECT id, title, artist, url, filename, created_at AS createdAt FROM tracks ORDER BY position, id")
    .all<MusicTrack>();
  return rows.results;
}

function slugify(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "track";
}

function safeFilename(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-|-$/g, "").slice(-100) || "file";
}

export async function uploadImage(file: File, actor: string): Promise<string> {
  const allowed = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);
  if (!allowed.has(file.type)) throw new HttpError(400, "只支持 PNG、JPG、GIF 和 WEBP 图片");
  if (file.size > 5 * 1024 * 1024) throw new HttpError(400, "图片不能超过 5MB");
  const key = `uploads/${Date.now()}-${crypto.randomUUID()}-${safeFilename(file.name)}`;
  await getMediaBucket().put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
  await getD1()
    .prepare("INSERT INTO media (id, object_key, filename, content_type, size, created_at, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .bind(crypto.randomUUID(), key, file.name, file.type, file.size, now(), actor)
    .run();
  return `/media/${key}`;
}

export async function uploadPortfolioMedia(file: File, actor: string): Promise<{ url: string; type: "image" | "video" }> {
  const imageTypes = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);
  const videoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);
  const type = imageTypes.has(file.type) ? "image" : videoTypes.has(file.type) ? "video" : null;
  if (!type) throw new HttpError(400, "只支持 PNG、JPG、GIF、WEBP、MP4、WEBM 和 MOV 文件");
  const limit = type === "image" ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
  if (file.size > limit) throw new HttpError(400, type === "image" ? "图片不能超过 10MB" : "视频不能超过 100MB");
  const key = `portfolio/${Date.now()}-${crypto.randomUUID()}-${safeFilename(file.name)}`;
  await getMediaBucket().put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
  await getD1().prepare("INSERT INTO media (id, object_key, filename, content_type, size, created_at, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .bind(crypto.randomUUID(), key, file.name, file.type, file.size, now(), actor).run();
  return { url: `/media/${key}`, type };
}

export async function uploadTrack(file: File, titleValue: string, artistValue: string, actor: string): Promise<MusicTrack> {
  const allowed = new Set(["audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg", "audio/flac", "audio/x-flac"]);
  if (!allowed.has(file.type)) throw new HttpError(400, "只支持 MP3、M4A、WAV、OGG 和 FLAC 音频");
  if (file.size > 50 * 1024 * 1024) throw new HttpError(400, "音频不能超过 50MB");
  const title = stringValue(titleValue) || stringValue(file.name.replace(/\.[^.]+$/, "")) || "未命名歌曲";
  const artist = stringValue(artistValue);
  const baseId = slugify(artist ? `${artist}-${title}` : title);
  const id = `${baseId}-${crypto.randomUUID().slice(0, 6)}`;
  const filename = `${Date.now()}-${safeFilename(file.name)}`;
  const key = `music/${filename}`;
  const url = `/media/${key}`;
  const createdAt = now();
  await getMediaBucket().put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
  const db = getD1();
  const next = await db.prepare("SELECT COALESCE(MAX(position), -1) + 1 AS value FROM tracks").first<{ value: number }>();
  await db.batch([
    db.prepare("INSERT INTO media (id, object_key, filename, content_type, size, created_at, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(crypto.randomUUID(), key, file.name, file.type, file.size, createdAt, actor),
    db.prepare("INSERT INTO tracks (id, title, artist, url, filename, created_at, position) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(id, title, artist, url, filename, createdAt, next?.value ?? 0),
  ]);
  return { id, title, artist, url, filename, createdAt };
}

export async function deleteTrack(id: string, actor: string): Promise<void> {
  const db = getD1();
  const current = await db.prepare("SELECT * FROM tracks WHERE id = ?").bind(id).first<Record<string, unknown> & { url?: string }>();
  if (!current) throw new HttpError(404, "歌曲不存在");
  await db.batch([
    db.prepare("INSERT INTO content_revisions (entity_type, entity_id, payload, action, actor_email, created_at) VALUES ('track', ?, ?, 'delete', ?, ?)").bind(id, JSON.stringify(current), actor, now()),
    db.prepare("DELETE FROM tracks WHERE id = ?").bind(id),
  ]);
  if (current.url?.startsWith("/media/")) {
    await getMediaBucket().delete(current.url.slice("/media/".length));
  }
}
