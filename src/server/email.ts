import { Resend } from "resend";

let _client: Resend | null = null;
function client() {
  if (!_client) _client = new Resend(process.env.RESEND_API_KEY);
  return _client;
}

const from = () => process.env.RESEND_FROM ?? "Luxeonair <noreply@luxeonair.co.uk>";
const to = () => process.env.RESEND_TO ?? process.env.ADMIN_EMAIL ?? "";

// ─── Shared row-table helper ──────────────────────────────────────────────────

// Renders only rows with a value, so package/flight enquiries never show empty cells
// for fields that don't apply to that quote type.
function rowsHtml(rows: (readonly [string, string | number | null | undefined])[]): string {
  const present = rows.filter((r): r is [string, string | number] => r[1] !== null && r[1] !== undefined && r[1] !== "");
  return present
    .map(
      ([label, value], i) =>
        `<tr${i % 2 === 0 ? ' style="background:#f9fafb"' : ""}><td style="padding:8px 12px;font-weight:600;width:38%;${i < present.length - 1 ? "border-bottom:1px solid #f3f4f6" : ""}">${esc(label)}</td><td style="padding:8px 12px;${i < present.length - 1 ? "border-bottom:1px solid #f3f4f6" : ""}">${value}</td></tr>`,
    )
    .join("");
}

function travellersLabel(adults: number, children: number, infants: number): string {
  return `${adults} adult${adults !== 1 ? "s" : ""}${children ? ` · ${children} child${children !== 1 ? "ren" : ""}` : ""}${infants ? ` · ${infants} infant${infants !== 1 ? "s" : ""}` : ""}`;
}

// ─── Package enquiry alert ─────────────────────────────────────────────────────

export interface PackageEnquiryPayload {
  name: string;
  email: string;
  phone: string;
  destination: string;
  tripType: string;
  dateMode: string;
  departWindow?: string | null;
  departDate?: string | null;
  returnDate?: string | null;
  nights: number;
  adults: number;
  children: number;
  infants: number;
  budget: string;
  hotelRating?: string | null;
  boardBasis?: string | null;
  flightsIncluded?: boolean | null;
  departAirport?: string | null;
  cabinClass?: string | null;
  notes?: string | null;
}

export async function sendPackageEnquiryAlert(d: PackageEnquiryPayload) {
  const recipient = to();
  if (!recipient) return;

  const dateInfo =
    d.dateMode === "specific"
      ? `${d.departDate ?? "?"}${d.returnDate ? ` → ${d.returnDate}` : ""}`
      : (d.departWindow ?? "Flexible");

  const rows: (readonly [string, string | number | null | undefined])[] = [
    ["Name", esc(d.name)],
    ["Email", `<a href="mailto:${esc(d.email)}" style="color:#0066cc">${esc(d.email)}</a>`],
    ["Phone", `<a href="tel:${esc(d.phone)}" style="color:#0066cc">${esc(d.phone)}</a>`],
    ["Destination", esc(d.destination)],
    ["Trip type", esc(d.tripType)],
    ["Dates", `${esc(dateInfo)} · ${d.nights} nights`],
    ["Travellers", travellersLabel(d.adults, d.children, d.infants)],
    ["Hotel rating", d.hotelRating ? esc(d.hotelRating) : null],
    ["Board basis", d.boardBasis ? esc(d.boardBasis) : null],
    ["Flights included", d.flightsIncluded ? `Yes — from ${esc(d.departAirport ?? "?")}${d.cabinClass ? `, ${esc(d.cabinClass)}` : ""}` : "No"],
    ["Budget", esc(d.budget)],
    ["Notes", d.notes ? esc(d.notes) : null],
  ];

  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#031e3e;padding:20px 24px;border-radius:8px 8px 0 0">
    <img src="https://www.luxeonair.co.uk/Logo/white-logo.png" alt="Luxeonair" height="28" style="opacity:.9"/>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px">
    <h2 style="margin:0 0 4px;font-size:18px;color:#031e3e">New holiday package enquiry</h2>
    <p style="margin:0 0 20px;color:#6b7280;font-size:13px">Received just now — rapid response needed.</p>

    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${rowsHtml(rows)}
    </table>

    <div style="margin-top:24px">
      <a href="https://www.luxeonair.co.uk/admin/enquiry-packages"
         style="display:inline-block;background:#031e3e;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600">
        View in admin →
      </a>
    </div>
  </div>
  <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;text-align:center">Luxeonair · luxeonair.co.uk</p>
</div>`;

  await client().emails.send({
    from: from(),
    to: recipient,
    subject: `New package enquiry: ${d.name} — ${d.destination}`,
    html,
  });
}

export async function sendPackageEnquiryConfirmation(d: Pick<PackageEnquiryPayload, "name" | "email" | "destination">) {
  const firstName = esc(d.name.split(" ")[0] || d.name);
  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#031e3e;padding:20px 24px;border-radius:8px 8px 0 0">
    <img src="https://www.luxeonair.co.uk/Logo/white-logo.png" alt="Luxeonair" height="28" style="opacity:.9"/>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px">
    <h2 style="margin:0 0 4px;font-size:18px;color:#031e3e">We're on it, ${firstName}!</h2>
    <p style="margin:0 0 16px">Hi ${firstName},</p>
    <p style="margin:0 0 16px;line-height:1.6">Thank you for reaching out to Luxeonair. We've received your enquiry for a <strong>${esc(d.destination)}</strong> holiday, and we're already on the case.</p>
    <p style="margin:0 0 20px;line-height:1.6">One of our dedicated travel specialists is currently sourcing the best itineraries and exclusive rates tailored to your preferences. You can expect a personalised update from them via email or phone shortly.</p>

    <p style="margin:0 0 8px;font-weight:600;color:#031e3e">What happens next?</p>
    <ul style="margin:0 0 20px;padding-left:20px;line-height:1.8">
      <li><strong>Review:</strong> your specialist curates 2–3 of the best travel options for you.</li>
      <li><strong>Connect:</strong> we reach out to you soon with those options.</li>
      <li><strong>Finalise:</strong> we tweak the itinerary until it's exactly what you want.</li>
    </ul>

    <p style="margin:0 0 16px;padding:12px 16px;background:#f9fafb;border-left:3px solid #031e3e;line-height:1.6">In the meantime, if you need to add any specific details — like preferred hotel rating, board basis, or flexible dates — simply reply directly to this email.</p>

    <p style="margin:24px 0 0">Warm regards,<br/>The Luxeonair Team</p>
  </div>
  <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;text-align:center">Luxeonair · luxeonair.co.uk</p>
</div>`;

  await client().emails.send({
    from: from(),
    to: d.email,
    subject: `We're on it, ${d.name.split(" ")[0] || d.name}! Your ${d.destination} package enquiry`,
    html,
  });
}

// ─── Flight enquiry alert ──────────────────────────────────────────────────────

export interface FlightEnquiryPayload {
  name: string;
  email: string;
  phone: string;
  departAirport: string;
  destination: string;
  tripType: string;
  dateMode: string;
  departWindow?: string | null;
  departDate?: string | null;
  returnDate?: string | null;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
  directOnly?: string | null;
  preferredAirlines?: string | null;
  budget: string;
  notes?: string | null;
}

export async function sendFlightEnquiryAlert(d: FlightEnquiryPayload) {
  const recipient = to();
  if (!recipient) return;

  const dateInfo =
    d.dateMode === "specific"
      ? `${d.departDate ?? "?"}${d.returnDate ? ` → ${d.returnDate}` : ""}`
      : (d.departWindow ?? "Flexible");

  const rows: (readonly [string, string | number | null | undefined])[] = [
    ["Name", esc(d.name)],
    ["Email", `<a href="mailto:${esc(d.email)}" style="color:#0066cc">${esc(d.email)}</a>`],
    ["Phone", `<a href="tel:${esc(d.phone)}" style="color:#0066cc">${esc(d.phone)}</a>`],
    ["Route", `${esc(d.departAirport)} → ${esc(d.destination)} (${esc(d.tripType)})`],
    ["Dates", esc(dateInfo)],
    ["Travellers", travellersLabel(d.adults, d.children, d.infants)],
    ["Cabin class", esc(d.cabinClass)],
    ["Routing preference", d.directOnly ? esc(d.directOnly) : null],
    ["Preferred airlines", d.preferredAirlines ? esc(d.preferredAirlines) : null],
    ["Budget", esc(d.budget)],
    ["Notes", d.notes ? esc(d.notes) : null],
  ];

  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#031e3e;padding:20px 24px;border-radius:8px 8px 0 0">
    <img src="https://www.luxeonair.co.uk/Logo/white-logo.png" alt="Luxeonair" height="28" style="opacity:.9"/>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px">
    <h2 style="margin:0 0 4px;font-size:18px;color:#031e3e">New flight enquiry</h2>
    <p style="margin:0 0 20px;color:#6b7280;font-size:13px">Received just now — rapid response needed.</p>

    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${rowsHtml(rows)}
    </table>

    <div style="margin-top:24px">
      <a href="https://www.luxeonair.co.uk/admin/enquiry-flights"
         style="display:inline-block;background:#031e3e;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600">
        View in admin →
      </a>
    </div>
  </div>
  <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;text-align:center">Luxeonair · luxeonair.co.uk</p>
</div>`;

  await client().emails.send({
    from: from(),
    to: recipient,
    subject: `New flight enquiry: ${d.name} — ${d.departAirport} → ${d.destination}`,
    html,
  });
}

export async function sendFlightEnquiryConfirmation(d: Pick<FlightEnquiryPayload, "name" | "email" | "destination">) {
  const firstName = esc(d.name.split(" ")[0] || d.name);
  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#031e3e;padding:20px 24px;border-radius:8px 8px 0 0">
    <img src="https://www.luxeonair.co.uk/Logo/white-logo.png" alt="Luxeonair" height="28" style="opacity:.9"/>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px">
    <h2 style="margin:0 0 4px;font-size:18px;color:#031e3e">We're on it, ${firstName}!</h2>
    <p style="margin:0 0 16px">Hi ${firstName},</p>
    <p style="margin:0 0 16px;line-height:1.6">Thank you for reaching out to Luxeonair. We've received your enquiry for flights to <strong>${esc(d.destination)}</strong>, and we're already on the case.</p>
    <p style="margin:0 0 20px;line-height:1.6">One of our dedicated travel specialists is currently sourcing the best itineraries and exclusive rates tailored to your preferences. You can expect a personalised update from them via email or phone shortly.</p>

    <p style="margin:0 0 8px;font-weight:600;color:#031e3e">What happens next?</p>
    <ul style="margin:0 0 20px;padding-left:20px;line-height:1.8">
      <li><strong>Review:</strong> your specialist curates 2–3 of the best travel options for you.</li>
      <li><strong>Connect:</strong> we reach out to you soon with those options.</li>
      <li><strong>Finalise:</strong> we tweak the itinerary until it's exactly what you want.</li>
    </ul>

    <p style="margin:0 0 16px;padding:12px 16px;background:#f9fafb;border-left:3px solid #031e3e;line-height:1.6">In the meantime, if you need to add any specific details — like preferred airlines, cabin class, or flexible dates — simply reply directly to this email.</p>

    <p style="margin:24px 0 0">Warm regards,<br/>The Luxeonair Team</p>
  </div>
  <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;text-align:center">Luxeonair · luxeonair.co.uk</p>
</div>`;

  await client().emails.send({
    from: from(),
    to: d.email,
    subject: `We're on it, ${d.name.split(" ")[0] || d.name}! Your ${d.destination} flight enquiry ✈️`,
    html,
  });
}

// ─── Enquiry reply (admin → customer) ──────────────────────────────────────────

export async function sendEnquiryReply(d: { to: string; name: string; subject: string; message: string }) {
  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#031e3e;padding:20px 24px;border-radius:8px 8px 0 0">
    <img src="https://www.luxeonair.co.uk/Logo/white-logo.png" alt="Luxeonair" height="28" style="opacity:.9"/>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px">
    <p style="margin:0 0 16px">Hi ${esc(d.name.split(" ")[0] || d.name)},</p>
    <div style="white-space:pre-wrap;line-height:1.6">${esc(d.message)}</div>
    <p style="margin:24px 0 0">Best regards,<br/>The Luxeonair team</p>
  </div>
  <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;text-align:center">Luxeonair · luxeonair.co.uk</p>
</div>`;

  await client().emails.send({
    from: from(),
    to: d.to,
    subject: d.subject,
    html,
  });
}

// ─── Flight offer booking alert ────────────────────────────────────────────────

export interface FlightOfferBookingPayload {
  name: string;
  email: string;
  phone: string;
  routeLabel: string;
  cabinClass: string;
  price: number;
  tripType: string;
  departDate?: string | null;
  returnDate?: string | null;
  adults: number;
  children: number;
  infants: number;
  budget?: string | null;
  notes?: string | null;
}

export async function sendFlightBookingAlert(d: FlightOfferBookingPayload) {
  const recipient = to();
  if (!recipient) return;

  const dates =
    d.tripType === "Return"
      ? `${d.departDate ?? "?"} → ${d.returnDate ?? "?"}`
      : `${d.departDate ?? "?"} (one way)`;

  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#031e3e;padding:20px 24px;border-radius:8px 8px 0 0">
    <img src="https://www.luxeonair.co.uk/Logo/white-logo.png" alt="Luxeonair" height="28" style="opacity:.9"/>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px">
    <h2 style="margin:0 0 4px;font-size:18px;color:#031e3e">New flight offer enquiry</h2>
    <p style="margin:0 0 20px;color:#6b7280;font-size:13px">${esc(d.routeLabel)} · ${esc(d.cabinClass)} · from £${d.price.toLocaleString()}pp</p>

    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr style="background:#f9fafb"><td style="padding:8px 12px;font-weight:600;width:38%;border-bottom:1px solid #f3f4f6">Name</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6">${esc(d.name)}</td></tr>
      <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #f3f4f6">Email</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6"><a href="mailto:${esc(d.email)}" style="color:#0066cc">${esc(d.email)}</a></td></tr>
      <tr style="background:#f9fafb"><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #f3f4f6">Phone</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6"><a href="tel:${esc(d.phone)}" style="color:#0066cc">${esc(d.phone)}</a></td></tr>
      <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #f3f4f6">Route</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6">${esc(d.routeLabel)} (${esc(d.tripType)})</td></tr>
      <tr style="background:#f9fafb"><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #f3f4f6">Dates</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6">${esc(dates)}</td></tr>
      <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #f3f4f6">Travellers</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6">${d.adults} adult${d.adults !== 1 ? "s" : ""}${d.children ? ` · ${d.children} child${d.children !== 1 ? "ren" : ""}` : ""}${d.infants ? ` · ${d.infants} infant${d.infants !== 1 ? "s" : ""}` : ""}</td></tr>
      <tr style="background:#f9fafb"><td style="padding:8px 12px;font-weight:600;${d.budget || d.notes ? "border-bottom:1px solid #f3f4f6" : ""}">Cabin</td><td style="padding:8px 12px;${d.budget || d.notes ? "border-bottom:1px solid #f3f4f6" : ""}">${esc(d.cabinClass)}</td></tr>
      ${d.budget ? `<tr><td style="padding:8px 12px;font-weight:600;${d.notes ? "border-bottom:1px solid #f3f4f6" : ""}">Approx. budget</td><td style="padding:8px 12px;${d.notes ? "border-bottom:1px solid #f3f4f6" : ""}">${esc(d.budget)}</td></tr>` : ""}
      ${d.notes ? `<tr style="background:#f9fafb"><td style="padding:8px 12px;font-weight:600">Notes</td><td style="padding:8px 12px">${esc(d.notes)}</td></tr>` : ""}
    </table>

    <div style="margin-top:24px">
      <a href="https://www.luxeonair.co.uk/admin/flight-bookings"
         style="display:inline-block;background:#031e3e;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600">
        View in admin →
      </a>
    </div>
  </div>
  <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;text-align:center">Luxeonair · luxeonair.co.uk</p>
</div>`;

  await client().emails.send({
    from: from(),
    to: recipient,
    subject: `New flight enquiry: ${d.name} — ${d.routeLabel}`,
    html,
  });
}

// ─── Flight offer booking confirmation (system → customer) ────────────────────

export async function sendFlightBookingConfirmation(d: Pick<FlightOfferBookingPayload, "name" | "email" | "routeLabel">) {
  const firstName = esc(d.name.split(" ")[0] || d.name);
  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#031e3e;padding:20px 24px;border-radius:8px 8px 0 0">
    <img src="https://www.luxeonair.co.uk/Logo/white-logo.png" alt="Luxeonair" height="28" style="opacity:.9"/>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px">
    <h2 style="margin:0 0 4px;font-size:18px;color:#031e3e">We're on it, ${firstName}!</h2>
    <p style="margin:0 0 16px">Hi ${firstName},</p>
    <p style="margin:0 0 16px;line-height:1.6">Thank you for reaching out to Luxeonair. We've received your enquiry for <strong>${esc(d.routeLabel)}</strong>, and we're already on the case.</p>
    <p style="margin:0 0 20px;line-height:1.6">One of our dedicated travel specialists is currently confirming live availability and securing the best rate for this fare. You can expect a personalised update from them via email or phone shortly.</p>

    <p style="margin:0 0 8px;font-weight:600;color:#031e3e">What happens next?</p>
    <ul style="margin:0 0 20px;padding-left:20px;line-height:1.8">
      <li><strong>Confirm:</strong> your specialist verifies live availability and pricing for this fare.</li>
      <li><strong>Connect:</strong> we reach out to you soon with the confirmed details.</li>
      <li><strong>Finalise:</strong> we lock in your booking once you're happy to proceed.</li>
    </ul>

    <p style="margin:0 0 16px;padding:12px 16px;background:#f9fafb;border-left:3px solid #031e3e;line-height:1.6">In the meantime, if you need to add any specific details — like extra passengers or flexible dates — simply reply directly to this email.</p>

    <p style="margin:24px 0 0">Warm regards,<br/>The Luxeonair Team</p>
  </div>
  <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;text-align:center">Luxeonair · luxeonair.co.uk</p>
</div>`;

  await client().emails.send({
    from: from(),
    to: d.email,
    subject: `We're on it, ${d.name.split(" ")[0] || d.name}! Your ${d.routeLabel} enquiry ✈️`,
    html,
  });
}

// ─── Contact alert ────────────────────────────────────────────────────────────

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string | null;
  topic?: string | null;
  message: string;
}

export async function sendContactAlert(d: ContactPayload) {
  const recipient = to();
  if (!recipient) return;

  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#031e3e;padding:20px 24px;border-radius:8px 8px 0 0">
    <img src="https://www.luxeonair.co.uk/Logo/white-logo.png" alt="Luxeonair" height="28" style="opacity:.9"/>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px">
    <h2 style="margin:0 0 4px;font-size:18px;color:#031e3e">New contact message</h2>
    <p style="margin:0 0 20px;color:#6b7280;font-size:13px">${d.topic ? esc(d.topic) : "General enquiry"}</p>

    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr style="background:#f9fafb"><td style="padding:8px 12px;font-weight:600;width:38%;border-bottom:1px solid #f3f4f6">Name</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6">${esc(d.name)}</td></tr>
      <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #f3f4f6">Email</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6"><a href="mailto:${esc(d.email)}" style="color:#0066cc">${esc(d.email)}</a></td></tr>
      ${d.phone ? `<tr style="background:#f9fafb"><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #f3f4f6">Phone</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6"><a href="tel:${esc(d.phone)}" style="color:#0066cc">${esc(d.phone)}</a></td></tr>` : ""}
      <tr${d.phone ? ' style="background:#f9fafb"' : ""}><td style="padding:8px 12px;font-weight:600;vertical-align:top">Message</td><td style="padding:8px 12px;white-space:pre-wrap">${esc(d.message)}</td></tr>
    </table>

    <div style="margin-top:24px">
      <a href="https://www.luxeonair.co.uk/admin/messages"
         style="display:inline-block;background:#031e3e;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600">
        View in admin →
      </a>
    </div>
  </div>
  <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;text-align:center">Luxeonair · luxeonair.co.uk</p>
</div>`;

  await client().emails.send({
    from: from(),
    to: recipient,
    subject: `New message: ${d.name}${d.topic ? ` — ${d.topic}` : ""}`,
    html,
  });
}

// ─── Contact confirmation (system → customer) ──────────────────────────────────

export async function sendContactConfirmation(d: Pick<ContactPayload, "name" | "email">) {
  const firstName = esc(d.name.split(" ")[0] || d.name);
  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#031e3e;padding:20px 24px;border-radius:8px 8px 0 0">
    <img src="https://www.luxeonair.co.uk/Logo/white-logo.png" alt="Luxeonair" height="28" style="opacity:.9"/>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px">
    <h2 style="margin:0 0 4px;font-size:18px;color:#031e3e">We're on it, ${firstName}!</h2>
    <p style="margin:0 0 16px">Hi ${firstName},</p>
    <p style="margin:0 0 16px;line-height:1.6">Thank you for reaching out to Luxeonair. We've received your message, and it's already with our team.</p>
    <p style="margin:0 0 20px;line-height:1.6">One of our team members is reviewing what you've shared and will come back to you with a personalised response via email or phone shortly.</p>

    <p style="margin:0 0 8px;font-weight:600;color:#031e3e">What happens next?</p>
    <ul style="margin:0 0 20px;padding-left:20px;line-height:1.8">
      <li><strong>Review:</strong> we read through your message and gather what's needed to help.</li>
      <li><strong>Connect:</strong> we reach out to you soon with a response.</li>
      <li><strong>Follow up:</strong> we make sure everything's resolved to your satisfaction.</li>
    </ul>

    <p style="margin:0 0 16px;padding:12px 16px;background:#f9fafb;border-left:3px solid #031e3e;line-height:1.6">In the meantime, if you need to add any specific details, simply reply directly to this email.</p>

    <p style="margin:24px 0 0">Warm regards,<br/>The Luxeonair Team</p>
  </div>
  <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;text-align:center">Luxeonair · luxeonair.co.uk</p>
</div>`;

  await client().emails.send({
    from: from(),
    to: d.email,
    subject: `We're on it, ${d.name.split(" ")[0] || d.name}! We've got your message`,
    html,
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
