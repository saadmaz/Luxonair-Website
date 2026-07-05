import { createAPIFileRoute } from "@tanstack/react-start/api";
import { asc, eq } from "drizzle-orm";
import { db, enquiryFlightNotes } from "../../../../db/index";
import { requireSection } from "@/server/auth";
import { enquiryNoteCreateSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/enquiry-flights/$id/notes")({
  GET: async ({ request, params }) => {
    await requireSection(request, "enquiry-flights");
    const id = Number(params.id);

    const rows = await db
      .select()
      .from(enquiryFlightNotes)
      .where(eq(enquiryFlightNotes.enquiryId, id))
      .orderBy(asc(enquiryFlightNotes.createdAt));

    return Response.json(rows);
  },

  POST: async ({ request, params }) => {
    const ctx = await requireSection(request, "enquiry-flights");
    const id = Number(params.id);

    const raw = await request.json().catch(() => null);
    const parsed = enquiryNoteCreateSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const [result] = await db.insert(enquiryFlightNotes).values({
      enquiryId: id,
      body: parsed.data.body,
      type: parsed.data.type,
      authorEmail: ctx.email,
      authorName: ctx.displayName ?? null,
    });

    const [row] = await db.select().from(enquiryFlightNotes).where(eq(enquiryFlightNotes.id, result.insertId));
    return Response.json(row, { status: 201 });
  },
});
