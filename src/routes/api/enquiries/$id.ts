import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, enquiries } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/enquiries/$id")({
  // Admin: update status or notes
  PATCH: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    const body = (await request.json()) as {
      status?: string;
      notes?: string;
    };

    const [row] = await db
      .update(enquiries)
      .set({
        ...(body.status !== undefined && { status: body.status }),
        ...(body.notes !== undefined && { notes: body.notes }),
      })
      .where(eq(enquiries.id, id))
      .returning();

    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  },

  // Admin: delete an enquiry
  DELETE: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);
    await db.delete(enquiries).where(eq(enquiries.id, id));
    return Response.json({ ok: true });
  },
});
