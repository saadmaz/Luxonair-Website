import { createAPIFileRoute } from "@tanstack/react-start/api";
import { desc } from "drizzle-orm";
import { db, enquiries } from "../../../../db/index";
import { requireAuth } from "@/server/auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/server/rate-limit";
import { enquirySchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/enquiries")({
  GET: async ({ request }) => {
    await requireAuth(request);
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

    return Response.json({ ok: true }, { status: 201 });
  },
});
