import { createAPIFileRoute } from "@tanstack/react-start/api";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireAuth } from "@/server/auth";

// Files persist outside the build output (dist/.output are wiped on every
// deploy) so uploads survive rebuilds. Served back out via /api/uploads/$filename.
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

// Detects the real image type from file *content* (magic bytes) rather than
// trusting the client-supplied Content-Type/File.type, which is fully
// attacker-controlled in a multipart request.
function sniffImageExt(buffer: Buffer): string | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "png";
  }
  if (
    buffer.length >= 6 &&
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return "gif";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }
  return null;
}

export const APIRoute = createAPIFileRoute("/api/upload")({
  POST: async ({ request }) => {
    await requireAuth(request);

    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > MAX_BYTES) {
      return Response.json({ error: "Image is too large (max 8MB)" }, { status: 413 });
    }

    const form = await request.formData().catch(() => null);
    const file = form?.get("file");
    if (!file || !(file instanceof File)) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return Response.json({ error: "Image is too large (max 8MB)" }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = sniffImageExt(buffer);
    if (!ext) {
      return Response.json(
        { error: "Unsupported image type — use JPG, PNG, WEBP or GIF" },
        { status: 400 },
      );
    }

    const filename = `${randomUUID()}.${ext}`;
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);

    return Response.json({ url: `/api/uploads/${filename}` }, { status: 201 });
  },
});
