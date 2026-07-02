import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, flightOfferBookings } from "../../../../db/index";
import { requireAuth } from "@/server/auth";
import { flightOfferBookingUpdateSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/flight-offer-bookings/$id")({
  // Admin: update status
  PATCH: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    const raw = await request.json().catch(() => null);
    const parsed = flightOfferBookingUpdateSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const update = parsed.data;
    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    await db.update(flightOfferBookings).set(update).where(eq(flightOfferBookings.id, id));

    const [row] = await db.select().from(flightOfferBookings).where(eq(flightOfferBookings.id, id));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  },

  // Admin: delete a booking
  DELETE: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    const [result] = await db.delete(flightOfferBookings).where(eq(flightOfferBookings.id, id));
    if (result.affectedRows === 0) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ ok: true });
  },
});
