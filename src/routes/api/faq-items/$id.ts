import { createAPIFileRoute } from "@tanstack/react-start/api";
import { asc, eq } from "drizzle-orm";
import { db, faqGroups, faqItems } from "../../../../db/index";
import { requireAuth } from "@/server/auth";
import { faqItemSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/faq-items/$id")({
  PATCH: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    const raw = await request.json().catch(() => null);
    const parsed = faqItemSchema.omit({ faqGroupId: true }).partial().safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const update = parsed.data;
    if (Object.keys(update).length > 0) {
      await db.update(faqItems).set(update as Record<string, unknown>).where(eq(faqItems.id, id));
    }

    const groups = await db.select().from(faqGroups).orderBy(asc(faqGroups.sortOrder));
    const items = await db.select().from(faqItems).orderBy(asc(faqItems.sortOrder));
    return Response.json(
      groups.map((g) => ({ ...g, items: items.filter((i) => i.faqGroupId === g.id) }))
    );
  },

  DELETE: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    await db.delete(faqItems).where(eq(faqItems.id, id));

    const groups = await db.select().from(faqGroups).orderBy(asc(faqGroups.sortOrder));
    const items = await db.select().from(faqItems).orderBy(asc(faqItems.sortOrder));
    return Response.json(
      groups.map((g) => ({ ...g, items: items.filter((i) => i.faqGroupId === g.id) }))
    );
  },
});
