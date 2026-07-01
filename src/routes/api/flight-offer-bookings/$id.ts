import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, flightOfferBookings } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/flight-offer-bookings/$id")({
  // Admin: update status
  PATCH: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    const body = (await request.json()) as { status?: string };

    await db
      .update(flightOfferBookings)
      .set({
        ...(body.status !== undefined && { status: body.status }),
      })
      .where(eq(flightOfferBookings.id, id));

    const [row] = await db.select().from(flightOfferBookings).where(eq(flightOfferBookings.id, id));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  },

  // Admin: delete a booking
  DELETE: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    await db.delete(flightOfferBookings).where(eq(flightOfferBookings.id, id));
    return Response.json({ ok: true });
  },
});
