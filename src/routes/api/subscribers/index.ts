import { createAPIFileRoute } from "@tanstack/react-start/api";
import { desc } from "drizzle-orm";
import { db, subscribers } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/subscribers")({
  // Admin: list all subscribers
  GET: async ({ request }) => {
    await requireAuth(request);
    const rows = await db
      .select()
      .from(subscribers)
      .orderBy(desc(subscribers.createdAt));
    return Response.json(rows);
  },

  // Public: subscribe to newsletter
  POST: async ({ request }) => {
    const body = (await request.json()) as { email: string };

    if (!body.email || !/.+@.+\..+/.test(body.email)) {
      return Response.json({ error: "Valid email required" }, { status: 400 });
    }

    try {
      await db
        .insert(subscribers)
        .values({ email: body.email.trim().toLowerCase() })
        .onDuplicateKeyUpdate({ set: { email: body.email.trim().toLowerCase() } });

      return Response.json({ email: body.email }, { status: 201 });
    } catch {
      return Response.json({ error: "Could not subscribe" }, { status: 500 });
    }
  },
});
