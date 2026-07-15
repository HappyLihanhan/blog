import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("portfolio page and admin channel are included in the built site", async () => {
  const [page, admin, script, data] = await Promise.all([
    readFile(new URL("../dist/client/portfolio.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/admin.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/script.js", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/data/portfolio.json", import.meta.url), "utf8"),
  ]);
  assert.match(page, /data-portfolio-grid/);
  assert.match(page, /data-portfolio-modal/);
  assert.match(admin, /data-content-type="portfolio"/);
  assert.match(admin, /data-portfolio-form/);
  assert.match(admin, /data-portfolio-demo-upload/);
  assert.match(script, /\/api\/portfolio/);
  assert.ok(JSON.parse(data).items.length >= 1);
});
