import { createAPIFileRoute } from "@tanstack/react-start/api";
import { count, desc, eq } from "drizzle-orm";
import { db, flightOffers } from "../../../../db/index";
import { requireSection } from "@/server/auth";
import { DEFAULT_LIST_LIMIT } from "@/server/pagination";
import { flightOfferSchema } from "@/server/validate";
import { isDuplicateKeyError } from "@/server/db-errors";

export const APIRoute = createAPIFileRoute("/api/flight-offers")({
  GET: async ({ request }) => {
    await requireSection(request, "flight-offers");
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || "0");
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    if (limit > 0) {
      const [{ total }] = await db.select({ total: count() }).from(flightOffers);
      const data = await db
        .select()
        .from(flightOffers)
        .orderBy(desc(flightOffers.createdAt))
        .limit(limit)
        .offset((page - 1) * limit);
      return Response.json({ data, total, page, limit });
    }
    const rows = await db.select().from(flightOffers).orderBy(desc(flightOffers.createdAt)).limit(DEFAULT_LIST_LIMIT);
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    await requireSection(request, "flight-offers");
    const raw = await request.json().catch(() => null);
    const parsed = flightOfferSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const body = parsed.data;

    try {
      await db.insert(flightOffers).values(body);
    } catch (e: unknown) {
      if (isDuplicateKeyError(e)) {
        return Response.json(
          { error: "A flight offer with that ID already exists" },
          { status: 409 },
        );
      }
      throw e;
    }

    const [row] = await db.select().from(flightOffers).where(eq(flightOffers.id, body.id));
    return Response.json(row, { status: 201 });
  },
});
