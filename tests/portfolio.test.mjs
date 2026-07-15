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

test("portfolio admin surfaces a missing API inside the visible portfolio panel", async () => {
  const adminScript = await readFile(new URL("../admin.js", import.meta.url), "utf8");
  assert.match(adminScript, /response\.status === 404[\s\S]*后台版本未包含作品集接口/);
  assert.match(adminScript, /tab\.dataset\.contentType === "portfolio"\s*\?\s*els\.portfolioMessage/);
});

test("GitHub static portfolio data is copied unchanged into the Sites build", async () => {
  const [githubData, sitesData] = await Promise.all([
    readFile(new URL("../data/portfolio.json", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/data/portfolio.json", import.meta.url), "utf8"),
  ]);
  assert.deepEqual(JSON.parse(sitesData), JSON.parse(githubData));
});
