// Shared status vocabulary for enquiry_packages / enquiry_flights.
// Kept in sync with ENQUIRY_STATUS_VALUES in db/schema.ts.
export const ENQUIRY_STATUSES = [
  "new",
  "contacted",
  "in_progress",
  "no_response",
  "sale_done",
  "cancelled",
] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  in_progress: "In Progress",
  no_response: "No Response",
  sale_done: "Sale Done",
  cancelled: "Cancelled",
};

// Tailwind badge classes — one distinct colour family per status.
export const ENQUIRY_STATUS_COLORS: Record<EnquiryStatus, { className: string; dot: string }> = {
  new: { className: "bg-blue-50 text-blue-700 ring-blue-200", dot: "bg-blue-400" },
  contacted: { className: "bg-cyan-50 text-cyan-700 ring-cyan-200", dot: "bg-cyan-400" },
  in_progress: { className: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-400" },
  no_response: { className: "bg-gray-100 text-gray-600 ring-gray-300", dot: "bg-gray-400" },
  sale_done: { className: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-400" },
  cancelled: { className: "bg-rose-50 text-rose-700 ring-rose-200", dot: "bg-rose-400" },
};
