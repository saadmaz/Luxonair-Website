import { createAPIFileRoute } from "@tanstack/react-start/api";
import { compare } from "bcryptjs";
import { signToken, makeSessionCookie } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/auth/login")({
  POST: async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };

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
      { headers: { "Set-Cookie": makeSessionCookie(token) } },
    );
  },
});
