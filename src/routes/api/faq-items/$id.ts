import { createAPIFileRoute } from "@tanstack/react-start/api";
import { asc, eq } from "drizzle-orm";
import { db, faqGroups, faqItems } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/faq-items/$id")({
  PATCH: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    const body = (await request.json()) as Partial<{
      question: string;
      answer: string;
      sortOrder: number;
    }>;

    const update: Record<string, unknown> = {};
    if (body.question !== undefined) update.question = body.question;
    if (body.answer !== undefined) update.answer = body.answer;
    if (body.sortOrder !== undefined) update.sortOrder = body.sortOrder;

    if (Object.keys(update).length > 0) {
      await db.update(faqItems).set(update).where(eq(faqItems.id, id));
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
