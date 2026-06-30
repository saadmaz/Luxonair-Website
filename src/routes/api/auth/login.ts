import { createAPIFileRoute } from "@tanstack/react-start/api";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, adminUsers } from "../../../../db/index";
import { signToken, makeSessionCookie } from "@/server/auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/server/rate-limit";
import { loginSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/auth/login")({
  POST: async ({ request }) => {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
    if (!rl.allowed) return rateLimitResponse(rl.retryAfter);

    const raw = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const normalEmail = email.trim().toLowerCase();

    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, normalEmail))
      .limit(1);

    let authedEmail: string | null = null;

    if (user) {
      const match = await compare(password, user.passwordHash);
      if (match) authedEmail = user.email;
    } else {
      // Fallback: env-var credentials (used when admin_users table is empty)
      const envEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
      const envHash = (process.env.ADMIN_PASSWORD_HASH ?? "").trim();
      if (envEmail && envHash && normalEmail === envEmail) {
        const match = await compare(password, envHash);
        if (match) authedEmail = normalEmail;
      }
    }

    if (!authedEmail) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({ email: authedEmail });

    return Response.json(
      { ok: true },
      { headers: { "Set-Cookie": makeSessionCookie(token) } }
    );
  },
});
