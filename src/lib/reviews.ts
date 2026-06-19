// Customer reviews shown on /reviews and as a 3-card preview on the home page.
// rating is constrained to 4 | 5 — we only publish reviews above a quality threshold.

export type Review = {
  id: string;
  author: string;
  /** Short trip descriptor shown beneath the author name */
  trip: string;
  rating: 4 | 5;
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  body: string;
};

export const reviews: Review[] = [
  { id: "r1", author: "Sarah & James M.", trip: "Maldives honeymoon, 14 nights", rating: 5, date: "2026-04-22", body: "Quoted Monday morning, on a plane Friday afternoon. The consultant rebooked us in-flight when our connection slipped — we didn't even notice until we were in the lounge in Doha." },
  { id: "r2", author: "Ops lead, UK SaaS", trip: "Quarterly Dubai trips", rating: 5, date: "2026-03-10", body: "Our finance team gets one invoice a month. Travellers get a human at 3am. That's the bit other agencies miss." },
  { id: "r3", author: "The Patel Family", trip: "Antigua, 10 nights all-inclusive", rating: 5, date: "2026-02-18", body: "Three kids, two flights, one consultant. They sent a packing list, a half-term-specific weather briefing, and a WhatsApp number that actually got answered." },
  { id: "r4", author: "Diane K.", trip: "Japan, 12 nights tailor-made", rating: 5, date: "2026-01-30", body: "The ryokan night near Hakone was the highlight of a 25-year travelling life. Every transfer was on time. Every guide spoke English well." },
  { id: "r5", author: "Marcus T.", trip: "New York, 4 nights", rating: 4, date: "2026-01-12", body: "Hotel was excellent and Midtown-central. Lounge access on the return leg was a small thing that made a big difference. Would book again." },
  { id: "r6", author: "Emily R.", trip: "Santorini, 7 nights", rating: 5, date: "2025-10-05", body: "Caldera-view suite, sunset cruise, and a very kind handover when our flight home shifted by a day. They handled the airline; we handled the bonus night." },
];

// Derived aggregate — recomputed whenever reviews array changes.
// Used on the About page stats strip and in structured data.
export const aggregate = {
  average: +(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1),
  count: reviews.length,
};
