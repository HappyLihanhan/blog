import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const publicRoot = resolve(root, "public");
const files = [
  "index.html",
  "notes.html",
  "projects.html",
  "resume.html",
  "about.html",
  "admin.html",
  "login.html",
  "styles.css",
  "admin.css",
  "script.js",
  "admin.js",
  "login.js",
  ".nojekyll",
];

await mkdir(publicRoot, { recursive: true });
await rm(resolve(publicRoot, "assets", "music"), { recursive: true, force: true });
await Promise.all(
  files.map((file) => cp(resolve(root, file), resolve(publicRoot, file))),
);
await Promise.all([
  cp(resolve(root, "assets"), resolve(publicRoot, "assets"), {
    recursive: true,
    filter: (source) => !source.toLowerCase().endsWith(".mp3"),
  }),
  cp(resolve(root, "data"), resolve(publicRoot, "data"), { recursive: true }),
]);
