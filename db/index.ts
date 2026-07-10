import { env } from "cloudflare:workers";

type RuntimeBindings = {
  DB?: D1Database;
  MEDIA?: R2Bucket;
};

function bindings(): RuntimeBindings {
  return env as unknown as RuntimeBindings;
}

export function getD1(): D1Database {
  const db = bindings().DB;
  if (!db) throw new Error("D1 binding `DB` is unavailable");
  return db;
}

export function getMediaBucket(): R2Bucket {
  const bucket = bindings().MEDIA;
  if (!bucket) throw new Error("R2 binding `MEDIA` is unavailable");
  return bucket;
}
