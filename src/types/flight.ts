export type Airline = {
  name: string;
  /** Premium cabin products this carrier offers — rendered as a bullet list */
  cabins: string[];
  /** Primary hub or connection point from the UK */
  hub: string;
};

export type FlightRoute = {
  from: string;
  to: string;
  cabin: string;
  /** Indicative per-person return fare in GBP. Confirmed live at quote stage. */
  from_price: number;
};
