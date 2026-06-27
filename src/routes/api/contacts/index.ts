import { createAPIFileRoute } from "@tanstack/react-start/api";
import { desc } from "drizzle-orm";
import { db, contacts } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/contacts")({
  // Admin: list all contact messages
  GET: async ({ request }) => {
    await requireAuth(request);
    const rows = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt));
    return Response.json(rows);
  },

  // Public: submit a contact message
  POST: async ({ request }) => {
    const body = (await request.json()) as {
      name: string;
      email: string;
      phone?: string;
      topic?: string;
      message: string;
    };

    if (!body.name || !body.email || !body.message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.insert(contacts).values({
      name: body.name,
      email: body.email,
      phone: body.phone ?? null,
      topic: body.topic ?? null,
      message: body.message,
      read: false,
    });

    return Response.json({ ok: true }, { status: 201 });
  },
});
