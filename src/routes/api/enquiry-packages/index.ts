import { createAPIFileRoute } from "@tanstack/react-start/api";
import { count, desc } from "drizzle-orm";
import { db, enquiryPackages } from "../../../../db/index";
import { requireSection } from "@/server/auth";
import { DEFAULT_LIST_LIMIT } from "@/server/pagination";
import { packageEnquirySchema } from "@/server/validate";
import { sendPackageEnquiryAlert, sendPackageEnquiryConfirmation } from "@/server/email";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/server/rate-limit";

export const APIRoute = createAPIFileRoute("/api/enquiry-packages")({
  GET: async ({ request }) => {
    await requireSection(request, "enquiry-packages");
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || "0");
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    if (limit > 0) {
      const [{ total }] = await db.select({ total: count() }).from(enquiryPackages);
      const data = await db
        .select()
        .from(enquiryPackages)
        .orderBy(desc(enquiryPackages.createdAt))
        .limit(limit)
        .offset((page - 1) * limit);
      return Response.json({ data, total, page, limit });
    }
    const rows = await db
      .select()
      .from(enquiryPackages)
      .orderBy(desc(enquiryPackages.createdAt))
      .limit(DEFAULT_LIST_LIMIT);
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    if (!checkRateLimit(`enquiry-packages:${getClientIp(request)}`, 5, 10 * 60 * 1000)) {
      return rateLimitResponse(600);
    }

    const raw = await request.json().catch(() => null);
    const parsed = packageEnquirySchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const d = parsed.data;
    await db.insert(enquiryPackages).values({
      name: d.name,
      email: d.email,
      phone: d.phone,
      destination: d.destination,
      region: d.region ?? null,
      tripType: d.tripType,
      dateMode: d.dateMode,
      departWindow: d.departWindow ?? null,
      flexibility: d.flexibility ?? null,
      departDate: d.departDate ?? null,
      returnDate: d.returnDate ?? null,
      nights: d.nights,
      budget: d.budget,
      hotelRating: d.hotelRating ?? null,
      boardBasis: d.boardBasis ?? null,
      flightsIncluded: d.flightsIncluded,
      departAirport: d.flightsIncluded ? (d.departAirport ?? null) : null,
      cabinClass: d.flightsIncluded ? (d.cabinClass ?? null) : null,
      adults: d.adults,
      children: d.children,
      infants: d.infants,
      notes: d.notes ?? null,
      status: "new",
    });

    // Fire-and-forget — DB insert is the source of truth; email failure must not break the response
    sendPackageEnquiryAlert(d).catch((err) => console.error("[email] package enquiry alert failed:", err));
    sendPackageEnquiryConfirmation(d).catch((err) => console.error("[email] package enquiry confirmation failed:", err));

    return Response.json({ ok: true }, { status: 201 });
  },
});
