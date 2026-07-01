import { createAPIFileRoute } from "@tanstack/react-start/api";
import { count, desc, eq } from "drizzle-orm";
import { db, enquiries, contacts, flightOfferBookings } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/activity")({
  GET: async ({ request }) => {
    await requireAuth(request);

    const [
      recentEnquiries,
      unreadContacts,
      [newEnquiryRow],
      [unreadContactRow],
      [newFlightBookingRow],
    ] = await Promise.all([
      db
        .select({
          id: enquiries.id,
          name: enquiries.name,
          destination: enquiries.destination,
          createdAt: enquiries.createdAt,
          status: enquiries.status,
        })
        .from(enquiries)
        .orderBy(desc(enquiries.createdAt))
        .limit(5),
      db
        .select({
          id: contacts.id,
          name: contacts.name,
          topic: contacts.topic,
          createdAt: contacts.createdAt,
          read: contacts.read,
        })
        .from(contacts)
        .where(eq(contacts.read, false))
        .orderBy(desc(contacts.createdAt))
        .limit(5),
      db.select({ n: count() }).from(enquiries).where(eq(enquiries.status, "new")),
      db.select({ n: count() }).from(contacts).where(eq(contacts.read, false)),
      db
        .select({ n: count() })
        .from(flightOfferBookings)
        .where(eq(flightOfferBookings.status, "new")),
    ]);

    return Response.json({
      newEnquiryCount: Number(newEnquiryRow?.n ?? 0),
      unreadContactCount: Number(unreadContactRow?.n ?? 0),
      newFlightBookingCount: Number(newFlightBookingRow?.n ?? 0),
      recentEnquiries,
      unreadContacts,
    });
  },
});
