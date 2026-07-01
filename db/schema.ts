import {
  bigint,
  boolean,
  index,
  int,
  json,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import type { JSONContent } from "@tiptap/react";

export const enquiries = mysqlTable(
  "enquiries",
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
    departAirport: text("depart_airport").notNull(),
    cabinClass: text("cabin_class").notNull(),
    directOnly: text("direct_only"),
    preferredAirlines: text("preferred_airlines"),
    adults: int("adults").notNull(),
    children: int("children").notNull().default(0),
    budget: text("budget").notNull(),
    notes: text("notes"),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("enquiries_status_idx").on(t.status),
    index("enquiries_created_at_idx").on(t.createdAt),
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

export type Enquiry = typeof enquiries.$inferSelect;
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
    destinationSlug: varchar("destination_slug", { length: 255 }).notNull(),
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
    offerId: varchar("offer_id", { length: 100 }).notNull(),
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

export const rateLimits = mysqlTable("rate_limits", {
  key: varchar("key", { length: 255 }).primaryKey(),
  count: int("count").notNull().default(1),
  resetAt: bigint("reset_at", { mode: "number" }).notNull(),
});

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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

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
