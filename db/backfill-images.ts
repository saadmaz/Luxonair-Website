/**
 * One-time backfill — imports images uploaded under the old filesystem-based
 * scheme (saved as <uuid>.<ext> under ./uploads, see git history for the
 * previous src/routes/api/upload.ts) into the new `images` DB table.
 *
 * Run this ONCE, on the server, from the same working directory the app runs
 * in (so ./uploads resolves to the real upload folder) — it's what fixes the
 * 404s on pre-existing /api/uploads/<uuid>.<ext> URLs after the move to
 * DB-backed image storage. Safe to re-run: any id already in `images` is
 * skipped.
 *
 * Usage:
 *   npx tsx db/backfill-images.ts
 */
import { createPool } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { existsSync, readFileSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { imageSize } from "image-size";
import { parseDbUrl } from "./parse-db-url";
import { images, type ImageAsset } from "./schema";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const MIME_BY_EXT: Record<string, ImageAsset["mimeType"]> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

function loadDotEnvIfPresent() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function main() {
  loadDotEnvIfPresent();

  if (!existsSync(UPLOAD_DIR)) {
    console.log(`No ${UPLOAD_DIR} folder found — nothing to backfill.`);
    return;
  }

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const pool = createPool({ ...parseDbUrl(url), connectionLimit: 1 });
  const db = drizzle(pool, { mode: "default" });

  try {
    const files = await readdir(UPLOAD_DIR);
    let imported = 0;
    let skipped = 0;
    let failed = 0;

    for (const filename of files) {
      const match = /^([0-9a-f-]{36})\.([a-z0-9]+)$/i.exec(filename);
      if (!match) {
        console.warn(`Skipping unrecognized filename: ${filename}`);
        continue;
      }
      const [, id, ext] = match;

      const [existing] = await db.select({ id: images.id }).from(images).where(eq(images.id, id)).limit(1);
      if (existing) {
        skipped++;
        continue;
      }

      const filePath = path.join(UPLOAD_DIR, filename);
      const mimeType = MIME_BY_EXT[ext.toLowerCase()];
      if (!mimeType) {
        console.warn(`Skipping ${filename}: unrecognized extension .${ext}`);
        failed++;
        continue;
      }

      try {
        const data = await readFile(filePath);
        const fileStat = await stat(filePath);
        let width: number | null = null;
        let height: number | null = null;
        try {
          const dims = imageSize(data);
          width = dims.width ?? null;
          height = dims.height ?? null;
        } catch {
          // Dimensions unavailable — store the row anyway rather than dropping the image.
        }

        await db.insert(images).values({
          id,
          mimeType,
          data,
          byteSize: data.length,
          width,
          height,
          createdAt: fileStat.mtime,
        });
        imported++;
      } catch (e) {
        console.error(`Failed to import ${filename}:`, e);
        failed++;
      }
    }

    console.log(`Backfill complete. Imported: ${imported}, already present: ${skipped}, failed: ${failed}.`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
