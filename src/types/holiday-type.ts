export type HolidayType = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  heroImage: string;
  /** Short selling-point bullets shown on the detail page */
  bullets: string[];
  /** Slugs of destinations that belong to this holiday type — used to populate related cards */
  destinationSlugs: string[];
};
