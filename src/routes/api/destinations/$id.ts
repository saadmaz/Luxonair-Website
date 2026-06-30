import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, destinations } from "../../../../db/index";
import { requireAuth } from "@/server/auth";
import { destinationSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/destinations/$id")({
  PATCH: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    const raw = await request.json().catch(() => null);
    const parsed = destinationSchema.partial().safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const update = parsed.data;
    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    await db.update(destinations).set(update).where(eq(destinations.id, id));
    const [row] = await db.select().from(destinations).where(eq(destinations.id, id));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  },

  DELETE: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    await db.delete(destinations).where(eq(destinations.id, id));
    return Response.json({ ok: true });
  },
});
