import { createAPIFileRoute } from "@tanstack/react-start/api";
import { hash } from "bcryptjs";
import { asc, eq } from "drizzle-orm";
import { db, adminUsers } from "../../../../db/index";
import { requireAuth } from "@/server/auth";
import { z } from "zod";

const updateUserSchema = z.object({
  email: z.string().email().max(255).optional(),
  password: z.string().min(8).max(200).optional(),
});

export const APIRoute = createAPIFileRoute("/api/users/$id")({
  PATCH: async ({ request, params }) => {
    const session = await requireAuth(request);
    const id = Number(params.id);

    const raw = await request.json().catch(() => null);
    const parsed = updateUserSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const update: Record<string, unknown> = {};
    if (parsed.data.email) update.email = parsed.data.email.trim().toLowerCase();
    if (parsed.data.password) update.passwordHash = await hash(parsed.data.password, 12);

    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    await db.update(adminUsers).set(update).where(eq(adminUsers.id, id));

    const rows = await db
      .select({ id: adminUsers.id, email: adminUsers.email, createdAt: adminUsers.createdAt })
      .from(adminUsers)
      .orderBy(asc(adminUsers.createdAt));

    void session;
    return Response.json(rows);
  },

  DELETE: async ({ request, params }) => {
    const session = await requireAuth(request);
    const id = Number(params.id);

    // Prevent deleting yourself
    const [target] = await db
      .select({ email: adminUsers.email })
      .from(adminUsers)
      .where(eq(adminUsers.id, id));

    if (!target) return Response.json({ error: "Not found" }, { status: 404 });
    if (target.email === session.email) {
      return Response.json({ error: "You cannot delete your own account" }, { status: 403 });
    }

    await db.delete(adminUsers).where(eq(adminUsers.id, id));

    const rows = await db
      .select({ id: adminUsers.id, email: adminUsers.email, createdAt: adminUsers.createdAt })
      .from(adminUsers)
      .orderBy(asc(adminUsers.createdAt));

    return Response.json(rows);
  },
});
