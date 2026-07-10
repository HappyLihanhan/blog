import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable(
  "posts",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    date: text("date").notNull().default(""),
    category: text("category").notNull().default(""),
    tags: text("tags").notNull().default("[]"),
    pinned: integer("pinned", { mode: "boolean" }).notNull().default(false),
    summary: text("summary").notNull().default(""),
    body: text("body").notNull().default("[]"),
    position: integer("position").notNull().default(0),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [index("posts_position_idx").on(table.position)],
);

export const projects = sqliteTable(
  "projects",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    date: text("date").notNull().default(""),
    type: text("type").notNull().default(""),
    tags: text("tags").notNull().default("[]"),
    summary: text("summary").notNull().default(""),
    body: text("body").notNull().default("[]"),
    position: integer("position").notNull().default(0),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [index("projects_position_idx").on(table.position)],
);

export const siteDocuments = sqliteTable("site_documents", {
  key: text("key").primaryKey(),
  payload: text("payload").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const tracks = sqliteTable(
  "tracks",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    artist: text("artist").notNull().default(""),
    url: text("url").notNull(),
    filename: text("filename").notNull().default(""),
    createdAt: text("created_at").notNull(),
    position: integer("position").notNull().default(0),
  },
  (table) => [index("tracks_position_idx").on(table.position)],
);

export const media = sqliteTable(
  "media",
  {
    id: text("id").primaryKey(),
    objectKey: text("object_key").notNull().unique(),
    filename: text("filename").notNull(),
    contentType: text("content_type").notNull(),
    size: integer("size").notNull(),
    createdAt: text("created_at").notNull(),
    uploadedBy: text("uploaded_by").notNull(),
  },
  (table) => [index("media_created_at_idx").on(table.createdAt)],
);

export const contentRevisions = sqliteTable(
  "content_revisions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    payload: text("payload").notNull(),
    action: text("action").notNull(),
    actorEmail: text("actor_email").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("content_revisions_entity_idx").on(table.entityType, table.entityId)],
);
