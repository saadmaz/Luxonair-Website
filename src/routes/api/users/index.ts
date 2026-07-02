import { createAPIFileRoute } from "@tanstack/react-start/api";
import { hash } from "bcryptjs";
import { asc } from "drizzle-orm";
import { db, adminUsers } from "../../../../db/index";
import { requireSuperAdmin } from "@/server/auth";
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(200),
  role: z.enum(["admin", "superadmin"]).default("admin"),
});

export const APIRoute = createAPIFileRoute("/api/users")({
  GET: async ({ request }) => {
    await requireSuperAdmin(request);
    const rows = await db
      .select({ id: adminUsers.id, email: adminUsers.email, role: adminUsers.role, createdAt: adminUsers.createdAt })
      .from(adminUsers)
      .orderBy(asc(adminUsers.createdAt));
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    await requireSuperAdmin(request);

    const raw = await request.json().catch(() => null);
    const parsed = createUserSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { email, password, role } = parsed.data;
    const passwordHash = await hash(password, 12);

    try {
      await db.insert(adminUsers).values({ email: email.trim().toLowerCase(), passwordHash, role });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("Duplicate") || msg.includes("unique")) {
        return Response.json({ error: "A user with that email already exists" }, { status: 409 });
      }
      throw e;
    }

    const rows = await db
      .select({ id: adminUsers.id, email: adminUsers.email, role: adminUsers.role, createdAt: adminUsers.createdAt })
      .from(adminUsers)
      .orderBy(asc(adminUsers.createdAt));

    return Response.json(rows, { status: 201 });
  },
});
