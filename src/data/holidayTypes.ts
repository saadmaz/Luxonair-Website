import { unsplashImg as img } from "@/lib/unsplash";
import type { HolidayType } from "@/types/holiday-type";

export const holidayTypes: HolidayType[] = [
  {
    slug: "beach",
    name: "Beach",
    tagline: "Escape the grey weather with your loved ones to a serene sun-soaked beach holiday!",
    summary:
      "Curated beachfront resorts with direct UK flights or premium-cabin connections. Reef-fronted villas, family-friendly all-inclusives, and adult-only retreats.",
    heroImage: img("1507525428034-b723cf961d3e"),
    bullets: ["Direct & premium-cabin flights", "Beachfront accommodation", "Half-board to all-inclusive", "ATOL-protected"],
    destinationSlugs: ["maldives-private-villa", "antigua-family-all-inclusive", "santorini-couples"],
  },
  {
    slug: "honeymoon",
    name: "Honeymoon",
    tagline: "Celebrate the new chapter in life by creating a memorable trip with us.",
    summary:
      "Multi-stop honeymoons combining safari + beach, city + island, or twin-island Caribbean. Private transfers and surprise touches included.",
    heroImage: img("1540202404-a2f29016b523"),
    bullets: ["Twin-centre itineraries", "Private transfers", "Honeymoon turn-down extras", "Single point of contact"],
    destinationSlugs: ["maldives-private-villa", "santorini-couples", "japan-tailor-made"],
  },
  {
    slug: "family",
    name: "Family",
    tagline: "Family holidays offer you an excellent chance to make treasured memories.",
    summary:
      "Family-friendly resorts on direct UK routes. Kids clubs, family suites, and itinerary timing that lands you home before Monday.",
    heroImage: img("1519046904884-53103b34b206"),
    bullets: ["School-holiday departures", "Kids clubs ages 4–12", "Family suites", "Direct flights from LGW/LHR/MAN"],
    destinationSlugs: ["antigua-family-all-inclusive", "maldives-private-villa"],
  },
  {
    slug: "luxury",
    name: "Luxury",
    tagline: "Premium-cabin flights, five-star resorts, off-script extras.",
    summary:
      "First and business-class flights, hand-picked five-star resorts, and access to suite upgrades, restaurant bookings and private guides.",
    heroImage: img("1551918120-9739cb430c6d"),
    bullets: ["First / business class", "Five-star properties", "Suite upgrades on request", "Concierge add-ons"],
    destinationSlugs: ["maldives-private-villa", "japan-tailor-made", "dubai-corporate-stopover"],
  },
  {
    slug: "city-breaks",
    name: "City Breaks",
    tagline: "Discover city breaks whether it's cultural, culinary or a classic city escape.",
    summary:
      "European and short-haul city breaks built around late-Friday departures and Sunday-night returns. Boutique hotels in walkable districts.",
    heroImage: img("1496442226666-8d4d0e62e6e9"),
    bullets: ["Late-Friday departures", "Boutique hotels", "Walkable districts", "Add-on theatre / dining"],
    destinationSlugs: ["santorini-couples", "new-york-business"],
  },
  {
    slug: "all-inclusive",
    name: "All-Inclusive",
    tagline: "Unmatched all-inclusive experiences — whether you're a beach lover, adventure seeker, or culture fanatic.",
    summary:
      "Premium all-inclusive resorts in the Caribbean, Indian Ocean and Mediterranean. Drinks, dining, and watersports included - tipping covered.",
    heroImage: img("1505228395891-9a51e7e86bf6"),
    bullets: ["Premium all-inclusive board", "Watersports included", "Tipping covered", "Family or adult-only"],
    destinationSlugs: ["antigua-family-all-inclusive", "maldives-private-villa"],
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function findHolidayType(slug: string): HolidayType | undefined {
  return holidayTypes.find((h) => h.slug === slug);
}
