import { compare } from "bcryptjs";
import { SignJWT } from "jose";

const WINDOW_MS = 15 * 60 * 1000;
const MAX = 5;
const limits = new Map<string, { count: number; resetAt: number }>();

function allow(ip: string) {
  const now = Date.now();
  const e = limits.get(ip);
  if (!e || now > e.resetAt) { limits.set(ip, { count: 1, resetAt: now + WINDOW_MS }); return true; }
  if (e.count >= MAX) return false;
  e.count++;
  return true;
}

function deny() {
  return new Response(JSON.stringify({ error: "Invalid credentials" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

export async function handleLogin(request: Request): Promise<Response> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!allow(`login:${ip}`)) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": "900" },
    });
  }

  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400, headers: { "Content-Type": "application/json" } }); }

  const { email, password } = body;
  if (typeof email !== "string" || typeof password !== "string") {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const normalEmail = email.trim().toLowerCase();
  // Env vars take priority; compiled fallbacks ensure login always works on Hostinger
  const envEmail  = (process.env.ADMIN_EMAIL  ?? "luxeonair@gmail.com").trim().toLowerCase();
  const envHash   = (process.env.ADMIN_PASSWORD_HASH ?? "$2b$12$jObDWPR4eRC.GG.UQB4/VOct6GtSkdvyzNoaG5GRE/DYHBzLUF.Ju").trim();
  const jwtSecret = (process.env.JWT_SECRET   ?? "e01c36ff4e682f1351c6438c507f6ec3dd2ebdd13fd49e8da395b1aed6f73a379291ecf85e5b290d56a8cfe59fc801a7").trim();

  if (normalEmail !== envEmail) return deny();

  const match = await compare(password, envHash);
  if (!match) return deny();

  const token = await new SignJWT({ email: normalEmail })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpiresIn("7d")
    .sign(new TextEncoder().encode(jwtSecret));

  const maxAge = 7 * 24 * 60 * 60;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const cookie = `lx_session=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${maxAge}${secure}`;

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Set-Cookie": cookie },
  });
}
