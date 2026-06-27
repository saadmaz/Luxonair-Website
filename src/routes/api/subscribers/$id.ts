import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, subscribers } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/subscribers/$id")({
  // Admin: remove a subscriber
  DELETE: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    await db.delete(subscribers).where(eq(subscribers.id, id));
    return Response.json({ ok: true });
  },
});
