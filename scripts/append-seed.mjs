import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const migrationPath = resolve(root, "drizzle", "0000_dear_dakota_north.sql");
const marker = "-- ian-blog-initial-content";

function sql(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return String(value);
  return `'${String(value).replaceAll("'", "''")}'`;
}

function statement(value) {
  return `${value};\n--> statement-breakpoint`;
}

const [postsData, projectsData, resumeData, musicData, migration] = await Promise.all([
  readFile(resolve(root, "data", "posts.json"), "utf8").then(JSON.parse),
  readFile(resolve(root, "data", "projects.json"), "utf8").then(JSON.parse),
  readFile(resolve(root, "data", "resume.json"), "utf8").then(JSON.parse),
  readFile(resolve(root, "data", "music.json"), "utf8").then(JSON.parse),
  readFile(migrationPath, "utf8"),
]);

const markerIndex = migration.indexOf(marker);
const schemaMigration = (markerIndex >= 0 ? migration.slice(0, markerIndex) : migration)
  .replace(/\n--> statement-breakpoint\s*$/, "")
  .trimEnd();

const generatedAt = new Date().toISOString();
const statements = [marker];

postsData.posts.forEach((post, position) => {
  statements.push(
    statement(
      `INSERT INTO posts (id, title, date, category, tags, pinned, summary, body, position, updated_at) VALUES (${[
        post.id,
        post.title,
        post.date || "",
        post.category || "",
        JSON.stringify(post.tags || []),
        post.pinned ? 1 : 0,
        post.summary || "",
        JSON.stringify(post.body || []),
        position,
        generatedAt,
      ].map(sql).join(", ")})`,
    ),
  );
});

projectsData.projects.forEach((project, position) => {
  statements.push(
    statement(
      `INSERT INTO projects (id, title, date, type, tags, summary, body, position, updated_at) VALUES (${[
        project.id,
        project.title,
        project.date || "",
        project.type || project.title,
        JSON.stringify(project.tags || []),
        project.summary || "",
        JSON.stringify(project.body || []),
        position,
        generatedAt,
      ].map(sql).join(", ")})`,
    ),
  );
});

statements.push(
  statement(
    `INSERT INTO site_documents (key, payload, updated_at) VALUES ('resume', ${sql(JSON.stringify(resumeData))}, ${sql(generatedAt)})`,
  ),
);

musicData.tracks.forEach((track, position) => {
  statements.push(
    statement(
      `INSERT INTO tracks (id, title, artist, url, filename, created_at, position) VALUES (${[
        track.id,
        track.title,
        track.artist || "",
        track.url,
        track.filename || "",
        track.createdAt || generatedAt,
        position,
      ].map(sql).join(", ")})`,
    ),
  );
});

await writeFile(migrationPath, `${schemaMigration}\n--> statement-breakpoint\n${statements.join("\n")}\n`, "utf8");
