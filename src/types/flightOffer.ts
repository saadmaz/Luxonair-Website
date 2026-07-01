export type FlightOffer = {
  id: string;
  cabinClass: string;
  /** IATA code, e.g. "LHR" — resolve to city/country/flag via findAirport() */
  fromCode: string;
  toCode: string;
  airlineName: string;
  airlineLogo: string;
  /** Indicative per-person price in GBP */
  price: number;
  image: string;
  featured: boolean;
  sortOrder: number;
};
