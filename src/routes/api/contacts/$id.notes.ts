import { createAPIFileRoute } from "@tanstack/react-start/api";
import { asc, eq } from "drizzle-orm";
import { db, contactNotes } from "../../../../db/index";
import { requireSection } from "@/server/auth";
import { contactNoteCreateSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/contacts/$id/notes")({
  GET: async ({ request, params }) => {
    await requireSection(request, "messages");
    const id = Number(params.id);

    const rows = await db
      .select()
      .from(contactNotes)
      .where(eq(contactNotes.contactId, id))
      .orderBy(asc(contactNotes.createdAt));

    return Response.json(rows);
  },

  POST: async ({ request, params }) => {
    const ctx = await requireSection(request, "messages");
    const id = Number(params.id);

    const raw = await request.json().catch(() => null);
    const parsed = contactNoteCreateSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const [result] = await db.insert(contactNotes).values({
      contactId: id,
      body: parsed.data.body,
      type: parsed.data.type,
      authorEmail: ctx.email,
      authorName: ctx.displayName ?? null,
    });

    const [row] = await db.select().from(contactNotes).where(eq(contactNotes.id, result.insertId));
    return Response.json(row, { status: 201 });
  },
});
