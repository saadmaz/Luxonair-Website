import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, images } from "../../../../db/index";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const APIRoute = createAPIFileRoute("/api/uploads/$filename")({
  GET: async ({ params }) => {
    // Historic uploads were served as "<uuid>.<ext>" filenames; images are now
    // looked up by id alone, so strip any extension before validating.
    const id = params.filename.replace(/\.[a-z0-9]+$/i, "");
    if (!UUID_RE.test(id)) {
      return new Response("Not found", { status: 404 });
    }

    const [row] = await db.select().from(images).where(eq(images.id, id)).limit(1);
    if (!row) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(new Uint8Array(row.data), {
      headers: {
        "Content-Type": row.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  },
});
