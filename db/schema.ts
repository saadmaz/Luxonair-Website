import { boolean, int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const enquiries = mysqlTable("enquiries", {
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
});

export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  topic: text("topic"),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const subscribers = mysqlTable("subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Enquiry = typeof enquiries.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;
