import { createAPIFileRoute } from "@tanstack/react-start/api";
import { desc } from "drizzle-orm";
import { db, testimonials } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/testimonials")({
  GET: async ({ request }) => {
    await requireAuth(request);
    const rows = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    await requireAuth(request);
    const body = (await request.json()) as {
      author: string;
      trip: string;
      rating: number;
      date: string;
      body: string;
    };

    if (!body.author || !body.body) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.insert(testimonials).values({
      author: body.author,
      trip: body.trip ?? "",
      rating: body.rating ?? 5,
      date: body.date ?? new Date().toISOString().slice(0, 10),
      body: body.body,
    });

    const rows = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
    return Response.json(rows[0], { status: 201 });
  },
});
