import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, destinations } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/destinations/$id")({
  PATCH: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    const body = (await request.json()) as Partial<{
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
      gallery: unknown[];
      itinerary: unknown[];
      highlights: unknown[];
    }>;

    const update: Record<string, unknown> = {};
    for (const key of ["slug","name","country","region","tripType","budgetBand","fromPrice","durationNights","heroImage","tagline","summary","gallery","itinerary","highlights"] as const) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    await db.update(destinations).set(update).where(eq(destinations.id, id));
    const [row] = await db.select().from(destinations).where(eq(destinations.id, id));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  },

  DELETE: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    await db.delete(destinations).where(eq(destinations.id, id));
    return Response.json({ ok: true });
  },
});
