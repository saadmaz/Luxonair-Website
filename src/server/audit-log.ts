// Maps a normalized resource-type key — the matched API route's template with
// dynamic $id/$filename segments stripped, e.g. "/api/enquiry-packages/$id/notes"
// -> "enquiry-packages/notes" — to a human noun used to build admin Logs
// sentences like "Jane added a destination: Bali Getaway".
const RESOURCE_NOUNS: Record<string, string> = {
  "enquiry-packages": "package enquiry",
  "enquiry-packages/reply": "reply to a package enquiry",
  "enquiry-packages/notes": "note on a package enquiry",
  "enquiry-flights": "flight enquiry",
  "enquiry-flights/reply": "reply to a flight enquiry",
  "enquiry-flights/notes": "note on a flight enquiry",
  contacts: "contact message",
  "contacts/notes": "note on a contact message",
  subscribers: "subscriber",
  users: "user",
  blog: "blog post",
  destinations: "destination",
  "destination-highlights": "destination highlight",
  deals: "deal",
  testimonials: "testimonial",
  holidays: "holiday type",
  faqs: "FAQ group",
  "faq-items": "FAQ item",
  "faq-groups": "FAQ group",
  "flight-offers": "flight offer",
  "flight-offer-bookings": "flight offer booking",
  upload: "image",
};

export type AdminActionVerb = "created" | "updated" | "deleted" | "other";

export function verbFromMethod(method: string): AdminActionVerb {
  if (method === "POST") return "created";
  if (method === "PATCH" || method === "PUT") return "updated";
  if (method === "DELETE") return "deleted";
  return "other";
}

// "/api/enquiry-packages/$id/notes" -> "enquiry-packages/notes"
// "/api/auth/login" -> "auth/login"
export function resourceTypeFromTemplate(tanstackPath: string): string {
  const key = tanstackPath
    .replace(/^\/api\//, "")
    .split("/")
    .filter((seg) => seg && !seg.startsWith("$"))
    .join("/");
  return key || "unknown";
}

// Best-effort human identifier for the affected record, pulled from the
// handler's JSON response body (create/update return the row; delete
// responses don't, so callers fall back to the id path param instead).
export function extractResourceLabel(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const row = (Array.isArray(body) ? body[0] : body) as Record<string, unknown> | undefined;
  if (!row) return null;
  const candidates = ["title", "name", "email", "author", "question", "city", "airlineName"];
  for (const key of candidates) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

// Builds the sentence shown in the admin Logs page, e.g.
// "Jane Doe deleted a destination: Bali Getaway".
export function describeAdminAction(row: {
  action: string;
  resourceType: string | null;
  resourceLabel: string | null;
  adminName: string;
}): string {
  if (row.resourceType === "auth/login") return `${row.adminName} logged in`;
  if (row.resourceType === "auth/logout") return `${row.adminName} logged out`;
  if (row.resourceType === "auth/logout-all") return `${row.adminName} logged out of all devices`;

  const noun =
    (row.resourceType && RESOURCE_NOUNS[row.resourceType]) ||
    row.resourceType?.replace(/[/-]/g, " ") ||
    "record";
  const verb =
    row.action === "created"
      ? "added"
      : row.action === "updated"
        ? "updated"
        : row.action === "deleted"
          ? "deleted"
          : "modified";
  const suffix = row.resourceLabel ? `: ${row.resourceLabel}` : "";
  return `${row.adminName} ${verb} a ${noun}${suffix}`;
}
