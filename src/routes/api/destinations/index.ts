import { createAPIFileRoute } from "@tanstack/react-start/api";
import { desc, eq } from "drizzle-orm";
import { db, destinations } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/destinations")({
  GET: async ({ request }) => {
    await requireAuth(request);
    const rows = await db.select().from(destinations).orderBy(desc(destinations.createdAt));
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    await requireAuth(request);
    const body = (await request.json()) as {
      slug: string;
      name: string;
      country: string;
      region: string;
      tripType: string[];
      budgetBand: string;
      fromPrice: number;
      durationNights: number;
      heroImage: string;
      tagline: string;
      summary: string;
      gallery?: unknown[];
      itinerary?: unknown[];
      highlights?: unknown[];
    };

    if (!body.slug || !body.name || !body.country) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      await db.insert(destinations).values({
        slug: body.slug,
        name: body.name,
        country: body.country,
        region: body.region ?? "",
        tripType: body.tripType ?? [],
        budgetBand: body.budgetBand ?? "££",
        fromPrice: body.fromPrice ?? 0,
        durationNights: body.durationNights ?? 7,
        heroImage: body.heroImage ?? "",
        tagline: body.tagline ?? "",
        summary: body.summary ?? "",
        gallery: body.gallery ?? [],
        itinerary: body.itinerary ?? [],
        highlights: body.highlights ?? [],
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("Duplicate") || msg.includes("unique")) {
        return Response.json({ error: "A destination with that slug already exists" }, { status: 409 });
      }
      throw e;
    }

    const [row] = await db.select().from(destinations).where(eq(destinations.slug, body.slug));
    return Response.json(row, { status: 201 });
  },
});
