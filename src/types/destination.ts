export type Destination = {
  slug: string;
  name: string;
  country: string;
  region: "Europe" | "Caribbean" | "Indian Ocean" | "Asia" | "Americas" | "Middle East";
  tripType: ("Family" | "Business" | "Honeymoon" | "Luxury" | "City Break")[];
  budgetBand: "££" | "£££" | "££££";
  /** Indicative per-person price in GBP - confirmed live at quote stage */
  fromPrice: number;
  durationNights: number;
  heroImage: string;
  gallery: string[];
  tagline: string;
  summary: string;
  itinerary: { day: string; title: string; detail: string }[];
  highlights: string[];
};
