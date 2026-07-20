import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("notes filters preserve the reader's scroll position", async () => {
  const source = await readFile(new URL("../script.js", import.meta.url), "utf8");
  const start = source.indexOf("const categoryButton");
  const end = source.indexOf("if (event.target.matches", start);

  assert.notEqual(start, -1, "category filter handler must exist");
  assert.notEqual(end, -1, "filter handler boundary must exist");
  assert.doesNotMatch(
    source.slice(start, end),
    /resetPageScroll\(\)/,
    "changing a category or tag must not force the page back to the top",
  );
});
