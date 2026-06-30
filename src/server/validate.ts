import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  topic: z.string().max(100).optional(),
  message: z.string().min(10).max(2000),
});

export const enquirySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(30),
  destination: z.string().min(1).max(200),
  region: z.string().max(50).optional(),
  tripType: z.string().min(1).max(50),
  dateMode: z.string().max(20),
  departWindow: z.string().max(100).optional(),
  flexibility: z.string().max(50).optional(),
  departDate: z.string().max(10).optional(),
  returnDate: z.string().max(10).optional(),
  nights: z.number().int().min(1).max(365),
  departAirport: z.string().min(1).max(100),
  cabinClass: z.string().min(1).max(50),
  directOnly: z.string().max(5).optional(),
  preferredAirlines: z.string().max(200).optional(),
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(20).default(0),
  budget: z.string().min(1).max(100),
  notes: z.string().max(2000).optional(),
});

export const subscriberSchema = z.object({
  email: z.string().email().max(255),
});

export const destinationSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  name: z.string().min(1).max(200),
  country: z.string().min(1).max(100),
  region: z.string().max(100).default(""),
  tripType: z.array(z.string().max(50)).default([]),
  budgetBand: z.string().max(10).default("££"),
  fromPrice: z.number().int().min(0),
  durationNights: z.number().int().min(1).max(365),
  heroImage: z.string().max(500).default(""),
  tagline: z.string().max(300).default(""),
  summary: z.string().max(5000).default(""),
  gallery: z.array(z.unknown()).default([]),
  itinerary: z.array(z.unknown()).default([]),
  highlights: z.array(z.unknown()).default([]),
});

export const blogPostSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().min(1).max(300),
  excerpt: z.string().min(1).max(500),
  category: z.string().max(100).default("General"),
  author: z.string().max(100).default("Luxeonair"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  readMinutes: z.number().int().min(1).max(120).default(5),
  heroImage: z.string().max(500).default(""),
  content: z.unknown().default({}),
});

export const dealSchema = z.object({
  id: z.string().min(1).max(100),
  title: z.string().min(1).max(300),
  destinationSlug: z.string().min(1).max(100),
  region: z.string().max(100).default(""),
  nights: z.number().int().min(1).max(365).default(7),
  board: z.string().max(100).default("All Inclusive"),
  fromPrice: z.number().int().min(0),
  oldPrice: z.number().int().min(0).nullable().optional(),
  badge: z.string().max(100).default(""),
  expires: z.string().max(50).default(""),
  image: z.string().max(500).default(""),
  blurb: z.string().max(1000).default(""),
});

export const testimonialSchema = z.object({
  author: z.string().min(1).max(100),
  trip: z.string().max(200).default(""),
  rating: z.number().int().min(1).max(5).default(5),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  body: z.string().min(10).max(2000),
});

export const holidayTypeSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  name: z.string().min(1).max(200),
  tagline: z.string().max(300).default(""),
  summary: z.string().max(5000).default(""),
  heroImage: z.string().max(500).default(""),
  bullets: z.array(z.string().max(200)).default([]),
  destinationSlugs: z.array(z.string().max(100)).default([]),
});

export const faqGroupSchema = z.object({
  title: z.string().min(1).max(200),
  sortOrder: z.number().int().min(0).default(0),
});

export const faqItemSchema = z.object({
  faqGroupId: z.number().int().positive(),
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(5000),
  sortOrder: z.number().int().min(0).default(0),
});
