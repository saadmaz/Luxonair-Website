import { createAPIFileRoute } from "@tanstack/react-start/api";
import { count, desc } from "drizzle-orm";
import { db, flightOfferBookings } from "../../../../db/index";
import { requireAuth } from "@/server/auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/server/rate-limit";
import { flightOfferBookingSchema } from "@/server/validate";
import { sendFlightBookingAlert } from "@/server/email";

export const APIRoute = createAPIFileRoute("/api/flight-offer-bookings")({
  GET: async ({ request }) => {
    await requireAuth(request);
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || "0");
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    if (limit > 0) {
      const [{ total }] = await db.select({ total: count() }).from(flightOfferBookings);
      const data = await db
        .select()
        .from(flightOfferBookings)
        .orderBy(desc(flightOfferBookings.createdAt))
        .limit(limit)
        .offset((page - 1) * limit);
      return Response.json({ data, total, page, limit });
    }
    const rows = await db
      .select()
      .from(flightOfferBookings)
      .orderBy(desc(flightOfferBookings.createdAt));
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    // 5 submissions per 10 minutes per IP
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`flight-offer-booking:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.allowed) return rateLimitResponse(rl.retryAfter);

    const raw = await request.json().catch(() => null);
    const parsed = flightOfferBookingSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const d = parsed.data;
    await db.insert(flightOfferBookings).values({
      offerId: d.offerId,
      routeLabel: d.routeLabel,
      cabinClass: d.cabinClass,
      price: d.price,
      tripType: d.tripType,
      departDate: d.departDate ?? null,
      returnDate: d.returnDate ?? null,
      adults: d.adults,
      children: d.children,
      infants: d.infants,
      budget: d.budget ?? null,
      notes: d.notes ?? null,
      name: d.name,
      email: d.email,
      phone: d.phone,
      status: "new",
    });

    // Fire-and-forget — DB insert is the source of truth; email failure must not break the response
    sendFlightBookingAlert(d).catch((err) =>
      console.error("[email] flight booking alert failed:", err),
    );

    return Response.json({ ok: true }, { status: 201 });
  },
});
