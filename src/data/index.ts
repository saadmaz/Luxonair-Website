// Central barrel export for all static data and lookup functions.
// Import from here: import { destinations, AIRLINES } from "@/data"
// Note: deals, blog, holiday types, reviews and FAQs are DB-driven (see src/server/queries.ts) — not static data.
export * from "./destinations";
export * from "./flights";
export * from "./packages";
