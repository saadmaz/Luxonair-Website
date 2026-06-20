// rating is constrained to 4 | 5 - only high-quality reviews are published.
export type Review = {
  id: string;
  author: string;
  /** Short trip descriptor shown beneath the author name */
  trip: string;
  rating: 4 | 5;
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  body: string;
};
