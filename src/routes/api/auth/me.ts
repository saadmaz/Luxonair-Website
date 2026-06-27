import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getSession } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/auth/me")({
  GET: async ({ request }) => {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ email: session.email });
  },
});
