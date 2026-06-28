import { SignJWT, jwtVerify } from "jose";

const getSecret = () => {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(s);
};

export async function signToken(payload: { email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpiresIn("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as { email: string };
}

export function makeSessionCookie(token: string) {
  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
  return `lx_session=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${maxAge}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

export function clearSessionCookie() {
  return "lx_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0";
}

/** Extracts the JWT from the request cookie and verifies it.
 * Returns the payload on success, or null if missing/invalid. */
export async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const token = cookie.match(/lx_session=([^;]+)/)?.[1];
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

/** Like getSession but throws a 401 Response if not authenticated. */
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
