import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getUserContext } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/auth/me")({
  GET: async ({ request }) => {
    try {
      const ctx = await getUserContext(request);
      return Response.json({ email: ctx.email, role: ctx.role, sections: ctx.sections });
    } catch (e) {
      if (e instanceof Response) return e;
      throw e;
    }
  },
});
