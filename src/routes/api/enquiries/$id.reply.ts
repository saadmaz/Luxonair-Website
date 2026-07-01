import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, enquiries } from "../../../../db/index";
import { requireAuth } from "@/server/auth";
import { sendEnquiryReply } from "@/server/email";

const replySchema = z.object({
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

export const APIRoute = createAPIFileRoute("/api/enquiries/$id/reply")({
  POST: async ({ request, params }) => {
    await requireAuth(request);
    const id = Number(params.id);

    const raw = await request.json().catch(() => null);
    const parsed = replySchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const [enquiry] = await db.select().from(enquiries).where(eq(enquiries.id, id));
    if (!enquiry) return Response.json({ error: "Not found" }, { status: 404 });

    await sendEnquiryReply({
      to: enquiry.email,
      name: enquiry.name,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });

    await db.update(enquiries).set({ status: "responded" }).where(eq(enquiries.id, id));
    const [row] = await db.select().from(enquiries).where(eq(enquiries.id, id));
    return Response.json(row);
  },
});
