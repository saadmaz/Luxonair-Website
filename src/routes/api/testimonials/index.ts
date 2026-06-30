import { createAPIFileRoute } from "@tanstack/react-start/api";
import { count, desc } from "drizzle-orm";
import { db, testimonials } from "../../../../db/index";
import { requireAuth } from "@/server/auth";
import { testimonialSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/testimonials")({
  GET: async ({ request }) => {
    await requireAuth(request);
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || "0");
    const page  = Math.max(1, Number(url.searchParams.get("page") || "1"));
    if (limit > 0) {
      const [{ total }] = await db.select({ total: count() }).from(testimonials);
      const data = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt)).limit(limit).offset((page - 1) * limit);
      return Response.json({ data, total, page, limit });
    }
    const rows = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    await requireAuth(request);
    const raw = await request.json().catch(() => null);
    const parsed = testimonialSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    await db.insert(testimonials).values(parsed.data);
    const rows = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
    return Response.json(rows[0], { status: 201 });
  },
});
