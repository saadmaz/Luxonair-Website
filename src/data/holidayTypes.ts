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
    slug: "city-break",
    name: "City Break",
    tagline: "Discover city breaks whether it's cultural, culinary or a classic city escape.",
    summary:
      "European and short-haul city breaks built around late-Friday departures and Sunday-night returns. Boutique hotels in walkable districts.",
    heroImage: img("1496442226666-8d4d0e62e6e9"),
    bullets: ["Late-Friday departures", "Boutique hotels", "Walkable districts", "Add-on theatre / dining"],
    destinationSlugs: ["santorini-couples", "new-york-business"],
  },
  {
    slug: "all-inclusive",
    name: "All Inclusive",
    tagline: "Unmatched all-inclusive experiences, whether you're a beach lover, adventure seeker, or culture fanatic.",
    summary:
      "Premium all-inclusive resorts in the Caribbean, Indian Ocean and Mediterranean. Drinks, dining, and watersports included — tipping covered.",
    heroImage: img("1505228395891-9a51e7e86bf6"),
    bullets: ["Premium all-inclusive board", "Watersports included", "Tipping covered", "Family or adult-only"],
    destinationSlugs: ["antigua-family-all-inclusive", "maldives-private-villa"],
  },
  {
    slug: "theme-parks",
    name: "Theme Parks",
    tagline: "Thrilling adventures for the whole family at the world's greatest theme parks.",
    summary:
      "Packages to Disney World, Universal Studios, Europa-Park and beyond — combining park tickets, on-site hotels, and return flights from UK airports. We handle every queue-skip pass and fast-track so you spend more time on rides.",
    heroImage: img("1534430480872-bb94b2f2c4a5"),
    bullets: ["Park tickets included", "On-site hotel stays", "Fast-track & queue-skip passes", "Direct UK flights"],
    destinationSlugs: ["new-york-business"],
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
    slug: "multi-city",
    name: "Multi-City",
    tagline: "Explore multiple destinations in one seamless trip, crafted around your pace.",
    summary:
      "Twin- and triple-centre itineraries combining the best cities, islands, or landscapes in one joined-up journey. We book every leg, transfer, and hotel so nothing is left to chance.",
    heroImage: img("1467269204805-4e45d668e8e8"),
    bullets: ["Multi-stop flights in one ticket", "Joined-up transfers", "Mix of cities & resorts", "Single consultant throughout"],
    destinationSlugs: ["japan-tailor-made", "dubai-corporate-stopover", "new-york-business"],
  },
  {
    slug: "trending",
    name: "Trending",
    tagline: "The hottest destinations right now — handpicked by our travel consultants.",
    summary:
      "Destinations that are having a moment — whether it's a newly opened resort, a must-see cultural event, or a bucket-list spot suddenly accessible from the UK. Updated every season.",
    heroImage: img("1488085061851-e69f52fa8210"),
    bullets: ["Seasonally updated picks", "Newly opened resorts", "Insider consultant access", "Limited availability secured early"],
    destinationSlugs: ["santorini-couples", "maldives-private-villa", "japan-tailor-made"],
  },
  {
    slug: "summer-holidays",
    name: "Summer Holidays",
    tagline: "Make the most of summer with sun, sea, and unforgettable family memories.",
    summary:
      "Sun-drenched summer packages timed around UK school holidays. Mediterranean, Caribbean, and Indian Ocean escapes with guaranteed sun, family rooms, and flexible board options.",
    heroImage: img("1507003211169-0a1dd7228f2d"),
    bullets: ["School summer holiday dates", "Mediterranean & Caribbean", "Flexible board options", "Family rooms guaranteed"],
    destinationSlugs: ["antigua-family-all-inclusive", "santorini-couples", "maldives-private-villa"],
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function findHolidayType(slug: string): HolidayType | undefined {
  return holidayTypes.find((h) => h.slug === slug);
}
