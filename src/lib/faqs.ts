import { faqGroups as defaultGroups } from "@/data/faq";
import type { FaqGroup } from "@/types/faq";

const KEY = "luxonair_faqs";

export function loadFaqs(): FaqGroup[] {
  if (typeof window === "undefined") return defaultGroups;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as FaqGroup[];
  } catch {}
  return defaultGroups;
}

export function persistFaqs(groups: FaqGroup[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(groups));
  } catch {}
}
