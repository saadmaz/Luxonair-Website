import { createAPIFileRoute } from "@tanstack/react-start/api";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export const APIRoute = createAPIFileRoute("/api/uploads/$filename")({
  GET: async ({ params }) => {
    // Reject anything that isn't a bare "<uuid>.<ext>" — blocks path traversal
    // (../) and access to arbitrary files elsewhere on disk.
    const filename = params.filename;
    if (!/^[a-f0-9-]+\.(jpg|jpeg|png|webp|gif)$/i.test(filename)) {
      return new Response("Not found", { status: 404 });
    }

    const ext = filename.split(".").pop()!.toLowerCase();
    const filePath = path.join(UPLOAD_DIR, filename);

    try {
      await stat(filePath);
      const data = await readFile(filePath);
      return new Response(data, {
        headers: {
          "Content-Type": MIME_BY_EXT[ext] ?? "application/octet-stream",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      return new Response("Not found", { status: 404 });
    }
  },
});
