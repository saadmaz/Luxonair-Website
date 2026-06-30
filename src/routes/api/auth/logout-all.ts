import { createAPIFileRoute } from "@tanstack/react-start/api";
import { requireAuth, revokeAllSessions, clearSessionCookie } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/auth/logout-all")({
  POST: async ({ request }) => {
    const session = await requireAuth(request);
    await revokeAllSessions(session.email);
    return Response.json(
      { ok: true },
      { headers: { "Set-Cookie": clearSessionCookie() } },
    );
  },
});
