import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, contacts } from "../../../../db/index";
import { requireSection } from "@/server/auth";
import { contactUpdateSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/contacts/$id")({
  // Admin: mark read/unread
  PATCH: async ({ request, params }) => {
    await requireSection(request, "messages");
    const id = Number(params.id);
    const raw = await request.json().catch(() => null);
    const parsed = contactUpdateSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const update = parsed.data;
    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    await db.update(contacts).set(update).where(eq(contacts.id, id));

    const [row] = await db.select().from(contacts).where(eq(contacts.id, id));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  },

  // Admin: delete a contact message
  DELETE: async ({ request, params }) => {
    await requireSection(request, "messages");
    const id = Number(params.id);
    const [result] = await db.delete(contacts).where(eq(contacts.id, id));
    if (result.affectedRows === 0) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ ok: true });
  },
});
