import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, blogPosts } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/blog/$id")({
  PATCH: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    const body = (await request.json()) as Partial<{
      slug: string;
      title: string;
      excerpt: string;
      category: string;
      author: string;
      date: string;
      readMinutes: number;
      heroImage: string;
      content: unknown;
    }>;

    const update: Record<string, unknown> = {};
    if (body.slug !== undefined) update.slug = body.slug;
    if (body.title !== undefined) update.title = body.title;
    if (body.excerpt !== undefined) update.excerpt = body.excerpt;
    if (body.category !== undefined) update.category = body.category;
    if (body.author !== undefined) update.author = body.author;
    if (body.date !== undefined) update.date = body.date;
    if (body.readMinutes !== undefined) update.readMinutes = body.readMinutes;
    if (body.heroImage !== undefined) update.heroImage = body.heroImage;
    if (body.content !== undefined) update.content = body.content;

    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    await db.update(blogPosts).set(update).where(eq(blogPosts.id, id));
    const [row] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  },

  DELETE: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return Response.json({ ok: true });
  },
});
