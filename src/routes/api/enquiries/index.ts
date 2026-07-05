import { createAPIFileRoute } from "@tanstack/react-start/api";
import { count, desc } from "drizzle-orm";
import { db, enquiries } from "../../../../db/index";
import { requireSection } from "@/server/auth";
import { DEFAULT_LIST_LIMIT } from "@/server/pagination";
import { enquirySchema } from "@/server/validate";
import { sendEnquiryAlert, sendEnquiryConfirmation } from "@/server/email";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/server/rate-limit";

export const APIRoute = createAPIFileRoute("/api/enquiries")({
  GET: async ({ request }) => {
    await requireSection(request, "enquiries");
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || "0");
    const page  = Math.max(1, Number(url.searchParams.get("page") || "1"));
    if (limit > 0) {
      const [{ total }] = await db.select({ total: count() }).from(enquiries);
      const data = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(limit).offset((page - 1) * limit);
      return Response.json({ data, total, page, limit });
    }
    const rows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(DEFAULT_LIST_LIMIT);
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    if (!checkRateLimit(`enquiries:${getClientIp(request)}`, 5, 10 * 60 * 1000)) {
      return rateLimitResponse(600);
    }

    const raw = await request.json().catch(() => null);
    const parsed = enquirySchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const d = parsed.data;
    await db.insert(enquiries).values({
      quoteType: d.quoteType,
      name: d.name,
      email: d.email,
      phone: d.phone,
      destination: d.destination,
      region: d.quoteType === "package" ? (d.region ?? null) : null,
      tripType: d.tripType,
      dateMode: d.dateMode,
      departWindow: d.departWindow ?? null,
      flexibility: d.flexibility ?? null,
      departDate: d.departDate ?? null,
      returnDate: d.returnDate ?? null,
      nights: d.quoteType === "package" ? d.nights : null,
      departAirport: d.departAirport ?? null,
      cabinClass: d.cabinClass ?? null,
      directOnly: d.quoteType === "flight" ? (d.directOnly ?? null) : null,
      preferredAirlines: d.quoteType === "flight" ? (d.preferredAirlines ?? null) : null,
      adults: d.adults,
      children: d.children,
      infants: d.infants,
      budget: d.budget,
      hotelRating: d.quoteType === "package" ? (d.hotelRating ?? null) : null,
      boardBasis: d.quoteType === "package" ? (d.boardBasis ?? null) : null,
      flightsIncluded: d.quoteType === "package" ? d.flightsIncluded : null,
      notes: d.notes ?? null,
      status: "new",
    });

    // Fire-and-forget — DB insert is the source of truth; email failure must not break the response
    sendEnquiryAlert(d).catch((err) => console.error("[email] enquiry alert failed:", err));
    sendEnquiryConfirmation(d).catch((err) => console.error("[email] enquiry confirmation failed:", err));

    return Response.json({ ok: true }, { status: 201 });
  },
});
