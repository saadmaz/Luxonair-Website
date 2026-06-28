import { createAPIFileRoute } from "@tanstack/react-start/api";
import { desc, eq } from "drizzle-orm";
import { db, blogPosts } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/blog")({
  GET: async ({ request }) => {
    await requireAuth(request);
    const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    await requireAuth(request);
    const body = (await request.json()) as {
      slug: string;
      title: string;
      excerpt: string;
      category: string;
      author: string;
      date: string;
      readMinutes: number;
      heroImage: string;
      content?: unknown;
    };

    if (!body.slug || !body.title || !body.excerpt) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      await db.insert(blogPosts).values({
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt,
        category: body.category ?? "General",
        author: body.author ?? "Luxeonair",
        date: body.date ?? new Date().toISOString().slice(0, 10),
        readMinutes: body.readMinutes ?? 5,
        heroImage: body.heroImage ?? "",
        content: body.content ?? {},
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("Duplicate") || msg.includes("unique")) {
        return Response.json({ error: "A post with that slug already exists" }, { status: 409 });
      }
      throw e;
    }

    const [row] = await db.select().from(blogPosts).where(eq(blogPosts.slug, body.slug));
    return Response.json(row, { status: 201 });
  },
});
