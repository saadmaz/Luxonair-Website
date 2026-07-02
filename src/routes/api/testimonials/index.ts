import { createAPIFileRoute } from "@tanstack/react-start/api";
import { count, desc, eq } from "drizzle-orm";
import { db, testimonials } from "../../../../db/index";
import { requireSection } from "@/server/auth";
import { DEFAULT_LIST_LIMIT } from "@/server/pagination";
import { testimonialSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/testimonials")({
  GET: async ({ request }) => {
    await requireSection(request, "testimonials");
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || "0");
    const page  = Math.max(1, Number(url.searchParams.get("page") || "1"));
    if (limit > 0) {
      const [{ total }] = await db.select({ total: count() }).from(testimonials);
      const data = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt)).limit(limit).offset((page - 1) * limit);
      return Response.json({ data, total, page, limit });
    }
    const rows = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt)).limit(DEFAULT_LIST_LIMIT);
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    await requireSection(request, "testimonials");
    const raw = await request.json().catch(() => null);
    const parsed = testimonialSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const [{ id }] = await db.insert(testimonials).values(parsed.data).$returningId();
    const [row] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return Response.json(row, { status: 201 });
  },
});
