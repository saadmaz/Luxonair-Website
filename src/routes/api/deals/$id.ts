import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { db, deals } from "../../../../db/index";
import { requireSection } from "@/server/auth";
import { dealSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/deals/$id")({
  PATCH: async ({ request, params }) => {
    await requireSection(request, "deals");
    const { id } = params;
    const raw = await request.json().catch(() => null);
    const parsed = dealSchema.omit({ id: true }).partial().safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const update = parsed.data;
    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    try {
      await db.update(deals).set(update as Record<string, unknown>).where(eq(deals.id, id));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.toLowerCase().includes("foreign key constraint")) {
        return Response.json(
          { error: "Destination slug does not match any existing destination" },
          { status: 400 },
        );
      }
      // TODO(debug-deals-500): temporary — surface the raw DB error to the
      // (superadmin-only) client so this can be diagnosed without VPS log
      // access. Revert to `throw e` once the live 500 is root-caused.
      console.error("PATCH /api/deals/$id failed:", e);
      return Response.json({ error: `Update failed: ${msg || "unknown error"}` }, { status: 500 });
    }
    const [row] = await db.select().from(deals).where(eq(deals.id, id));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(row);
  },

  DELETE: async ({ request, params }) => {
    await requireSection(request, "deals");
    const { id } = params;
    const [result] = await db.delete(deals).where(eq(deals.id, id));
    if (result.affectedRows === 0) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ ok: true });
  },
});
