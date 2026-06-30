import { createAPIFileRoute } from "@tanstack/react-start/api";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, adminUsers } from "../../../../db/index";
import { signToken, makeSessionCookie, createSession } from "@/server/auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/server/rate-limit";
import { loginSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/auth/login")({
  POST: async ({ request }) => {
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
    if (!rl.allowed) return rateLimitResponse(rl.retryAfter);

    const raw = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const normalEmail = email.trim().toLowerCase();

    // ── Path 1: env-var credentials (no DB required) ─────────────────────────
    const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const envHash  = process.env.ADMIN_PASSWORD_HASH?.trim();
    if (!envEmail || !envHash) {
      console.error("ADMIN_EMAIL and ADMIN_PASSWORD_HASH environment variables must be set");
      return Response.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    if (normalEmail === envEmail) {
      const match = await compare(password, envHash);
      if (!match) return Response.json({ error: "Invalid credentials" }, { status: 401 });
      const sid = await createSession(envEmail);
      const token = await signToken({ email: envEmail, sid });
      return Response.json({ ok: true }, { headers: { "Set-Cookie": makeSessionCookie(token) } });
    }

    // ── Path 2: database lookup ───────────────────────────────────────────────
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, normalEmail))
      .limit(1);

    if (!user) return Response.json({ error: "Invalid credentials" }, { status: 401 });

    const match = await compare(password, user.passwordHash);
    if (!match) return Response.json({ error: "Invalid credentials" }, { status: 401 });

    const sid = await createSession(user.email);
    const token = await signToken({ email: user.email, sid });
    return Response.json({ ok: true }, { headers: { "Set-Cookie": makeSessionCookie(token) } });
  },
});
