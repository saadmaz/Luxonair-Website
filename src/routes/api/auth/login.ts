import { createAPIFileRoute } from "@tanstack/react-start/api";
import { compare } from "bcryptjs";
import { signToken, makeSessionCookie } from "@/server/auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/server/rate-limit";
import { loginSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/auth/login")({
  POST: async ({ request }) => {
    // 5 attempts per 15 minutes per IP
    const ip = getClientIp(request);
    const rl = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
    if (!rl.allowed) return rateLimitResponse(rl.retryAfter);

    const raw = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminHash) {
      return Response.json({ error: "Admin credentials not configured" }, { status: 500 });
    }

    const emailMatch = email.trim().toLowerCase() === adminEmail.toLowerCase();
    const passwordMatch = await compare(password, adminHash);

    if (!emailMatch || !passwordMatch) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({ email: adminEmail });

    return Response.json(
      { ok: true },
      { headers: { "Set-Cookie": makeSessionCookie(token) } }
    );
  },
});
