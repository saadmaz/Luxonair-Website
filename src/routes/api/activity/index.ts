import { createAPIFileRoute } from "@tanstack/react-start/api";
import { count, desc, eq } from "drizzle-orm";
import { db, enquiryPackages, enquiryFlights, contacts, flightOfferBookings } from "../../../../db/index";
import { requireAuth } from "@/server/auth";

export const APIRoute = createAPIFileRoute("/api/activity")({
  GET: async ({ request }) => {
    await requireAuth(request);

    const [
      recentPackages,
      recentFlights,
      unreadContacts,
      [newPackageRow],
      [newFlightRow],
      [unreadContactRow],
      [newFlightBookingRow],
    ] = await Promise.all([
      db
        .select({
          id: enquiryPackages.id,
          name: enquiryPackages.name,
          destination: enquiryPackages.destination,
          createdAt: enquiryPackages.createdAt,
          status: enquiryPackages.status,
        })
        .from(enquiryPackages)
        .orderBy(desc(enquiryPackages.createdAt))
        .limit(5),
      db
        .select({
          id: enquiryFlights.id,
          name: enquiryFlights.name,
          destination: enquiryFlights.destination,
          createdAt: enquiryFlights.createdAt,
          status: enquiryFlights.status,
        })
        .from(enquiryFlights)
        .orderBy(desc(enquiryFlights.createdAt))
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
      db.select({ n: count() }).from(enquiryPackages).where(eq(enquiryPackages.status, "new")),
      db.select({ n: count() }).from(enquiryFlights).where(eq(enquiryFlights.status, "new")),
      db.select({ n: count() }).from(contacts).where(eq(contacts.read, false)),
      db
        .select({ n: count() })
        .from(flightOfferBookings)
        .where(eq(flightOfferBookings.status, "new")),
    ]);

    const recentEnquiries = [
      ...recentPackages.map((e) => ({ ...e, kind: "package" as const })),
      ...recentFlights.map((e) => ({ ...e, kind: "flight" as const })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return Response.json({
      newPackageEnquiryCount: Number(newPackageRow?.n ?? 0),
      newFlightEnquiryCount: Number(newFlightRow?.n ?? 0),
      unreadContactCount: Number(unreadContactRow?.n ?? 0),
      newFlightBookingCount: Number(newFlightBookingRow?.n ?? 0),
      recentEnquiries,
      unreadContacts,
    });
  },
});
