import { createAPIFileRoute } from "@tanstack/react-start/api";
import { count, desc } from "drizzle-orm";
import { db, enquiries } from "../../../../db/index";
import { requireAuth } from "@/server/auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/server/rate-limit";
import { enquirySchema } from "@/server/validate";
import { sendEnquiryAlert } from "@/server/email";

export const APIRoute = createAPIFileRoute("/api/enquiries")({
  GET: async ({ request }) => {
    await requireAuth(request);
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || "0");
    const page  = Math.max(1, Number(url.searchParams.get("page") || "1"));
    if (limit > 0) {
      const [{ total }] = await db.select({ total: count() }).from(enquiries);
      const data = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(limit).offset((page - 1) * limit);
      return Response.json({ data, total, page, limit });
    }
    const rows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    // 5 submissions per 10 minutes per IP
    const ip = getClientIp(request);
    const rl = checkRateLimit(`enquiry:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.allowed) return rateLimitResponse(rl.retryAfter);

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
      departAirport: d.departAirport,
      cabinClass: d.cabinClass,
      directOnly: d.directOnly ?? null,
      preferredAirlines: d.preferredAirlines ?? null,
      adults: d.adults,
      children: d.children,
      budget: d.budget,
      notes: d.notes ?? null,
      status: "new",
    });

    // Fire-and-forget — DB insert is the source of truth; email failure must not break the response
    sendEnquiryAlert(d).catch((err) => console.error("[email] enquiry alert failed:", err));

    return Response.json({ ok: true }, { status: 201 });
  },
});
