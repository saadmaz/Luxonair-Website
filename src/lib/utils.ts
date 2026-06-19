import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges Tailwind class names, resolving conflicts (e.g. "p-2 p-4" → "p-4").
// clsx handles conditional and array inputs; twMerge resolves Tailwind specificity.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
