import { createAPIFileRoute } from "@tanstack/react-start/api";
import { clearSessionCookie, getSession, revokeSession } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/auth/logout")({
  POST: async ({ request }) => {
    const session = await getSession(request);
    if (session) await revokeSession(session.sid);

    return Response.json(
      { ok: true },
      { headers: { "Set-Cookie": clearSessionCookie() } },
    );
  },
});
