import { createAPIFileRoute } from "@tanstack/react-start/api";
import { count, desc } from "drizzle-orm";
import { db, subscribers } from "../../../../db/index";
import { requireAuth } from "@/server/auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/server/rate-limit";
import { subscriberSchema } from "@/server/validate";

export const APIRoute = createAPIFileRoute("/api/subscribers")({
  GET: async ({ request }) => {
    await requireAuth(request);
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || "0");
    const page  = Math.max(1, Number(url.searchParams.get("page") || "1"));
    if (limit > 0) {
      const [{ total }] = await db.select({ total: count() }).from(subscribers);
      const data = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt)).limit(limit).offset((page - 1) * limit);
      return Response.json({ data, total, page, limit });
    }
    const rows = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    // 10 subscriptions per 10 minutes per IP (slightly more lenient)
    const ip = getClientIp(request);
    const rl = checkRateLimit(`subscribe:${ip}`, 10, 10 * 60 * 1000);
    if (!rl.allowed) return rateLimitResponse(rl.retryAfter);

    const raw = await request.json().catch(() => null);
    const parsed = subscriberSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Valid email required" }, { status: 400 });
    }

    const email = parsed.data.email.trim().toLowerCase();
    try {
      await db.insert(subscribers).values({ email }).onDuplicateKeyUpdate({ set: { email } });
      return Response.json({ email }, { status: 201 });
    } catch {
      return Response.json({ error: "Could not subscribe" }, { status: 500 });
    }
  },
});
