import { createAPIFileRoute } from "@tanstack/react-start/api";
import { asc, eq } from "drizzle-orm";
import { db, enquiryNotes } from "../../../../db/index";
import { requireSection } from "@/server/auth";
import { enquiryNoteCreateSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/enquiries/$id/notes")({
  GET: async ({ request, params }) => {
    await requireSection(request, "enquiries");
    const id = Number(params.id);

    const rows = await db
      .select()
      .from(enquiryNotes)
      .where(eq(enquiryNotes.enquiryId, id))
      .orderBy(asc(enquiryNotes.createdAt));

    return Response.json(rows);
  },

  POST: async ({ request, params }) => {
    const ctx = await requireSection(request, "enquiries");
    const id = Number(params.id);

    const raw = await request.json().catch(() => null);
    const parsed = enquiryNoteCreateSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const [result] = await db.insert(enquiryNotes).values({
      enquiryId: id,
      body: parsed.data.body,
      authorEmail: ctx.email,
      authorName: ctx.displayName ?? null,
    });

    const [row] = await db.select().from(enquiryNotes).where(eq(enquiryNotes.id, result.insertId));
    return Response.json(row, { status: 201 });
  },
});
