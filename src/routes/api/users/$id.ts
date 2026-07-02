import { createAPIFileRoute } from "@tanstack/react-start/api";
import { hash } from "bcryptjs";
import { asc, count, eq } from "drizzle-orm";
import { db, adminUsers } from "../../../../db/index";
import { requireSuperAdmin } from "@/server/auth";
import { SECTION_KEYS } from "@/lib/sections";
import { z } from "zod";

const updateUserSchema = z.object({
  email: z.string().email().max(255).optional(),
  password: z.string().min(8).max(200).optional(),
  role: z.enum(["admin", "superadmin", "user"]).optional(),
  sections: z.array(z.enum(SECTION_KEYS)).optional(),
});

const userColumns = {
  id: adminUsers.id,
  email: adminUsers.email,
  role: adminUsers.role,
  sections: adminUsers.sections,
  createdAt: adminUsers.createdAt,
};

export const APIRoute = createAPIFileRoute("/api/users/$id")({
  PATCH: async ({ request, params }) => {
    await requireSuperAdmin(request);
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
    if (parsed.data.role) update.role = parsed.data.role;
    if (parsed.data.sections) update.sections = parsed.data.sections;

    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Nothing to update" }, { status: 400 });
    }

    if (parsed.data.role && parsed.data.role !== "superadmin") {
      const [target] = await db.select({ role: adminUsers.role }).from(adminUsers).where(eq(adminUsers.id, id));
      if (target?.role === "superadmin") {
        const [{ n }] = await db.select({ n: count() }).from(adminUsers).where(eq(adminUsers.role, "superadmin"));
        if (Number(n) <= 1) {
          return Response.json({ error: "Cannot demote the last superadmin account" }, { status: 409 });
        }
      }
    }

    await db.update(adminUsers).set(update).where(eq(adminUsers.id, id));

    const rows = await db.select(userColumns).from(adminUsers).orderBy(asc(adminUsers.createdAt));

    return Response.json(rows);
  },

  DELETE: async ({ request, params }) => {
    const session = await requireSuperAdmin(request);
    const id = Number(params.id);

    const [target] = await db
      .select({ email: adminUsers.email, role: adminUsers.role })
      .from(adminUsers)
      .where(eq(adminUsers.id, id));

    if (!target) return Response.json({ error: "Not found" }, { status: 404 });
    if (target.email === session.email) {
      return Response.json({ error: "You cannot delete your own account" }, { status: 403 });
    }
    if (target.role === "superadmin") {
      const [{ n }] = await db.select({ n: count() }).from(adminUsers).where(eq(adminUsers.role, "superadmin"));
      if (Number(n) <= 1) {
        return Response.json({ error: "Cannot delete the last superadmin account" }, { status: 409 });
      }
    }

    await db.delete(adminUsers).where(eq(adminUsers.id, id));

    const rows = await db.select(userColumns).from(adminUsers).orderBy(asc(adminUsers.createdAt));

    return Response.json(rows);
  },
});
