import { createAPIFileRoute } from "@tanstack/react-start/api";
import { count, asc, desc } from "drizzle-orm";
import { db, destinationHighlights } from "../../../../db/index";
import { requireAuth } from "@/server/auth";
import { destinationHighlightSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/destination-highlights")({
  GET: async ({ request }) => {
    await requireAuth(request);
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || "0");
    const page  = Math.max(1, Number(url.searchParams.get("page") || "1"));
    if (limit > 0) {
      const [{ total }] = await db.select({ total: count() }).from(destinationHighlights);
      const data = await db
        .select()
        .from(destinationHighlights)
        .orderBy(asc(destinationHighlights.sortOrder), desc(destinationHighlights.createdAt))
        .limit(limit)
        .offset((page - 1) * limit);
      return Response.json({ data, total, page, limit });
    }
    const rows = await db
      .select()
      .from(destinationHighlights)
      .orderBy(asc(destinationHighlights.sortOrder), desc(destinationHighlights.createdAt));
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    await requireAuth(request);
    const raw = await request.json().catch(() => null);
    const parsed = destinationHighlightSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    await db.insert(destinationHighlights).values(parsed.data);
    const [row] = await db
      .select()
      .from(destinationHighlights)
      .orderBy(desc(destinationHighlights.createdAt))
      .limit(1);
    return Response.json(row, { status: 201 });
  },
});
