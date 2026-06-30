"use server";
import { SignJWT, jwtVerify } from "jose";
import { randomBytes } from "node:crypto";
import { isNull, eq, and } from "drizzle-orm";
import { db, sessions } from "../../db/index";

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
    .setExpiresIn("7d")
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
