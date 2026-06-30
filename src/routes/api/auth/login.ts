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

    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email.trim().toLowerCase()))
      .limit(1);

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const passwordMatch = await compare(password, user.passwordHash);
    if (!passwordMatch) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({ email: user.email });

    return Response.json(
      { ok: true },
      { headers: { "Set-Cookie": makeSessionCookie(token) } }
    );
  },
});
