import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, deals } from "../../../../db/index";
import { requireAuth } from "@/server/auth";
import { dealSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/deals/$id")({
  PATCH: async ({ request, params }) => {
    await requireAuth(request);
    const { id } = params;
    const raw = await request.json().catch(() => null);
    const parsed = dealSchema.omit({ id: true }).partial().safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const update = parsed.data;
    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    await db.update(deals).set(update as Record<string, unknown>).where(eq(deals.id, id));
    const [row] = await db.select().from(deals).where(eq(deals.id, id));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  },

  DELETE: async ({ request, params }) => {
    await requireAuth(request);
    const { id } = params;
    await db.delete(deals).where(eq(deals.id, id));
    return Response.json({ ok: true });
  },
});
