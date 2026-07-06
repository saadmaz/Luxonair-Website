import { createAPIFileRoute } from "@tanstack/react-start/api";
import { count, desc, eq } from "drizzle-orm";
import { db, destinations } from "../../../../db/index";
import { requireSection } from "@/server/auth";
import { DEFAULT_LIST_LIMIT } from "@/server/pagination";
import { destinationSchema } from "@/server/validate";
import { isDuplicateKeyError } from "@/server/db-errors";

export const APIRoute = createAPIFileRoute("/api/destinations")({
  GET: async ({ request }) => {
    await requireSection(request, "destinations");
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || "0");
    const page  = Math.max(1, Number(url.searchParams.get("page") || "1"));
    if (limit > 0) {
      const [{ total }] = await db.select({ total: count() }).from(destinations);
      const data = await db.select().from(destinations).orderBy(desc(destinations.createdAt)).limit(limit).offset((page - 1) * limit);
      return Response.json({ data, total, page, limit });
    }
    const rows = await db.select().from(destinations).orderBy(desc(destinations.createdAt)).limit(DEFAULT_LIST_LIMIT);
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    await requireSection(request, "destinations");
    const raw = await request.json().catch(() => null);
    const parsed = destinationSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const body = parsed.data;

    try {
      await db.insert(destinations).values(body);
    } catch (e: unknown) {
      if (isDuplicateKeyError(e)) {
        return Response.json({ error: "A destination with that slug already exists" }, { status: 409 });
      }
      throw e;
    }

    const [row] = await db.select().from(destinations).where(eq(destinations.slug, body.slug));
    return Response.json(row, { status: 201 });
  },
});
