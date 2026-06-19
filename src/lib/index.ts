// Central barrel export for all data and config modules.
// Consumer code can import from "@/lib" instead of individual module paths:
//   import { SITE, destinations, AIRLINES } from "@/lib"
export * from "./siteConfig";
export * from "./destinations";
export * from "./deals";
export * from "./holidayTypes";
export * from "./reviews";
export * from "./blog";
export * from "./faq";
export * from "./flights";
export * from "./unsplash";
export { cn } from "./utils";
