export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Guides" | "Family" | "Corporate" | "News";
  author: string;
  /** ISO date string (YYYY-MM-DD) used for display and chronological sorting */
  date: string;
  readMinutes: number;
  heroImage: string;
  /** Ordered content blocks; heading is optional (body-only blocks have no subheading) */
  content: { heading?: string; body: string }[];
};
