import { unsplashImg as img } from "@/lib/unsplash";
import type { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    slug: "best-time-to-visit-maldives",
    title: "When to fly to the Maldives from the UK",
    excerpt:
      "December to April is dry season, but rates and crowds peak. Here's how UK travellers should weigh weather, price and school holidays.",
    category: "Guides",
    author: "Luxonair Editorial",
    date: "2026-05-12",
    readMinutes: 6,
    heroImage: img("1514282401047-d79a71a590e8"),
    content: [
      { body: "The Maldives has two distinct seasons. Dry season (Iruvai) runs roughly December through April with low humidity and reliable sun. Wet season (Hulhangu) runs May through November with shorter showers and lower rates." },
      { heading: "Half-term sweet spots", body: "October half-term lands in shoulder season — expect short afternoon showers but materially lower flight and resort pricing. February half-term is peak: book 9–12 months ahead." },
      { heading: "Flight timing from London", body: "Most Maldives-bound flights leave LHR or LGW between 19:00–22:00, arriving Malé mid-morning. Plan a daylight seaplane transfer where possible." },
    ],
  },
  {
    slug: "corporate-travel-policy-essentials",
    title: "What a sane corporate travel policy looks like in 2026",
    excerpt:
      "Single-invoice billing, premium-cabin thresholds, and duty-of-care basics. A short field guide for UK ops leads.",
    category: "Corporate",
    author: "Luxonair Corporate",
    date: "2026-04-02",
    readMinutes: 8,
    heroImage: img("1512453979798-5ea266f8880c"),
    content: [
      { body: "A travel policy should fit on one page and answer three questions: who can book what, how is it billed, and who is responsible if it goes wrong at 03:00." },
      { heading: "Premium cabin thresholds", body: "A common rule: business class is allowed on flights over 7 hours OR overnight where the traveller works the next morning. Document it; don't leave it to interpretation." },
      { heading: "Duty of care", body: "Confirm your travel partner can locate every traveller within 15 minutes during a major incident. Ask for a written escalation flow." },
    ],
  },
  {
    slug: "antigua-with-kids",
    title: "Antigua with kids: ten nights, school-holiday tested",
    excerpt:
      "Direct flights, beach time, the Stingray City excursion that actually works for under-10s, and what to skip.",
    category: "Family",
    author: "Luxonair Editorial",
    date: "2026-03-18",
    readMinutes: 5,
    heroImage: img("1519046904884-53103b34b206"),
    content: [
      { body: "Antigua is one of the easiest long-haul family destinations from the UK: direct flights from Gatwick, 30-minute transfers, and a beach-per-day rotation that genuinely entertains primary-age children." },
      { heading: "What worked", body: "Stingray City is brilliant for ages 5+. The catamaran day trip works for 8+ but is a long day for under-5s. Rent a car for one day to reach Half Moon Bay; otherwise stay on resort." },
    ],
  },
  {
    slug: "atol-explained",
    title: "ATOL, ABTA, IATA: what UK travellers actually need to know",
    excerpt:
      "Three acronyms, three different protections. A plain-English guide before you pay a deposit.",
    category: "Guides",
    author: "Luxonair Editorial",
    date: "2026-02-08",
    readMinutes: 4,
    heroImage: img("1488085061387-422e29b40080"),
    content: [
      { body: "ATOL covers package holidays that include a flight. ABTA covers the agency itself for non-flight elements. IATA is an airline-industry accreditation, not a consumer protection." },
      { heading: "What to check before paying", body: "Ask for the ATOL number, confirm it on the CAA register, and require a written ATOL Certificate within 24 hours of paying any deposit." },
    ],
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function findPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
