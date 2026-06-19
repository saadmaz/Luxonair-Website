import { unsplashImg } from "@/lib/unsplash";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  /** ISO date string — used by /deals page to sort by expiry */
  expires: string;
  image: string;
  blurb: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

// Narrower default width (1200) compared to destination hero images (1600)
// because deals are shown in cards, not full-bleed heroes.
const img = (id: string) => unsplashImg(id, 1200);

export const deals: Deal[] = [
  {
    id: "maldives-7nt-bb",
    title: "Maldives — 7 nights, water villa",
    destinationSlug: "maldives-private-villa",
    region: "Indian Ocean",
    nights: 7,
    board: "Half board",
    fromPrice: 3650,
    oldPrice: 3950,
    badge: "Honeymoon",
    expires: "2026-09-30",
    image: img("1514282401047-d79a71a590e8"),
    blurb: "Overwater villa with private pool. Seaplane transfer and business-class flight LHR included.",
  },
  {
    id: "antigua-10nt-ai",
    title: "Antigua — 10 nights all-inclusive",
    destinationSlug: "antigua-family-all-inclusive",
    region: "Caribbean",
    nights: 10,
    board: "Premium AI",
    fromPrice: 1995,
    oldPrice: 2150,
    badge: "Family",
    expires: "2026-08-15",
    image: img("1507525428034-b723cf961d3e"),
    blurb: "Direct LGW flights, kids club, family suites. October half-term departures.",
  },
  {
    id: "dubai-4nt-corp",
    title: "Dubai — 4 nights, business stopover",
    destinationSlug: "dubai-corporate-stopover",
    region: "Middle East",
    nights: 4,
    board: "B&B",
    fromPrice: 1395,
    badge: "Corporate",
    expires: "2026-12-01",
    image: img("1512453979798-5ea266f8880c"),
    blurb: "DIFC-adjacent five-star, business-class returns, single-invoice billing.",
  },
  {
    id: "santorini-7nt",
    title: "Santorini — 7 nights, caldera view",
    destinationSlug: "santorini-couples",
    region: "Europe",
    nights: 7,
    board: "B&B",
    fromPrice: 1750,
    oldPrice: 1950,
    badge: "Couples",
    expires: "2026-07-31",
    image: img("1570077188670-e3a8d69ac5ff"),
    blurb: "Caldera-view suite in Imerovigli, sunset catamaran cruise included.",
  },
  {
    id: "japan-12nt",
    title: "Japan — 12 nights tailor-made",
    destinationSlug: "japan-tailor-made",
    region: "Asia",
    nights: 12,
    board: "Mixed",
    fromPrice: 3995,
    badge: "Tailor-made",
    expires: "2026-10-31",
    image: img("1492571350019-22de08371fd3"),
    blurb: "Tokyo + Hakone + Kyoto with JR Pass, ryokan night, and English-speaking guides.",
  },
  {
    id: "nyc-4nt",
    title: "New York — 4 nights Midtown",
    destinationSlug: "new-york-business",
    region: "Americas",
    nights: 4,
    board: "Room only",
    fromPrice: 1495,
    badge: "City break",
    expires: "2026-09-15",
    image: img("1496442226666-8d4d0e62e6e9"),
    blurb: "Midtown four-star, premium-cabin flights, lounge access on the return leg.",
  },
];
