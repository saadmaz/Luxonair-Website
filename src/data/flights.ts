// Airline and indicative-fare data for the /flights page.
// Kept in data/ so other pages can import it without going through the route module.
import type { Airline, FlightRoute } from "@/types/flight";

export const AIRLINES: Airline[] = [
  { name: "British Airways",    cabins: ["Business (Club World)", "First"],              hub: "LHR" },
  { name: "Virgin Atlantic",    cabins: ["Upper Class", "Premium"],                       hub: "LHR / MAN" },
  { name: "Emirates",           cabins: ["Business", "First (Private Suite)"],            hub: "via DXB" },
  { name: "Qatar Airways",      cabins: ["Qsuite Business", "First"],                     hub: "via DOH" },
  { name: "Etihad",             cabins: ["Business Studio", "The Residence"],             hub: "via AUH" },
  { name: "Singapore Airlines", cabins: ["Business", "First (Suites)"],                  hub: "via SIN" },
];

export const FLIGHT_ROUTES: FlightRoute[] = [
  { from: "London", to: "Maldives",  cabin: "Business",        from_price: 1_850 },
  { from: "London", to: "New York",  cabin: "Business",        from_price: 1_290 },
  { from: "London", to: "Tokyo",     cabin: "Business",        from_price: 2_100 },
  { from: "London", to: "Dubai",     cabin: "Business",        from_price: 890   },
  { from: "London", to: "Singapore", cabin: "Business",        from_price: 1_950 },
  { from: "London", to: "Cape Town", cabin: "Premium Economy", from_price: 820   },
];
