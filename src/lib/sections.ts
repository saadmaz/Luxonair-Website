export const SECTION_KEYS = [
  "enquiry-packages",
  "enquiry-flights",
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
  "enquiry-packages": "Package Enquiries",
  "enquiry-flights": "Flight Enquiries",
  "flight-bookings": "Flight Bookings",
  messages: "Messages",
  subscribers: "Subscribers",
  "destination-highlights": "Destination Highlights",
  destinations: "Destination Pages",
  deals: "Offers",
  "flight-offers": "Flight Offers",
  holidays: "Holiday Types",
  blog: "Blog",
  testimonials: "Testimonials",
  faqs: "FAQs",
};
