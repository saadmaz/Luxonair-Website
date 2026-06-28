import { createAPIFileRoute } from "@tanstack/react-start/api";
import { desc, eq } from "drizzle-orm";
import { db, holidayTypes } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/holidays")({
  GET: async ({ request }) => {
    await requireAuth(request);
    const rows = await db.select().from(holidayTypes).orderBy(desc(holidayTypes.createdAt));
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    await requireAuth(request);
    const body = (await request.json()) as {
      slug: string;
      name: string;
      tagline: string;
      summary: string;
      heroImage: string;
      bullets?: string[];
      destinationSlugs?: string[];
    };

    if (!body.slug || !body.name) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      await db.insert(holidayTypes).values({
        slug: body.slug,
        name: body.name,
        tagline: body.tagline ?? "",
        summary: body.summary ?? "",
        heroImage: body.heroImage ?? "",
        bullets: body.bullets ?? [],
        destinationSlugs: body.destinationSlugs ?? [],
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("Duplicate") || msg.includes("unique")) {
        return Response.json({ error: "A holiday type with that slug already exists" }, { status: 409 });
      }
      throw e;
    }

    const [row] = await db.select().from(holidayTypes).where(eq(holidayTypes.slug, body.slug));
    return Response.json(row, { status: 201 });
  },
});
