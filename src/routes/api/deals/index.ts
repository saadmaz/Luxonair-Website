import { createAPIFileRoute } from "@tanstack/react-start/api";
import { count, desc, eq } from "drizzle-orm";
import { db, deals } from "../../../../db/index";
import { requireAuth } from "@/server/auth";
import { dealSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/deals")({
  GET: async ({ request }) => {
    await requireAuth(request);
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || "0");
    const page  = Math.max(1, Number(url.searchParams.get("page") || "1"));
    if (limit > 0) {
      const [{ total }] = await db.select({ total: count() }).from(deals);
      const data = await db.select().from(deals).orderBy(desc(deals.createdAt)).limit(limit).offset((page - 1) * limit);
      return Response.json({ data, total, page, limit });
    }
    const rows = await db.select().from(deals).orderBy(desc(deals.createdAt));
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    await requireAuth(request);
    const raw = await request.json().catch(() => null);
    const parsed = dealSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const body = parsed.data;

    try {
      await db.insert(deals).values({ ...body, oldPrice: body.oldPrice ?? null });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("Duplicate") || msg.includes("unique")) {
        return Response.json({ error: "A deal with that ID already exists" }, { status: 409 });
      }
      throw e;
    }

    const [row] = await db.select().from(deals).where(eq(deals.id, body.id));
    return Response.json(row, { status: 201 });
  },
});
