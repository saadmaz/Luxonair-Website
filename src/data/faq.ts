// FAQ content grouped by topic.
// Add a new group object to extend the /faq page with additional categories.
import type { FaqGroup } from "@/types/faq";

export const faqGroups: FaqGroup[] = [
  {
    title: "Booking & quotes",
    items: [
      { q: "How quickly will I hear back after submitting a quote?", a: "A consultant replies within 4 working hours. We're available Mon–Fri 09:00–18:00 GMT and Sat–Sun 09:00–16:00 GMT. Outside these hours, first thing the next working morning." },
      { q: "Do I pay anything to get a quote?", a: "No. Quotes are free and non-binding. You only pay a deposit if you choose to book." },
      { q: "Can I change my dates after booking?", a: "Most components allow date changes for a fee. Your consultant will confirm change rules in writing before deposit." },
    ],
  },
  {
    title: "Payments & protection",
    items: [
      { q: "Is my booking ATOL protected?", a: "Yes - every booking that includes a flight is ATOL protected. You receive an ATOL Certificate within 24 hours of paying a deposit." },
      { q: "What payment methods do you accept?", a: "UK debit and credit cards and bank transfer. We do not charge card fees." },
    ],
  },
  {
    title: "During your trip",
    items: [
      { q: "Is there a 24/7 number while I'm travelling?", a: "Yes. You receive a direct number to your consultant plus an out-of-hours emergency line answered by a UK-based human." },
      { q: "What happens if my flight is cancelled?", a: "We rebook on the next viable option and handle the refund or rebooking with the airline. You don't queue at an airport desk." },
    ],
  },
  {
    title: "Corporate accounts",
    items: [
      { q: "Can you integrate with our travel policy?", a: "Yes - we configure cabin thresholds, hotel bands and approver workflows per account." },
    ],
  },
];
