"use server";
import { SignJWT, jwtVerify } from "jose";
import { randomBytes } from "node:crypto";
import { isNull, eq, and } from "drizzle-orm";
import { db, sessions, adminUsers } from "../../db/index";
import type { SectionKey } from "@/lib/sections";

const getSecret = () => {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(s);
};

type JwtPayload = { email: string; sid: string };

export async function createSession(email: string): Promise<string> {
  const sid = randomBytes(32).toString("hex");
  await db.insert(sessions).values({ id: sid, email });
  return sid;
}

export async function signToken(payload: JwtPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const { email, sid } = payload as JwtPayload;
    if (!email || !sid) return null;

    const [row] = await db
      .select({ id: sessions.id })
      .from(sessions)
      .where(and(eq(sessions.id, sid), isNull(sessions.revokedAt)))
      .limit(1);

    if (!row) return null;
    return { email, sid };
  } catch {
    return null;
  }
}

export async function revokeAllSessions(email: string) {
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(and(eq(sessions.email, email), isNull(sessions.revokedAt)));
}

export async function revokeSession(sid: string) {
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(and(eq(sessions.id, sid), isNull(sessions.revokedAt)));
}

export function makeSessionCookie(token: string) {
  const maxAge = 7 * 24 * 60 * 60;
  return `lx_session=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${maxAge}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

export function clearSessionCookie() {
  return "lx_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0";
}

export async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const token = cookie.match(/lx_session=([^;]+)/)?.[1];
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(request: Request) {
  const session = await getSession(request);
  if (!session) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return session;
}

export type UserContext = {
  email: string;
  sid: string;
  role: "superadmin" | "admin" | "user";
  sections: SectionKey[];
  displayName: string | null;
};

// The bootstrap ADMIN_USERNAME/ADMIN_PASSWORD_HASH account never has a row in
// admin_users (see login.ts) — it's always treated as superadmin.
export async function getUserContext(request: Request): Promise<UserContext> {
  const session = await requireAuth(request);

  const envUsername = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  if (envUsername && session.email === envUsername) {
    return { ...session, role: "superadmin", sections: [], displayName: null };
  }

  const [user] = await db
    .select({ role: adminUsers.role, sections: adminUsers.sections, displayName: adminUsers.displayName })
    .from(adminUsers)
    .where(eq(adminUsers.email, session.email))
    .limit(1);

  if (!user) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return {
    ...session,
    role: user.role,
    sections: (user.sections ?? []) as SectionKey[],
    displayName: user.displayName,
  };
}

export async function requireSuperAdmin(request: Request): Promise<UserContext> {
  const ctx = await getUserContext(request);
  if (ctx.role !== "superadmin") {
    throw new Response(JSON.stringify({ error: "Forbidden — superadmin required" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return ctx;
}

// Blocks the "user" role from user-management endpoints; admins may still
// create/manage users (limited to their own sections — enforced by the caller).
export async function requireAdminOrAbove(request: Request): Promise<UserContext> {
  const ctx = await getUserContext(request);
  if (ctx.role === "user") {
    throw new Response(JSON.stringify({ error: "Forbidden — admin access required" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return ctx;
}

export async function requireSection(request: Request, section: SectionKey): Promise<UserContext> {
  const ctx = await getUserContext(request);
  if (ctx.role === "superadmin") return ctx;
  if (!ctx.sections.includes(section)) {
    throw new Response(JSON.stringify({ error: "Forbidden — you don't have access to this section" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return ctx;
}
