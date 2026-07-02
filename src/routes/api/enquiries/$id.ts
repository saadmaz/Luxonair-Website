import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, enquiries } from "../../../../db/index";
import { requireAuth } from "@/server/auth";
import { enquiryUpdateSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/enquiries/$id")({
  // Admin: update status or notes
  PATCH: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    const raw = await request.json().catch(() => null);
    const parsed = enquiryUpdateSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const update = parsed.data;
    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    await db.update(enquiries).set(update).where(eq(enquiries.id, id));

    const [row] = await db.select().from(enquiries).where(eq(enquiries.id, id));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  },

  // Admin: delete an enquiry
  DELETE: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    const [result] = await db.delete(enquiries).where(eq(enquiries.id, id));
    if (result.affectedRows === 0) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ ok: true });
  },
});
