import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
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
  nights: integer("nights").notNull(),
  departAirport: text("depart_airport").notNull(),
  cabinClass: text("cabin_class").notNull(),
  directOnly: text("direct_only"),
  preferredAirlines: text("preferred_airlines"),
  adults: integer("adults").notNull(),
  children: integer("children").notNull().default(0),
  budget: text("budget").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("new"), // new | in_progress | responded
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  topic: text("topic"),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Enquiry = typeof enquiries.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;
