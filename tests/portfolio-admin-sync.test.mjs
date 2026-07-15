import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { Miniflare } from "miniflare";

function createMiniflare() {
  return new Miniflare({
    modules: true,
    modulesRules: [{ type: "ESModule", include: ["**/*.js"] }],
    scriptPath: fileURLToPath(new URL("../dist/server/index.js", import.meta.url)),
    compatibilityDate: "2026-05-15",
    compatibilityFlags: ["nodejs_compat"],
    d1Databases: ["DB"],
    r2Buckets: ["MEDIA"],
    serviceBindings: { ASSETS: () => new Response("Not found", { status: 404 }) },
  });
}

test("portfolio admin initializes its storage in a fresh local database", async () => {
  const mf = createMiniflare();
  try {
    const response = await mf.dispatchFetch("http://localhost/api/admin/portfolio", {
      headers: { "oai-authenticated-user-email": "owner@example.com" },
    });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).items.length, 2);
  } finally {
    await mf.dispose();
  }
});

test("legacy empty portfolio document still exposes the seeded works in admin", async () => {
  const mf = createMiniflare();
  try {
    const db = await mf.getD1Database("DB");
    const migration = await readFile(new URL("../drizzle/0000_dear_dakota_north.sql", import.meta.url), "utf8");
    for (const statement of migration.split("--> statement-breakpoint").map((item) => item.trim()).filter(Boolean)) {
      await db.prepare(statement).run();
    }
    await db.prepare("INSERT INTO site_documents (key, payload, updated_at) VALUES ('portfolio', '[]', '2026-07-15')").run();
    const response = await mf.dispatchFetch("http://localhost/api/admin/portfolio", {
      headers: { "oai-authenticated-user-email": "owner@example.com" },
    });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).items.length, 2);

    await db.prepare("UPDATE site_documents SET payload = ? WHERE key = 'portfolio'")
      .bind(JSON.stringify({ version: 1, initialized: true, items: [] }))
      .run();
    const intentionallyEmpty = await mf.dispatchFetch("http://localhost/api/admin/portfolio", {
      headers: { "oai-authenticated-user-email": "owner@example.com" },
    });
    assert.equal((await intentionallyEmpty.json()).items.length, 0);
  } finally {
    await mf.dispose();
  }
});
