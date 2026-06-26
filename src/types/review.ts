export type Review = {
  id: string;
  author: string;
  /** Short trip descriptor shown beneath the author name */
  trip: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  body: string;
};
