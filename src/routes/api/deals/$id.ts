import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, deals } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/deals/$id")({
  PATCH: async ({ request, params }) => {
    await requireAuth(request);
    const { id } = params;
    const body = (await request.json()) as Partial<{
      title: string;
      destinationSlug: string;
      region: string;
      nights: number;
      board: string;
      fromPrice: number;
      oldPrice: number | null;
      badge: string;
      expires: string;
      image: string;
      blurb: string;
    }>;

    const update: Record<string, unknown> = {};
    for (const key of ["title","destinationSlug","region","nights","board","fromPrice","oldPrice","badge","expires","image","blurb"] as const) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    await db.update(deals).set(update).where(eq(deals.id, id));
    const [row] = await db.select().from(deals).where(eq(deals.id, id));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  },

  DELETE: async ({ request, params }) => {
    await requireAuth(request);
    const { id } = params;
    await db.delete(deals).where(eq(deals.id, id));
    return Response.json({ ok: true });
  },
});
