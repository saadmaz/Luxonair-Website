import { z } from "zod";
import { NOTE_TYPES } from "@/lib/notes";

export const loginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  topic: z.string().max(100).optional(),
  message: z.string().min(10).max(2000),
});

// ─── Enquiries: two quote types sharing common fields, discriminated by quoteType ──
// Package quotes ask holiday-shaped questions (destination, stay length, hotel/board,
// whether flights are bundled in); flight quotes ask journey-shaped questions (route,
// one-way/return, cabin, airline/routing preference). See src/components/shared/
// PackageQuoteForm.tsx and FlightQuoteForm.tsx for the wizards that produce these payloads.

const enquiryBaseFields = {
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(30),
  destination: z.string().min(1).max(200),
  dateMode: z.enum(["flexible", "specific"]),
  departWindow: z.string().max(100).optional(),
  flexibility: z.string().max(50).optional(),
  departDate: z.string().max(10).optional(),
  returnDate: z.string().max(10).optional(),
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(20).default(0),
  infants: z.number().int().min(0).max(20).default(0),
  budget: z.string().min(1).max(100),
  notes: z.string().max(2000).optional(),
};

const packageEnquiryObject = z.object({
  quoteType: z.literal("package"),
  ...enquiryBaseFields,
  region: z.string().max(50).optional(),
  tripType: z.string().min(1).max(50),
  nights: z.number().int().min(1).max(365),
  hotelRating: z.string().max(50).optional(),
  boardBasis: z.string().max(50).optional(),
  flightsIncluded: z.boolean().default(true),
  departAirport: z.string().max(100).optional(),
  cabinClass: z.string().max(50).optional(),
});

const flightEnquiryObject = z.object({
  quoteType: z.literal("flight"),
  ...enquiryBaseFields,
  tripType: z.enum(["One Way", "Return"]),
  departAirport: z.string().min(1).max(100),
  cabinClass: z.string().min(1).max(50),
  directOnly: z.string().max(20).optional(),
  preferredAirlines: z.string().max(200).optional(),
});

export const enquirySchema = z
  .discriminatedUnion("quoteType", [packageEnquiryObject, flightEnquiryObject])
  .superRefine((d, ctx) => {
    if (d.quoteType === "package" && d.flightsIncluded && !d.departAirport) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Departure airport is required when flights are included",
        path: ["departAirport"],
      });
    }
  });

export const subscriberSchema = z.object({
  email: z.string().email().max(255),
});

export const destinationSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
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
  gallery: z.array(z.string().max(500)).default([]),
  itinerary: z.array(z.object({ day: z.string(), title: z.string(), detail: z.string() })).default([]),
  highlights: z.array(z.string().max(200)).default([]),
});

export const blogPostSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
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
  gallery: z.array(z.string().max(500)).default([]),
  isFavourite: z.boolean().default(false),
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
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  name: z.string().min(1).max(200),
  tagline: z.string().max(300).default(""),
  summary: z.string().max(5000).default(""),
  heroImage: z.string().max(500).default(""),
  bullets: z.array(z.string().max(200)).default([]),
  destinationSlugs: z.array(z.string().max(100)).default([]),
  isFavourite: z.boolean().default(false),
});

export const destinationHighlightSchema = z.object({
  image: z.string().min(1).max(500),
  country: z.string().min(1).max(255),
  city: z.string().min(1).max(255),
  type: z.string().min(1).max(100),
  sortOrder: z.number().int().min(0).default(0),
});

export const faqGroupSchema = z.object({
  title: z.string().min(1).max(200),
  sortOrder: z.number().int().min(0).default(0),
});

export const flightOfferSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with hyphens"),
  cabinClass: z.enum(["Business", "Economy"]),
  fromCode: z.string().min(3).max(10),
  toCode: z.string().min(3).max(10),
  airlineName: z.string().min(1).max(100),
  airlineLogo: z.string().max(500).default(""),
  price: z.number().int().min(0),
  image: z.string().max(500).default(""),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

export const flightOfferBookingSchema = z.object({
  offerId: z.string().min(1).max(100),
  routeLabel: z.string().min(1).max(200),
  cabinClass: z.string().min(1).max(50),
  price: z.number().int().min(0),
  tripType: z.enum(["One Way", "Return"]),
  departDate: z.string().max(10).optional(),
  returnDate: z.string().max(10).optional(),
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(20).default(0),
  infants: z.number().int().min(0).max(20).default(0),
  budget: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(30),
});

export const faqItemSchema = z.object({
  faqGroupId: z.number().int().positive(),
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(5000),
  sortOrder: z.number().int().min(0).default(0),
});

export const enquiryUpdateSchema = z.object({
  status: z.string().max(50).optional(),
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(7).max(30).optional(),
  destination: z.string().min(1).max(200).optional(),
  departDate: z.string().max(10).optional(),
  departWindow: z.string().max(100).optional(),
  nights: z.number().int().min(1).max(365).optional(),
  adults: z.number().int().min(1).max(20).optional(),
  children: z.number().int().min(0).max(20).optional(),
  infants: z.number().int().min(0).max(20).optional(),
  budget: z.string().min(1).max(100).optional(),
  // Package-only edits
  hotelRating: z.string().max(50).optional(),
  boardBasis: z.string().max(50).optional(),
  flightsIncluded: z.boolean().optional(),
  // Flight-only edits
  cabinClass: z.string().max(50).optional(),
  departAirport: z.string().max(100).optional(),
  directOnly: z.string().max(20).optional(),
  preferredAirlines: z.string().max(200).optional(),
});

const noteTypeSchema = z.enum(NOTE_TYPES).default("note");

export const enquiryNoteCreateSchema = z.object({
  body: z.string().trim().min(1).max(5000),
  type: noteTypeSchema,
});

export const contactUpdateSchema = z.object({
  read: z.boolean().optional(),
});

export const contactNoteCreateSchema = z.object({
  body: z.string().trim().min(1).max(5000),
  type: noteTypeSchema,
});

export const flightOfferBookingUpdateSchema = z.object({
  status: z.string().max(20).optional(),
});
