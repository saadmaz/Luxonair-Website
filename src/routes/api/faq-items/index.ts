import { createAPIFileRoute } from "@tanstack/react-start/api";
import { asc } from "drizzle-orm";
import { db, faqGroups, faqItems } from "../../../../db/index";
import { requireAuth } from "@/server/auth";
import { faqItemSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/faq-items")({
  POST: async ({ request }) => {
    await requireAuth(request);
    const raw = await request.json().catch(() => null);
    const parsed = faqItemSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    await db.insert(faqItems).values(parsed.data);

    const groups = await db.select().from(faqGroups).orderBy(asc(faqGroups.sortOrder));
    const items = await db.select().from(faqItems).orderBy(asc(faqItems.sortOrder));
    return Response.json(
      groups.map((g) => ({ ...g, items: items.filter((i) => i.faqGroupId === g.id) })),
      { status: 201 }
    );
  },
});
