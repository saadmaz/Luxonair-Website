import { createAPIFileRoute } from "@tanstack/react-start/api";
import { asc } from "drizzle-orm";
import { db, faqGroups, faqItems } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/faq-items")({
  POST: async ({ request }) => {
    await requireAuth(request);
    const body = (await request.json()) as {
      faqGroupId: number;
      question: string;
      answer: string;
      sortOrder?: number;
    };

    if (!body.faqGroupId || !body.question || !body.answer) {
      return Response.json({ error: "faqGroupId, question, and answer are required" }, { status: 400 });
    }

    await db.insert(faqItems).values({
      faqGroupId: body.faqGroupId,
      question: body.question,
      answer: body.answer,
      sortOrder: body.sortOrder ?? 0,
    });

    const groups = await db.select().from(faqGroups).orderBy(asc(faqGroups.sortOrder));
    const items = await db.select().from(faqItems).orderBy(asc(faqItems.sortOrder));
    return Response.json(
      groups.map((g) => ({ ...g, items: items.filter((i) => i.faqGroupId === g.id) })),
      { status: 201 }
    );
  },
});
