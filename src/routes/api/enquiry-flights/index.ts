import { createAPIFileRoute } from "@tanstack/react-start/api";
import { count, desc } from "drizzle-orm";
import { db, enquiryFlights } from "../../../../db/index";
import { requireSection } from "@/server/auth";
import { DEFAULT_LIST_LIMIT } from "@/server/pagination";
import { flightEnquirySchema } from "@/server/validate";
import { sendFlightEnquiryAlert, sendFlightEnquiryConfirmation } from "@/server/email";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/server/rate-limit";

export const APIRoute = createAPIFileRoute("/api/enquiry-flights")({
  GET: async ({ request }) => {
    await requireSection(request, "enquiry-flights");
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || "0");
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    if (limit > 0) {
      const [{ total }] = await db.select({ total: count() }).from(enquiryFlights);
      const data = await db
        .select()
        .from(enquiryFlights)
        .orderBy(desc(enquiryFlights.createdAt))
        .limit(limit)
        .offset((page - 1) * limit);
      return Response.json({ data, total, page, limit });
    }
    const rows = await db
      .select()
      .from(enquiryFlights)
      .orderBy(desc(enquiryFlights.createdAt))
      .limit(DEFAULT_LIST_LIMIT);
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    if (!checkRateLimit(`enquiry-flights:${getClientIp(request)}`, 5, 10 * 60 * 1000)) {
      return rateLimitResponse(600);
    }

    const raw = await request.json().catch(() => null);
    const parsed = flightEnquirySchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const d = parsed.data;
    await db.insert(enquiryFlights).values({
      name: d.name,
      email: d.email,
      phone: d.phone,
      departAirport: d.departAirport,
      destination: d.destination,
      tripType: d.tripType,
      dateMode: d.dateMode,
      departWindow: d.departWindow ?? null,
      departDate: d.departDate ?? null,
      returnDate: d.returnDate ?? null,
      adults: d.adults,
      children: d.children,
      infants: d.infants,
      cabinClass: d.cabinClass,
      directOnly: d.directOnly ?? null,
      preferredAirlines: d.preferredAirlines ?? null,
      budget: d.budget,
      notes: d.notes ?? null,
      status: "new",
    });

    // Fire-and-forget — DB insert is the source of truth; email failure must not break the response
    sendFlightEnquiryAlert(d).catch((err) => console.error("[email] flight enquiry alert failed:", err));
    sendFlightEnquiryConfirmation(d).catch((err) => console.error("[email] flight enquiry confirmation failed:", err));

    return Response.json({ ok: true }, { status: 201 });
  },
});
