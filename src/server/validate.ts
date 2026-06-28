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
