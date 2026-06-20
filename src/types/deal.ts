export type Deal = {
  id: string;
  title: string;
  /** Links this deal card to its destination detail page when set */
  destinationSlug?: string;
  region: string;
  nights: number;
  board: string;
  /** Indicative per-person price in GBP */
  fromPrice: number;
  /** Original price shown crossed out for sale display */
  oldPrice?: number;
  badge?: string;
  /** ISO date string - used by /deals to sort and hide expired entries */
  expires: string;
  image: string;
  blurb: string;
};
