import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, subscribers } from "../../../../db/index";
import { requireSection } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/subscribers/$id")({
  // Admin: remove a subscriber
  DELETE: async ({ request, params }) => {
    await requireSection(request, "subscribers");
    const id = Number(params.id);
    const [result] = await db.delete(subscribers).where(eq(subscribers.id, id));
    if (result.affectedRows === 0) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ ok: true });
  },
});
