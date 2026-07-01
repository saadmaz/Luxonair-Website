import { createAPIFileRoute } from "@tanstack/react-start/api";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireAuth } from "@/server/auth";

// Files persist outside the build output (dist/.output are wiped on every
// deploy) so uploads survive rebuilds. Served back out via /api/uploads/$filename.
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

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

    const ext = EXT_BY_MIME[file.type];
    if (!ext) {
      return Response.json(
        { error: "Unsupported image type — use JPG, PNG, WEBP or GIF" },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return Response.json({ error: "Image is too large (max 8MB)" }, { status: 413 });
    }

    const filename = `${randomUUID()}.${ext}`;
    await mkdir(UPLOAD_DIR, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);

    return Response.json({ url: `/api/uploads/${filename}` }, { status: 201 });
  },
});
