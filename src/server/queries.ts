"use server";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { asc, count, desc, eq } from "drizzle-orm";
import { getSession } from "./auth";
import {
  db,
  blogPosts,
  destinations,
  deals,
  testimonials,
  faqGroups,
  faqItems,
  holidayTypes,
  enquiries,
  contacts,
  subscribers,
} from "../../db/index";

// ─── Blog ─────────────────────────────────────────────────────────────────────

export const getPublishedBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(blogPosts).orderBy(desc(blogPosts.date));
});

export const getBlogPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data }) => {
    const [row] = await db.select().from(blogPosts).where(eq(blogPosts.slug, data));
    return row ?? null;
  });

// ─── Destinations ─────────────────────────────────────────────────────────────

export const getDestinations = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(destinations).orderBy(asc(destinations.name));
});

export const getDestinationBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data }) => {
    const [row] = await db.select().from(destinations).where(eq(destinations.slug, data));
    return row ?? null;
  });

// ─── Deals ────────────────────────────────────────────────────────────────────

export const getDeals = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(deals).orderBy(asc(deals.expires));
});

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const getTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
});

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export const getFaqsNested = createServerFn({ method: "GET" }).handler(async () => {
  const groups = await db.select().from(faqGroups).orderBy(asc(faqGroups.sortOrder));
  const items = await db.select().from(faqItems).orderBy(asc(faqItems.sortOrder));
  return groups.map((g) => ({ ...g, items: items.filter((i) => i.faqGroupId === g.id) }));
});

// ─── Holiday Types ────────────────────────────────────────────────────────────

export const getHolidayTypes = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(holidayTypes).orderBy(asc(holidayTypes.name));
});

export const getHolidayTypeBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data }) => {
    const [row] = await db.select().from(holidayTypes).where(eq(holidayTypes.slug, data));
    return row ?? null;
  });

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export const getDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  const [[enquiryTotal], [enquiryNew], [contactTotal], [contactUnread], [subscriberTotal]] =
    await Promise.all([
      db.select({ n: count() }).from(enquiries),
      db.select({ n: count() }).from(enquiries).where(eq(enquiries.status, "new")),
      db.select({ n: count() }).from(contacts),
      db.select({ n: count() }).from(contacts).where(eq(contacts.read, false)),
      db.select({ n: count() }).from(subscribers),
    ]);

  return {
    enquiries: Number(enquiryTotal?.n ?? 0),
    newEnquiries: Number(enquiryNew?.n ?? 0),
    contacts: Number(contactTotal?.n ?? 0),
    unreadContacts: Number(contactUnread?.n ?? 0),
    subscribers: Number(subscriberTotal?.n ?? 0),
  };
});

export type FaqNested = Awaited<ReturnType<typeof getFaqsNested>>[number];

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const req = getRequest();
  return await getSession(req);
});
