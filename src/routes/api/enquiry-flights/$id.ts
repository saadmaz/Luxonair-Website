import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, enquiryFlights } from "../../../../db/index";
import { requireSection } from "@/server/auth";
import { flightEnquiryUpdateSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/enquiry-flights/$id")({
  // Admin: update status or fields
  PATCH: async ({ request, params }) => {
    await requireSection(request, "enquiry-flights");
    const id = Number(params.id);
    const raw = await request.json().catch(() => null);
    const parsed = flightEnquiryUpdateSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const update = parsed.data;
    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    await db.update(enquiryFlights).set(update).where(eq(enquiryFlights.id, id));

    const [row] = await db.select().from(enquiryFlights).where(eq(enquiryFlights.id, id));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  },

  // Admin: delete an enquiry
  DELETE: async ({ request, params }) => {
    await requireSection(request, "enquiry-flights");
    const id = Number(params.id);
    const [result] = await db.delete(enquiryFlights).where(eq(enquiryFlights.id, id));
    if (result.affectedRows === 0) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ ok: true });
  },
});
