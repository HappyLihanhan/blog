import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("GitHub Pages source includes every configured music track", async () => {
  const source = JSON.parse(await readFile(new URL("../data/music.json", import.meta.url), "utf8"));

  assert.ok(source.tracks.length > 0, "music library must not be empty");

  for (const track of source.tracks) {
    assert.equal(track.url, `./assets/music/${track.filename}`);

    const sourceFile = await stat(new URL(`../assets/music/${track.filename}`, import.meta.url));
    assert.ok(sourceFile.size > 0, `${track.filename} must contain audio data`);
  }
});
