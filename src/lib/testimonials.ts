import { reviews as defaultReviews } from "@/data/reviews";
import type { Review } from "@/types/review";

const KEY = "luxonair_testimonials";

export function loadTestimonials(): Review[] {
  if (typeof window === "undefined") return defaultReviews;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Review[];
  } catch {}
  return defaultReviews;
}

export function persistTestimonials(items: Review[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

export function calcAggregate(items: Review[]) {
  if (!items.length) return { average: 0, count: 0 };
  return {
    average: +(items.reduce((s, r) => s + r.rating, 0) / items.length).toFixed(1),
    count: items.length,
  };
}
