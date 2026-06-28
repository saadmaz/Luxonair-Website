import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, testimonials } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/testimonials/$id")({
  PATCH: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    const body = (await request.json()) as Partial<{
      author: string;
      trip: string;
      rating: number;
      date: string;
      body: string;
    }>;

    const update: Record<string, unknown> = {};
    if (body.author !== undefined) update.author = body.author;
    if (body.trip !== undefined) update.trip = body.trip;
    if (body.rating !== undefined) update.rating = body.rating;
    if (body.date !== undefined) update.date = body.date;
    if (body.body !== undefined) update.body = body.body;

    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    await db.update(testimonials).set(update).where(eq(testimonials.id, id));
    const [row] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  },

  DELETE: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    await db.delete(testimonials).where(eq(testimonials.id, id));
    return Response.json({ ok: true });
  },
});
