import {
  boolean,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import type { JSONContent } from "@tiptap/react";

// Two fully separate enquiry tables — a package enquiry and a flight enquiry
// share almost no required fields in practice (see PackageQuoteForm vs
// FlightQuoteForm), so keeping them as distinct tables means every column is
// meaningful for its row instead of being null half the time.
export const enquiryPackages = mysqlTable(
  "enquiry_packages",
  {
    id: int("id").autoincrement().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    destination: text("destination").notNull(),
    region: text("region"),
    tripType: text("trip_type").notNull(),
    dateMode: text("date_mode").notNull(),
    departWindow: text("depart_window"),
    flexibility: text("flexibility"),
    departDate: text("depart_date"),
    returnDate: text("return_date"),
    nights: int("nights").notNull(),
    budget: text("budget").notNull(),
    hotelRating: text("hotel_rating"),
    boardBasis: text("board_basis"),
    flightsIncluded: boolean("flights_included").notNull().default(true),
    // Only set when flightsIncluded is true.
    departAirport: text("depart_airport"),
    cabinClass: text("cabin_class"),
    adults: int("adults").notNull(),
    children: int("children").notNull().default(0),
    infants: int("infants").notNull().default(0),
    notes: text("notes"),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("enquiry_packages_status_idx").on(t.status),
    index("enquiry_packages_created_at_idx").on(t.createdAt),
  ],
);

export const enquiryFlights = mysqlTable(
  "enquiry_flights",
  {
    id: int("id").autoincrement().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    departAirport: text("depart_airport").notNull(),
    destination: text("destination").notNull(),
    tripType: varchar("trip_type", { length: 20 }).notNull(),
    dateMode: text("date_mode").notNull(),
    departWindow: text("depart_window"),
    departDate: text("depart_date"),
    returnDate: text("return_date"),
    adults: int("adults").notNull(),
    children: int("children").notNull().default(0),
    infants: int("infants").notNull().default(0),
    cabinClass: text("cabin_class").notNull(),
    directOnly: text("direct_only"),
    preferredAirlines: text("preferred_airlines"),
    budget: text("budget").notNull(),
    notes: text("notes"),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("enquiry_flights_status_idx").on(t.status),
    index("enquiry_flights_created_at_idx").on(t.createdAt),
  ],
);

export const contacts = mysqlTable(
  "contacts",
  {
    id: int("id").autoincrement().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    topic: text("topic"),
    message: text("message").notNull(),
    read: boolean("read").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("contacts_read_idx").on(t.read), index("contacts_created_at_idx").on(t.createdAt)],
);

export const subscribers = mysqlTable(
  "subscribers",
  {
    id: int("id").autoincrement().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("subscribers_created_at_idx").on(t.createdAt)],
);

export type EnquiryPackage = typeof enquiryPackages.$inferSelect;
export type EnquiryFlight = typeof enquiryFlights.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;

// ─── Content tables ───────────────────────────────────────────────────────────

export const blogPosts = mysqlTable(
  "blog_posts",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    category: varchar("category", { length: 50 }).notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    date: varchar("date", { length: 10 }).notNull(),
    readMinutes: int("read_minutes").notNull().default(5),
    heroImage: text("hero_image").notNull(),
    content: json("content").$type<JSONContent>().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("blog_posts_date_idx").on(t.date)],
);

export const destinations = mysqlTable(
  "destinations",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    name: text("name").notNull(),
    country: varchar("country", { length: 255 }).notNull(),
    region: varchar("region", { length: 50 }).notNull(),
    tripType: json("trip_type").$type<string[]>().notNull(),
    budgetBand: varchar("budget_band", { length: 10 }).notNull(),
    fromPrice: int("from_price").notNull(),
    durationNights: int("duration_nights").notNull(),
    heroImage: text("hero_image").notNull(),
    gallery: json("gallery").$type<string[]>().notNull(),
    tagline: text("tagline").notNull(),
    summary: text("summary").notNull(),
    itinerary: json("itinerary").$type<{ day: string; title: string; detail: string }[]>().notNull(),
    highlights: json("highlights").$type<string[]>().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("destinations_region_idx").on(t.region),
    index("destinations_budget_band_idx").on(t.budgetBand),
  ],
);

export const deals = mysqlTable(
  "deals",
  {
    id: varchar("id", { length: 100 }).primaryKey(),
    title: text("title").notNull(),
    destinationSlug: varchar("destination_slug", { length: 255 })
      .notNull()
      .references(() => destinations.slug, { onDelete: "restrict" }),
    region: varchar("region", { length: 100 }).notNull(),
    nights: int("nights").notNull(),
    board: varchar("board", { length: 50 }).notNull(),
    fromPrice: int("from_price").notNull(),
    oldPrice: int("old_price"),
    badge: varchar("badge", { length: 50 }).notNull(),
    expires: varchar("expires", { length: 10 }).notNull(),
    image: text("image").notNull(),
    gallery: json("gallery").$type<string[]>().notNull().default([]),
    isFavourite: boolean("is_favourite").notNull().default(false),
    blurb: text("blurb").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("deals_expires_idx").on(t.expires), index("deals_is_favourite_idx").on(t.isFavourite)],
);

export const testimonials = mysqlTable(
  "testimonials",
  {
    id: int("id").autoincrement().primaryKey(),
    author: varchar("author", { length: 255 }).notNull(),
    trip: varchar("trip", { length: 255 }).notNull(),
    rating: int("rating").notNull().default(5),
    date: varchar("date", { length: 10 }).notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("testimonials_created_at_idx").on(t.createdAt)],
);

export const faqGroups = mysqlTable(
  "faq_groups",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    sortOrder: int("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("faq_groups_sort_order_idx").on(t.sortOrder)],
);

export const faqItems = mysqlTable(
  "faq_items",
  {
    id: int("id").autoincrement().primaryKey(),
    faqGroupId: int("faq_group_id")
      .notNull()
      .references(() => faqGroups.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    sortOrder: int("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("faq_items_group_id_idx").on(t.faqGroupId),
    index("faq_items_sort_order_idx").on(t.sortOrder),
  ],
);

export const holidayTypes = mysqlTable("holiday_types", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  tagline: text("tagline").notNull(),
  summary: text("summary").notNull(),
  heroImage: text("hero_image").notNull(),
  bullets: json("bullets").$type<string[]>().notNull(),
  destinationSlugs: json("destination_slugs").$type<string[]>().notNull(),
  isFavourite: boolean("is_favourite").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const destinationHighlights = mysqlTable(
  "destination_highlights",
  {
    id: int("id").autoincrement().primaryKey(),
    image: text("image").notNull(),
    country: varchar("country", { length: 255 }).notNull(),
    city: varchar("city", { length: 255 }).notNull(),
    type: varchar("type", { length: 100 }).notNull(),
    sortOrder: int("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("destination_highlights_sort_order_idx").on(t.sortOrder)],
);

export const flightOffers = mysqlTable(
  "flight_offers",
  {
    id: varchar("id", { length: 100 }).primaryKey(),
    cabinClass: varchar("cabin_class", { length: 20 }).notNull(),
    fromCode: varchar("from_code", { length: 10 }).notNull(),
    toCode: varchar("to_code", { length: 10 }).notNull(),
    airlineName: varchar("airline_name", { length: 100 }).notNull(),
    airlineLogo: text("airline_logo").notNull(),
    price: int("price").notNull(),
    image: text("image").notNull(),
    featured: boolean("featured").notNull().default(false),
    sortOrder: int("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("flight_offers_cabin_class_idx").on(t.cabinClass),
    index("flight_offers_sort_order_idx").on(t.sortOrder),
  ],
);

export const flightOfferBookings = mysqlTable(
  "flight_offer_bookings",
  {
    id: int("id").autoincrement().primaryKey(),
    offerId: varchar("offer_id", { length: 100 })
      .notNull()
      .references(() => flightOffers.id, { onDelete: "restrict" }),
    routeLabel: text("route_label").notNull(),
    cabinClass: varchar("cabin_class", { length: 20 }).notNull(),
    price: int("price").notNull(),
    tripType: varchar("trip_type", { length: 20 }).notNull(),
    departDate: varchar("depart_date", { length: 10 }),
    returnDate: varchar("return_date", { length: 10 }),
    adults: int("adults").notNull(),
    children: int("children").notNull().default(0),
    infants: int("infants").notNull().default(0),
    budget: text("budget"),
    notes: text("notes"),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    status: varchar("status", { length: 20 }).notNull().default("new"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("flight_offer_bookings_status_idx").on(t.status),
    index("flight_offer_bookings_created_at_idx").on(t.createdAt),
  ],
);

export const sessions = mysqlTable(
  "sessions",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    revokedAt: timestamp("revoked_at"),
  },
  (t) => [index("sessions_email_idx").on(t.email)],
);

export const adminUsers = mysqlTable("admin_users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["admin", "superadmin", "user"]).notNull().default("admin"),
  sections: json("sections").$type<string[]>().notNull().default([]),
  displayName: varchar("display_name", { length: 100 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Shared across enquiry_notes and contact_notes — an append-only CRM-style
// activity log (plain notes as well as logged calls/follow-ups/emails).
// Not exported: db/index.ts derives its JSON-column cache by assuming every
// export from this file is a mysqlTable, so any non-table export crashes it.
const NOTE_TYPE_VALUES = ["note", "call", "follow_up", "email"] as const;

export const enquiryPackageNotes = mysqlTable(
  "enquiry_package_notes",
  {
    id: int("id").autoincrement().primaryKey(),
    enquiryId: int("enquiry_id")
      .notNull()
      .references(() => enquiryPackages.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    type: mysqlEnum("type", NOTE_TYPE_VALUES).notNull().default("note"),
    authorEmail: varchar("author_email", { length: 255 }).notNull(),
    authorName: varchar("author_name", { length: 100 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("enquiry_package_notes_enquiry_id_idx").on(t.enquiryId)],
);

export const enquiryFlightNotes = mysqlTable(
  "enquiry_flight_notes",
  {
    id: int("id").autoincrement().primaryKey(),
    enquiryId: int("enquiry_id")
      .notNull()
      .references(() => enquiryFlights.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    type: mysqlEnum("type", NOTE_TYPE_VALUES).notNull().default("note"),
    authorEmail: varchar("author_email", { length: 255 }).notNull(),
    authorName: varchar("author_name", { length: 100 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("enquiry_flight_notes_enquiry_id_idx").on(t.enquiryId)],
);

export const contactNotes = mysqlTable(
  "contact_notes",
  {
    id: int("id").autoincrement().primaryKey(),
    contactId: int("contact_id")
      .notNull()
      .references(() => contacts.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    type: mysqlEnum("type", NOTE_TYPE_VALUES).notNull().default("note"),
    authorEmail: varchar("author_email", { length: 255 }).notNull(),
    authorName: varchar("author_name", { length: 100 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("contact_notes_contact_id_idx").on(t.contactId)],
);

export const adminActions = mysqlTable(
  "admin_actions",
  {
    id: int("id").autoincrement().primaryKey(),
    adminEmail: varchar("admin_email", { length: 255 }).notNull(),
    method: varchar("method", { length: 10 }).notNull(),
    path: varchar("path", { length: 500 }).notNull(),
    status: int("status").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("admin_actions_admin_email_idx").on(t.adminEmail),
    index("admin_actions_created_at_idx").on(t.createdAt),
  ],
);

export type BlogPost = typeof blogPosts.$inferSelect;
export type Destination = typeof destinations.$inferSelect;
export type Deal = typeof deals.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type FaqGroup = typeof faqGroups.$inferSelect;
export type FaqItem = typeof faqItems.$inferSelect;
export type HolidayType = typeof holidayTypes.$inferSelect;
export type DestinationHighlight = typeof destinationHighlights.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type FlightOffer = typeof flightOffers.$inferSelect;
export type FlightOfferBooking = typeof flightOfferBookings.$inferSelect;
export type AdminAction = typeof adminActions.$inferSelect;
export type EnquiryPackageNote = typeof enquiryPackageNotes.$inferSelect;
export type EnquiryFlightNote = typeof enquiryFlightNotes.$inferSelect;
export type ContactNote = typeof contactNotes.$inferSelect;
