import { createAPIFileRoute } from "@tanstack/react-start/api";
import { asc } from "drizzle-orm";
import { db, faqGroups, faqItems } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/faqs")({
  // Returns groups with nested items — used by admin and public FAQ page
  GET: async () => {
    const groups = await db.select().from(faqGroups).orderBy(asc(faqGroups.sortOrder));
    const items = await db.select().from(faqItems).orderBy(asc(faqItems.sortOrder));
    return Response.json(
      groups.map((g) => ({ ...g, items: items.filter((i) => i.faqGroupId === g.id) }))
    );
  },

  // Create a new FAQ group
  POST: async ({ request }) => {
    await requireAuth(request);
    const body = (await request.json()) as { title: string; sortOrder?: number };
    if (!body.title) return Response.json({ error: "title is required" }, { status: 400 });

    await db.insert(faqGroups).values({ title: body.title, sortOrder: body.sortOrder ?? 0 });
    const groups = await db.select().from(faqGroups).orderBy(asc(faqGroups.sortOrder));
    const items = await db.select().from(faqItems).orderBy(asc(faqItems.sortOrder));
    return Response.json(
      groups.map((g) => ({ ...g, items: items.filter((i) => i.faqGroupId === g.id) })),
      { status: 201 }
    );
  },
});
