import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, flightOffers } from "../../../../db/index";
import { requireAuth } from "@/server/auth";
import { flightOfferSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/flight-offers/$id")({
  PATCH: async ({ request, params }) => {
    await requireAuth(request);
    const { id } = params;
    const raw = await request.json().catch(() => null);
    const parsed = flightOfferSchema.omit({ id: true }).partial().safeParse(raw);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const update = parsed.data;
    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    await db
      .update(flightOffers)
      .set(update as Record<string, unknown>)
      .where(eq(flightOffers.id, id));
    const [row] = await db.select().from(flightOffers).where(eq(flightOffers.id, id));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  },

  DELETE: async ({ request, params }) => {
    await requireAuth(request);
    const { id } = params;
    await db.delete(flightOffers).where(eq(flightOffers.id, id));
    return Response.json({ ok: true });
  },
});
