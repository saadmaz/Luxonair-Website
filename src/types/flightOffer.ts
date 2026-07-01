export type FlightOffer = {
  id: string;
  cabinClass: string;
  fromCity: string;
  fromCountry: string;
  toCity: string;
  toCountry: string;
  airlineName: string;
  airlineLogo: string;
  /** Indicative per-person price in GBP */
  price: number;
  image: string;
  featured: boolean;
  sortOrder: number;
};
