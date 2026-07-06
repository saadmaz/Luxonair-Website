import { createAPIFileRoute } from "@tanstack/react-start/api";
import { hash } from "bcryptjs";
import { asc } from "drizzle-orm";
import { db, adminUsers } from "../../../../db/index";
import { requireSuperAdmin, requireAdminOrAbove } from "@/server/auth";
import { SECTION_KEYS } from "@/lib/sections";
import { isDuplicateKeyError } from "@/server/db-errors";
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(200),
  role: z.enum(["admin", "superadmin", "user"]).default("admin"),
  sections: z.array(z.enum(SECTION_KEYS)).default([]),
  displayName: z.string().max(100).optional(),
});

const userColumns = {
  id: adminUsers.id,
  email: adminUsers.email,
  role: adminUsers.role,
  sections: adminUsers.sections,
  displayName: adminUsers.displayName,
  createdAt: adminUsers.createdAt,
};

export const APIRoute = createAPIFileRoute("/api/users")({
  GET: async ({ request }) => {
    await requireSuperAdmin(request);
    const rows = await db.select(userColumns).from(adminUsers).orderBy(asc(adminUsers.createdAt));
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    const ctx = await requireAdminOrAbove(request);

    const raw = await request.json().catch(() => null);
    const parsed = createUserSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { email, password, role, sections, displayName } = parsed.data;

    if (ctx.role !== "superadmin") {
      if (role === "superadmin") {
        return Response.json({ error: "Admins cannot create superadmin accounts" }, { status: 403 });
      }
      const forbidden = sections.filter((s) => !ctx.sections.includes(s));
      if (forbidden.length > 0) {
        return Response.json(
          { error: `Cannot assign sections you don't have access to: ${forbidden.join(", ")}` },
          { status: 403 },
        );
      }
    }

    const passwordHash = await hash(password, 12);

    try {
      await db.insert(adminUsers).values({
        email: email.trim().toLowerCase(),
        passwordHash,
        role,
        sections,
        displayName: displayName?.trim() || null,
      });
    } catch (e: unknown) {
      if (isDuplicateKeyError(e)) {
        return Response.json({ error: "A user with that email already exists" }, { status: 409 });
      }
      throw e;
    }

    const rows = await db.select(userColumns).from(adminUsers).orderBy(asc(adminUsers.createdAt));

    return Response.json(rows, { status: 201 });
  },
});
