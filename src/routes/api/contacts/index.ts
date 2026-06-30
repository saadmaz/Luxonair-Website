import { createAPIFileRoute } from "@tanstack/react-start/api";
import { count, desc } from "drizzle-orm";
import { db, contacts } from "../../../../db/index";
import { requireAuth } from "@/server/auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/server/rate-limit";
import { contactSchema } from "@/server/validate";
import { sendContactAlert } from "@/server/email";

export const APIRoute = createAPIFileRoute("/api/contacts")({
  GET: async ({ request }) => {
    await requireAuth(request);
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || "0");
    const page  = Math.max(1, Number(url.searchParams.get("page") || "1"));
    if (limit > 0) {
      const [{ total }] = await db.select({ total: count() }).from(contacts);
      const data = await db.select().from(contacts).orderBy(desc(contacts.createdAt)).limit(limit).offset((page - 1) * limit);
      return Response.json({ data, total, page, limit });
    }
    const rows = await db.select().from(contacts).orderBy(desc(contacts.createdAt));
    return Response.json(rows);
  },

  POST: async ({ request }) => {
    // 5 submissions per 10 minutes per IP
    const ip = getClientIp(request);
    const rl = checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.allowed) return rateLimitResponse(rl.retryAfter);

    const raw = await request.json().catch(() => null);
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, topic, message } = parsed.data;
    await db.insert(contacts).values({ name, email, phone: phone ?? null, topic: topic ?? null, message, read: false });

    sendContactAlert({ name, email, phone, topic, message }).catch((err) =>
      console.error("[email] contact alert failed:", err)
    );

    return Response.json({ ok: true }, { status: 201 });
  },
});
