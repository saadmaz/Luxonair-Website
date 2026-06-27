import { createAPIFileRoute } from "@tanstack/react-start/api";
import { desc } from "drizzle-orm";
import { db, enquiries } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/enquiries")({
  // Admin: list all enquiries newest first
  GET: async ({ request }) => {
    await requireAuth(request);
    const rows = await db
      .select()
      .from(enquiries)
      .orderBy(desc(enquiries.createdAt));
    return Response.json(rows);
  },

  // Public: submit a new quote enquiry
  POST: async ({ request }) => {
    const body = (await request.json()) as {
      name: string;
      email: string;
      phone: string;
      destination: string;
      region?: string;
      tripType: string;
      dateMode: string;
      departWindow?: string;
      flexibility?: string;
      departDate?: string;
      returnDate?: string;
      nights: number;
      departAirport: string;
      cabinClass: string;
      directOnly?: string;
      preferredAirlines?: string;
      adults: number;
      children: number;
      budget: string;
      notes?: string;
    };

    if (!body.name || !body.email || !body.destination) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.insert(enquiries).values({
      name: body.name,
      email: body.email,
      phone: body.phone,
      destination: body.destination,
      region: body.region ?? null,
      tripType: body.tripType,
      dateMode: body.dateMode,
      departWindow: body.departWindow ?? null,
      flexibility: body.flexibility ?? null,
      departDate: body.departDate ?? null,
      returnDate: body.returnDate ?? null,
      nights: body.nights,
      departAirport: body.departAirport,
      cabinClass: body.cabinClass,
      directOnly: body.directOnly ?? null,
      preferredAirlines: body.preferredAirlines ?? null,
      adults: body.adults,
      children: body.children ?? 0,
      budget: body.budget,
      notes: body.notes ?? null,
      status: "new",
    });

    return Response.json({ ok: true }, { status: 201 });
  },
});
