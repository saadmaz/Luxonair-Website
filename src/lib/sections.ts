export const SECTION_KEYS = [
  "enquiries",
  "flight-bookings",
  "messages",
  "subscribers",
  "destination-highlights",
  "destinations",
  "deals",
  "flight-offers",
  "holidays",
  "blog",
  "testimonials",
  "faqs",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  enquiries: "Quote Inquiries",
  "flight-bookings": "Flight Bookings",
  messages: "Messages",
  subscribers: "Subscribers",
  "destination-highlights": "Destination Highlights",
  destinations: "Destination Pages",
  deals: "Deals",
  "flight-offers": "Flight Offers",
  holidays: "Holiday Types",
  blog: "Blog",
  testimonials: "Testimonials",
  faqs: "FAQs",
};
