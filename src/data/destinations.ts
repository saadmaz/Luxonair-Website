import { unsplashImg as img } from "@/lib/unsplash";
import type { Destination } from "@/types/destination";

// ─── Reference constants ──────────────────────────────────────────────────────
// Used for nav mega-panel grouping, QuoteForm dropdowns, and destination filtering.

export const regions = ["Europe", "Caribbean", "Indian Ocean", "Asia", "Americas", "Middle East"] as const;
export const tripTypes = ["Family", "Business", "Honeymoon", "Luxury", "City Break"] as const;
export const budgetBands = ["££", "£££", "££££"] as const;

// ─── Data ─────────────────────────────────────────────────────────────────────

export const destinations: Destination[] = [
  {
    slug: "maldives-private-villa",
    name: "Maldives - Private Water Villa",
    country: "Maldives",
    region: "Indian Ocean",
    tripType: ["Honeymoon", "Luxury", "Family"],
    budgetBand: "££££",
    fromPrice: 3850,
    durationNights: 7,
    heroImage: img("1514282401047-d79a71a590e8"),
    gallery: [img("1540202404-a2f29016b523"), img("1573843981267-be1999ff37cd"), img("1551918120-9739cb430c6d")],
    tagline: "Overwater villas, house reefs, business-class flights from London.",
    summary:
      "Curated five-star resorts across North & South Malé atolls, with seaplane transfers and indicative business-class flights from LHR. Itineraries shaped around honeymooners and families travelling with school-age children.",
    itinerary: [
      { day: "Day 1", title: "Arrive Malé", detail: "Business-class flight LHR → MLE, seaplane transfer to resort." },
      { day: "Day 2–6", title: "Villa days", detail: "Reef snorkelling, sunset dolphin cruise, optional sandbank picnic." },
      { day: "Day 7", title: "Return", detail: "Late checkout, evening seaplane, overnight return to London." },
    ],
    highlights: ["Overwater villa with private pool", "Half-board dining included", "Seaplane transfer", "ATOL-protected"],
  },
  {
    slug: "dubai-corporate-stopover",
    name: "Dubai - Corporate Stopover",
    country: "United Arab Emirates",
    region: "Middle East",
    tripType: ["Business", "City Break", "Luxury"],
    budgetBand: "£££",
    fromPrice: 1450,
    durationNights: 4,
    heroImage: img("1512453979798-5ea266f8880c"),
    gallery: [img("1518684079-3c830dcef090"), img("1546412414-e1885259563a"), img("1582672060674-bc2bd808a8f5")],
    tagline: "Experience the unparalleled opulence, comfort and the exclusivity throughout the your Journey",
    summary:
      "Configured for UK corporate travellers: flexible dates, business-class returns, hotels within 10 minutes of DIFC and Downtown. Account-managed with single-point invoicing.",
    itinerary: [
      { day: "Day 1", title: "Arrive DXB", detail: "Premium chauffeur transfer, hotel check-in, evening at JBR." },
      { day: "Day 2–3", title: "Meetings", detail: "Daily transfers, lounge access, restaurant bookings on request." },
      { day: "Day 4", title: "Return", detail: "Late checkout, business-class evening flight to LHR." },
    ],
    highlights: ["Business-class returns", "DIFC-adjacent hotel", "Chauffeur transfers", "Single-invoice billing"],
  },
  {
    slug: "antigua-family-all-inclusive",
    name: "Antigua - Family All-Inclusive",
    country: "Antigua & Barbuda",
    region: "Caribbean",
    tripType: ["Family", "Luxury"],
    budgetBand: "£££",
    fromPrice: 2150,
    durationNights: 10,
    heroImage: img("1507525428034-b723cf961d3e"),
    gallery: [img("1519046904884-53103b34b206"), img("1505228395891-9a51e7e86bf6"), img("1540541338287-41700207dee6")],
    tagline: "School-holiday departures, kids clubs, all-inclusive premium board.",
    summary:
      "Hand-picked family-friendly resorts on Antigua's south and west coasts. Direct flights from Gatwick, transfers in 30 minutes, kids clubs ages 4–12 included.",
    itinerary: [
      { day: "Day 1", title: "Fly LGW → ANU", detail: "Direct daytime flight, private transfer to resort." },
      { day: "Day 2–9", title: "Resort", detail: "Beach, watersports, optional Stingray City excursion." },
      { day: "Day 10", title: "Return", detail: "Evening flight home, arrive UK next morning." },
    ],
    highlights: ["Direct LGW flights", "Kids club included", "Premium all-inclusive", "Family suites"],
  },
  {
    slug: "japan-tailor-made",
    name: "Japan - Tailor-Made Tour",
    country: "Japan",
    region: "Asia",
    tripType: ["Luxury", "City Break", "Honeymoon"],
    budgetBand: "££££",
    fromPrice: 4200,
    durationNights: 12,
    heroImage: img("1492571350019-22de08371fd3"),
    gallery: [img("1528360983277-13d401cdc186"), img("1545569341-9eb8b30979d9"), img("1493976040374-85c8e12f0c0e")],
    tagline: "Tokyo, Kyoto, Hakone - JR Pass, ryokan stays, English-speaking guides.",
    summary:
      "A 12-night itinerary blending neon Tokyo, temple Kyoto and a ryokan night near Mount Fuji. Bullet-train transfers and curated local guides.",
    itinerary: [
      { day: "Day 1–4", title: "Tokyo", detail: "Shibuya, teamLab, day trip to Nikko." },
      { day: "Day 5–6", title: "Hakone", detail: "Ryokan, onsen, Fuji views." },
      { day: "Day 7–11", title: "Kyoto & Osaka", detail: "Temples, Arashiyama, food walk." },
      { day: "Day 12", title: "Return", detail: "Bullet train to Tokyo, evening flight to LHR." },
    ],
    highlights: ["JR Pass included", "Ryokan night", "Private guides", "Premium economy or business"],
  },
  {
    slug: "santorini-couples",
    name: "Santorini - Caldera Couples",
    country: "Greece",
    region: "Europe",
    tripType: ["Honeymoon", "Luxury", "City Break"],
    budgetBand: "£££",
    fromPrice: 1850,
    durationNights: 7,
    heroImage: img("1570077188670-e3a8d69ac5ff"),
    gallery: [img("1505881502353-a1986add3762"), img("1533105079780-92b9be482077"), img("1469854523086-cc02fe5d8800")],
    tagline: "Caldera-view suites in Oia and Imerovigli, private sunset cruise.",
    summary:
      "Adult-focused boutique hotels in Oia and Imerovigli with caldera views. Direct UK flights, sunset catamaran included.",
    itinerary: [
      { day: "Day 1", title: "Arrive JTR", detail: "Private transfer, evening in Oia." },
      { day: "Day 2–6", title: "Caldera days", detail: "Wine tour, catamaran cruise, beach day at Perissa." },
      { day: "Day 7", title: "Return", detail: "Direct flight to UK." },
    ],
    highlights: ["Caldera-view suite", "Private sunset cruise", "Direct UK flights", "Adult-focused"],
  },
  {
    slug: "new-york-business",
    name: "New York - Business City Break",
    country: "United States",
    region: "Americas",
    tripType: ["Business", "City Break"],
    budgetBand: "£££",
    fromPrice: 1650,
    durationNights: 4,
    heroImage: img("1496442226666-8d4d0e62e6e9"),
    gallery: [img("1485871981521-5b1fd3805eee"), img("1522083165195-3424ed129620"), img("1518391846015-55a9cc003b25")],
    tagline: "Midtown hotels, premium-cabin flights, fast UK return.",
    summary:
      "Business-friendly Midtown and FiDi properties, lounge access, premium-cabin flights from LHR. Optimised for short trips with evening UK returns.",
    itinerary: [
      { day: "Day 1", title: "Arrive JFK", detail: "Premium transfer, Midtown hotel." },
      { day: "Day 2–3", title: "Meetings", detail: "Walking distance to Midtown offices." },
      { day: "Day 4", title: "Return", detail: "Evening flight, arrive LHR next morning." },
    ],
    highlights: ["Lounge access", "Midtown hotel", "Business-class option", "Single-invoice billing"],
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function findDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
