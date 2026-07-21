import { cp, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const publicRoot = resolve(root, "public");
const files = [
  "index.html",
  "notes.html",
  "projects.html",
  "portfolio.html",
  "quiz.html",
  "resume.html",
  "about.html",
  "admin.html",
  "login.html",
  "styles.css",
  "admin.css",
  "script.js",
  "quiz.js",
  "question-categories.js",
  "admin.js",
  "login.js",
  ".nojekyll",
];

await mkdir(publicRoot, { recursive: true });
await Promise.all(
  files.map((file) => cp(resolve(root, file), resolve(publicRoot, file))),
);
await Promise.all([
  cp(resolve(root, "assets"), resolve(publicRoot, "assets"), { recursive: true }),
  cp(resolve(root, "data"), resolve(publicRoot, "data"), { recursive: true }),
]);
