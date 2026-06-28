/**
 * One-time seed script — copies static data files into the MySQL database.
 * Safe to re-run: each table is skipped if it already contains rows.
 *
 * Usage:
 *   npx tsx db/seed.ts
 */
import { count } from "drizzle-orm";
import {
  db,
  blogPosts,
  destinations,
  deals,
  testimonials,
  faqGroups,
  faqItems,
  holidayTypes,
} from "./index";

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
const imgSm = (id: string) => img(id, 1200);

async function isEmpty(table: Parameters<typeof db.select>[0] extends never ? never : any) {
  const [{ n }] = await db.select({ n: count() }).from(table);
  return Number(n) === 0;
}

// ─── Blog posts ───────────────────────────────────────────────────────────────

async function seedBlog() {
  if (!(await isEmpty(blogPosts))) { console.log("blog_posts: already seeded, skipping."); return; }
  await db.insert(blogPosts).values([
    {
      slug: "best-time-to-visit-maldives",
      title: "When to fly to the Maldives from the UK",
      excerpt: "December to April is dry season, but rates and crowds peak. Here's how UK travellers should weigh weather, price and school holidays.",
      category: "Guides",
      author: "Luxeonair Editorial",
      date: "2026-05-12",
      readMinutes: 6,
      heroImage: img("1514282401047-d79a71a590e8"),
      content: [
        { body: "The Maldives has two distinct seasons. Dry season (Iruvai) runs roughly December through April with low humidity and reliable sun. Wet season (Hulhangu) runs May through November with shorter showers and lower rates." },
        { heading: "Half-term sweet spots", body: "October half-term lands in shoulder season - expect short afternoon showers but materially lower flight and resort pricing. February half-term is peak: book 9–12 months ahead." },
        { heading: "Flight timing from London", body: "Most Maldives-bound flights leave LHR or LGW between 19:00–22:00, arriving Malé mid-morning. Plan a daylight seaplane transfer where possible." },
      ],
    },
    {
      slug: "corporate-travel-policy-essentials",
      title: "What a sane corporate travel policy looks like in 2026",
      excerpt: "Single-invoice billing, premium-cabin thresholds, and duty-of-care basics. A short field guide for UK ops leads.",
      category: "Corporate",
      author: "Luxeonair Corporate",
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
      excerpt: "Direct flights, beach time, the Stingray City excursion that actually works for under-10s, and what to skip.",
      category: "Family",
      author: "Luxeonair Editorial",
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
      title: "ATOL and IATA: what UK travellers actually need to know",
      excerpt: "Two key accreditations, two different assurances. A plain-English guide before you pay a deposit.",
      category: "Guides",
      author: "Luxeonair Editorial",
      date: "2026-02-08",
      readMinutes: 4,
      heroImage: img("1488085061387-422e29b40080"),
      content: [
        { body: "ATOL covers package holidays that include a flight, protecting you if the company collapses before or during your trip. IATA is an airline-industry accreditation that signals professional standards, not a consumer protection scheme." },
        { heading: "What to check before paying", body: "Ask for the ATOL number, confirm it on the CAA register, and require a written ATOL Certificate within 24 hours of paying any deposit." },
      ],
    },
  ]);
  console.log("blog_posts: seeded 4 rows.");
}

// ─── Destinations ─────────────────────────────────────────────────────────────

async function seedDestinations() {
  if (!(await isEmpty(destinations))) { console.log("destinations: already seeded, skipping."); return; }
  await db.insert(destinations).values([
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
      summary: "Curated five-star resorts across North & South Malé atolls, with seaplane transfers and indicative business-class flights from LHR. Itineraries shaped around honeymooners and families travelling with school-age children.",
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
      summary: "Configured for UK corporate travellers: flexible dates, business-class returns, hotels within 10 minutes of DIFC and Downtown. Account-managed with single-point invoicing.",
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
      summary: "Hand-picked family-friendly resorts on Antigua's south and west coasts. Direct flights from Gatwick, transfers in 30 minutes, kids clubs ages 4–12 included.",
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
      summary: "A 12-night itinerary blending neon Tokyo, temple Kyoto and a ryokan night near Mount Fuji. Bullet-train transfers and curated local guides.",
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
      summary: "Adult-focused boutique hotels in Oia and Imerovigli with caldera views. Direct UK flights, sunset catamaran included.",
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
      summary: "Business-friendly Midtown and FiDi properties, lounge access, premium-cabin flights from LHR. Optimised for short trips with evening UK returns.",
      itinerary: [
        { day: "Day 1", title: "Arrive JFK", detail: "Premium transfer, Midtown hotel." },
        { day: "Day 2–3", title: "Meetings", detail: "Walking distance to Midtown offices." },
        { day: "Day 4", title: "Return", detail: "Evening flight, arrive LHR next morning." },
      ],
      highlights: ["Lounge access", "Midtown hotel", "Business-class option", "Single-invoice billing"],
    },
  ]);
  console.log("destinations: seeded 6 rows.");
}

// ─── Deals ────────────────────────────────────────────────────────────────────

async function seedDeals() {
  if (!(await isEmpty(deals))) { console.log("deals: already seeded, skipping."); return; }
  await db.insert(deals).values([
    {
      id: "maldives-7nt-bb",
      title: "Maldives - 7 nights, water villa",
      destinationSlug: "maldives-private-villa",
      region: "Indian Ocean",
      nights: 7,
      board: "Half board",
      fromPrice: 3650,
      oldPrice: 3950,
      badge: "Honeymoon",
      expires: "2026-09-30",
      image: imgSm("1514282401047-d79a71a590e8"),
      blurb: "Overwater villa with private pool. Seaplane transfer and business-class flight LHR included.",
    },
    {
      id: "antigua-10nt-ai",
      title: "Antigua - 10 nights all-inclusive",
      destinationSlug: "antigua-family-all-inclusive",
      region: "Caribbean",
      nights: 10,
      board: "Premium AI",
      fromPrice: 1995,
      oldPrice: 2150,
      badge: "Family",
      expires: "2026-08-15",
      image: imgSm("1507525428034-b723cf961d3e"),
      blurb: "Direct LGW flights, kids club, family suites. October half-term departures.",
    },
    {
      id: "dubai-4nt-corp",
      title: "Dubai - 4 nights, business stopover",
      destinationSlug: "dubai-corporate-stopover",
      region: "Middle East",
      nights: 4,
      board: "B&B",
      fromPrice: 1395,
      oldPrice: null,
      badge: "Corporate",
      expires: "2026-12-01",
      image: imgSm("1512453979798-5ea266f8880c"),
      blurb: "DIFC-adjacent five-star, business-class returns, single-invoice billing.",
    },
    {
      id: "santorini-7nt",
      title: "Santorini - 7 nights, caldera view",
      destinationSlug: "santorini-couples",
      region: "Europe",
      nights: 7,
      board: "B&B",
      fromPrice: 1750,
      oldPrice: 1950,
      badge: "Couples",
      expires: "2026-07-31",
      image: imgSm("1570077188670-e3a8d69ac5ff"),
      blurb: "Caldera-view suite in Imerovigli, sunset catamaran cruise included.",
    },
    {
      id: "japan-12nt",
      title: "Japan - 12 nights tailor-made",
      destinationSlug: "japan-tailor-made",
      region: "Asia",
      nights: 12,
      board: "Mixed",
      fromPrice: 3995,
      oldPrice: null,
      badge: "Tailor-made",
      expires: "2026-10-31",
      image: imgSm("1492571350019-22de08371fd3"),
      blurb: "Tokyo + Hakone + Kyoto with JR Pass, ryokan night, and English-speaking guides.",
    },
    {
      id: "nyc-4nt",
      title: "New York - 4 nights Midtown",
      destinationSlug: "new-york-business",
      region: "Americas",
      nights: 4,
      board: "Room only",
      fromPrice: 1495,
      oldPrice: null,
      badge: "City break",
      expires: "2026-09-15",
      image: imgSm("1496442226666-8d4d0e62e6e9"),
      blurb: "Midtown four-star, premium-cabin flights, lounge access on the return leg.",
    },
  ]);
  console.log("deals: seeded 6 rows.");
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

async function seedTestimonials() {
  if (!(await isEmpty(testimonials))) { console.log("testimonials: already seeded, skipping."); return; }
  await db.insert(testimonials).values([
    { author: "Sarah & James M.", trip: "Maldives honeymoon, 14 nights", rating: 5, date: "2026-04-22", body: "Quoted Monday morning, on a plane Friday afternoon. The consultant rebooked us in-flight when our connection slipped - we didn't even notice until we were in the lounge in Doha." },
    { author: "Ops lead, UK SaaS", trip: "Quarterly Dubai trips", rating: 5, date: "2026-03-10", body: "Our finance team gets one invoice a month. Travellers get a human at 3am. That's the bit other agencies miss." },
    { author: "The Patel Family", trip: "Antigua, 10 nights all-inclusive", rating: 5, date: "2026-02-18", body: "Three kids, two flights, one consultant. They sent a packing list, a half-term-specific weather briefing, and a WhatsApp number that actually got answered." },
    { author: "Diane K.", trip: "Japan, 12 nights tailor-made", rating: 5, date: "2026-01-30", body: "The ryokan night near Hakone was the highlight of a 25-year travelling life. Every transfer was on time. Every guide spoke English well." },
    { author: "Marcus T.", trip: "New York, 4 nights", rating: 4, date: "2026-01-12", body: "Hotel was excellent and Midtown-central. Lounge access on the return leg was a small thing that made a big difference. Would book again." },
    { author: "Emily R.", trip: "Santorini, 7 nights", rating: 5, date: "2025-10-05", body: "Caldera-view suite, sunset cruise, and a very kind handover when our flight home shifted by a day. They handled the airline; we handled the bonus night." },
  ]);
  console.log("testimonials: seeded 6 rows.");
}

// ─── FAQ groups + items ───────────────────────────────────────────────────────

async function seedFaqs() {
  if (!(await isEmpty(faqGroups))) { console.log("faq_groups: already seeded, skipping."); return; }
  const groups = [
    {
      title: "Booking & quotes",
      sortOrder: 0,
      items: [
        { question: "How quickly will I hear back after submitting a quote?", answer: "A consultant replies within 4 working hours. We're available Mon–Fri 09:00–18:00 GMT and Sat–Sun 09:00–16:00 GMT. Outside these hours, first thing the next working morning.", sortOrder: 0 },
        { question: "Do I pay anything to get a quote?", answer: "No. Quotes are free and non-binding. You only pay a deposit if you choose to book.", sortOrder: 1 },
        { question: "Can I change my dates after booking?", answer: "Most components allow date changes for a fee. Your consultant will confirm change rules in writing before deposit.", sortOrder: 2 },
      ],
    },
    {
      title: "Payments & protection",
      sortOrder: 1,
      items: [
        { question: "Is my booking ATOL protected?", answer: "Yes - every booking that includes a flight is ATOL protected. You receive an ATOL Certificate within 24 hours of paying a deposit.", sortOrder: 0 },
        { question: "What payment methods do you accept?", answer: "UK debit and credit cards and bank transfer. We do not charge card fees.", sortOrder: 1 },
      ],
    },
    {
      title: "During your trip",
      sortOrder: 2,
      items: [
        { question: "Is there a 24/7 number while I'm travelling?", answer: "Yes. You receive a direct number to your consultant plus an out-of-hours emergency line answered by a UK-based human.", sortOrder: 0 },
        { question: "What happens if my flight is cancelled?", answer: "We rebook on the next viable option and handle the refund or rebooking with the airline. You don't queue at an airport desk.", sortOrder: 1 },
      ],
    },
    {
      title: "Corporate accounts",
      sortOrder: 3,
      items: [
        { question: "Can you integrate with our travel policy?", answer: "Yes - we configure cabin thresholds, hotel bands and approver workflows per account.", sortOrder: 0 },
      ],
    },
  ];

  for (const { items, ...group } of groups) {
    const [inserted] = await db.insert(faqGroups).values(group).$returningId();
    const groupId = inserted.id;
    await db.insert(faqItems).values(items.map((item) => ({ ...item, faqGroupId: groupId })));
  }
  console.log("faq_groups + faq_items: seeded 4 groups, 8 items.");
}

// ─── Holiday types ────────────────────────────────────────────────────────────

async function seedHolidayTypes() {
  if (!(await isEmpty(holidayTypes))) { console.log("holiday_types: already seeded, skipping."); return; }
  await db.insert(holidayTypes).values([
    {
      slug: "beach",
      name: "Beach",
      tagline: "Escape the grey weather with your loved ones to a serene sun-soaked beach holiday!",
      summary: "Curated beachfront resorts with direct UK flights or premium-cabin connections. Reef-fronted villas, family-friendly all-inclusives, and adult-only retreats.",
      heroImage: img("1507525428034-b723cf961d3e"),
      bullets: ["Direct & premium-cabin flights", "Beachfront accommodation", "Half-board to all-inclusive", "ATOL-protected"],
      destinationSlugs: ["maldives-private-villa", "antigua-family-all-inclusive", "santorini-couples"],
    },
    {
      slug: "honeymoon",
      name: "Honeymoon",
      tagline: "Celebrate the new chapter in life by creating a memorable trip with us.",
      summary: "Multi-stop honeymoons combining safari + beach, city + island, or twin-island Caribbean. Private transfers and surprise touches included.",
      heroImage: img("1540202404-a2f29016b523"),
      bullets: ["Twin-centre itineraries", "Private transfers", "Honeymoon turn-down extras", "Single point of contact"],
      destinationSlugs: ["maldives-private-villa", "santorini-couples", "japan-tailor-made"],
    },
    {
      slug: "family",
      name: "Family",
      tagline: "Family holidays offer you an excellent chance to make treasured memories.",
      summary: "Family-friendly resorts on direct UK routes. Kids clubs, family suites, and itinerary timing that lands you home before Monday.",
      heroImage: img("1519046904884-53103b34b206"),
      bullets: ["School-holiday departures", "Kids clubs ages 4–12", "Family suites", "Direct flights from LGW/LHR/MAN"],
      destinationSlugs: ["antigua-family-all-inclusive", "maldives-private-villa"],
    },
    {
      slug: "luxury",
      name: "Luxury",
      tagline: "Experience the unparalleled opulence, comfort and the exclusivity throughout the your Journey",
      summary: "First and business-class flights, hand-picked five-star resorts, and access to suite upgrades, restaurant bookings and private guides.",
      heroImage: img("1551918120-9739cb430c6d"),
      bullets: ["First / business class", "Five-star properties", "Suite upgrades on request", "Concierge add-ons"],
      destinationSlugs: ["maldives-private-villa", "japan-tailor-made", "dubai-corporate-stopover"],
    },
    {
      slug: "city-breaks",
      name: "City Breaks",
      tagline: "Discover city breaks whether it's cultural, culinary or a classic city escape.",
      summary: "European and short-haul city breaks built around late-Friday departures and Sunday-night returns. Boutique hotels in walkable districts.",
      heroImage: img("1496442226666-8d4d0e62e6e9"),
      bullets: ["Late-Friday departures", "Boutique hotels", "Walkable districts", "Add-on theatre / dining"],
      destinationSlugs: ["santorini-couples", "new-york-business"],
    },
    {
      slug: "all-inclusive",
      name: "All-Inclusive",
      tagline: "Unmatched all-inclusive experiences, whether you're a beach lover, adventure seeker, or culture fanatic.",
      summary: "Premium all-inclusive resorts in the Caribbean, Indian Ocean and Mediterranean. Drinks, dining, and watersports included - tipping covered.",
      heroImage: img("1505228395891-9a51e7e86bf6"),
      bullets: ["Premium all-inclusive board", "Watersports included", "Tipping covered", "Family or adult-only"],
      destinationSlugs: ["antigua-family-all-inclusive", "maldives-private-villa"],
    },
  ]);
  console.log("holiday_types: seeded 6 rows.");
}

// ─── Run ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Starting seed...");
  await seedBlog();
  await seedDestinations();
  await seedDeals();
  await seedTestimonials();
  await seedFaqs();
  await seedHolidayTypes();
  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
