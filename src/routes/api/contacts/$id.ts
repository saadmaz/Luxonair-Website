import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, contacts } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/contacts/$id")({
  // Admin: mark read/unread
  PATCH: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    const body = (await request.json()) as { read?: boolean };

    await db
      .update(contacts)
      .set({ ...(body.read !== undefined && { read: body.read }) })
      .where(eq(contacts.id, id));

    const [row] = await db.select().from(contacts).where(eq(contacts.id, id));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  },

  // Admin: delete a contact message
  DELETE: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    await db.delete(contacts).where(eq(contacts.id, id));
    return Response.json({ ok: true });
  },
});
