import { createAPIFileRoute } from "@tanstack/react-start/api";
import { clearSessionCookie } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/auth/logout")({
  POST: async () => {
    return Response.json(
      { ok: true },
      { headers: { "Set-Cookie": clearSessionCookie() } },
    );
  },
});
