import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, holidayTypes } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/holidays/$id")({
  PATCH: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    const body = (await request.json()) as Partial<{
      slug: string;
      name: string;
      tagline: string;
      summary: string;
      heroImage: string;
      bullets: string[];
      destinationSlugs: string[];
    }>;

    const update: Record<string, unknown> = {};
    for (const key of ["slug","name","tagline","summary","heroImage","bullets","destinationSlugs"] as const) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    await db.update(holidayTypes).set(update).where(eq(holidayTypes.id, id));
    const [row] = await db.select().from(holidayTypes).where(eq(holidayTypes.id, id));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  },

  DELETE: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    await db.delete(holidayTypes).where(eq(holidayTypes.id, id));
    return Response.json({ ok: true });
  },
});
