import { createAPIFileRoute } from "@tanstack/react-start/api";
import { desc, eq } from "drizzle-orm";
import { db, deals } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/deals")({
  GET: async ({ request }) => {
    await requireAuth(request);
    const rows = await db.select().from(deals).orderBy(desc(deals.createdAt));
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    await requireAuth(request);
    const body = (await request.json()) as {
      id: string;
      title: string;
      destinationSlug: string;
      region: string;
      nights: number;
      board: string;
      fromPrice: number;
      oldPrice?: number;
      badge: string;
      expires: string;
      image: string;
      blurb: string;
    };

    if (!body.id || !body.title || !body.destinationSlug) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      await db.insert(deals).values({
        id: body.id,
        title: body.title,
        destinationSlug: body.destinationSlug,
        region: body.region ?? "",
        nights: body.nights ?? 7,
        board: body.board ?? "All Inclusive",
        fromPrice: body.fromPrice ?? 0,
        oldPrice: body.oldPrice ?? null,
        badge: body.badge ?? "",
        expires: body.expires ?? "",
        image: body.image ?? "",
        blurb: body.blurb ?? "",
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("Duplicate") || msg.includes("unique")) {
        return Response.json({ error: "A deal with that ID already exists" }, { status: 409 });
      }
      throw e;
    }

    const [row] = await db.select().from(deals).where(eq(deals.id, body.id));
    return Response.json(row, { status: 201 });
  },
});
