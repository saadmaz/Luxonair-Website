import { Resend } from "resend";

let _client: Resend | null = null;
function client() {
  if (!_client) _client = new Resend(process.env.RESEND_API_KEY);
  return _client;
}

const from = () => process.env.RESEND_FROM ?? "Luxeonair <noreply@luxeonair.co.uk>";
const to = () => process.env.RESEND_TO ?? process.env.ADMIN_EMAIL ?? "";

// ─── Enquiry alert ────────────────────────────────────────────────────────────

export interface EnquiryPayload {
  quoteType: "package" | "flight";
  name: string;
  email: string;
  phone: string;
  destination: string;
  tripType: string;
  dateMode: string;
  departWindow?: string | null;
  departDate?: string | null;
  returnDate?: string | null;
  nights?: number | null;
  adults: number;
  children: number;
  infants: number;
  cabinClass?: string | null;
  departAirport?: string | null;
  directOnly?: string | null;
  preferredAirlines?: string | null;
  budget: string;
  hotelRating?: string | null;
  boardBasis?: string | null;
  flightsIncluded?: boolean | null;
  notes?: string | null;
}

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

export async function sendEnquiryAlert(d: EnquiryPayload) {
  const recipient = to();
  if (!recipient) return;

  const dateInfo =
    d.dateMode === "specific"
      ? `${d.departDate ?? "?"}${d.returnDate ? ` → ${d.returnDate}` : ""}`
      : (d.departWindow ?? "Flexible");
  const travellers = `${d.adults} adult${d.adults !== 1 ? "s" : ""}${d.children ? ` · ${d.children} child${d.children !== 1 ? "ren" : ""}` : ""}${d.infants ? ` · ${d.infants} infant${d.infants !== 1 ? "s" : ""}` : ""}`;

  const rows: (readonly [string, string | number | null | undefined])[] =
    d.quoteType === "flight"
      ? [
          ["Name", esc(d.name)],
          ["Email", `<a href="mailto:${esc(d.email)}" style="color:#0066cc">${esc(d.email)}</a>`],
          ["Phone", `<a href="tel:${esc(d.phone)}" style="color:#0066cc">${esc(d.phone)}</a>`],
          ["Route", `${esc(d.departAirport ?? "?")} → ${esc(d.destination)} (${esc(d.tripType)})`],
          ["Dates", `${esc(dateInfo)}`],
          ["Travellers", travellers],
          ["Cabin class", d.cabinClass ? esc(d.cabinClass) : null],
          ["Routing preference", d.directOnly ? esc(d.directOnly) : null],
          ["Preferred airlines", d.preferredAirlines ? esc(d.preferredAirlines) : null],
          ["Budget", esc(d.budget)],
          ["Notes", d.notes ? esc(d.notes) : null],
        ]
      : [
          ["Name", esc(d.name)],
          ["Email", `<a href="mailto:${esc(d.email)}" style="color:#0066cc">${esc(d.email)}</a>`],
          ["Phone", `<a href="tel:${esc(d.phone)}" style="color:#0066cc">${esc(d.phone)}</a>`],
          ["Destination", esc(d.destination)],
          ["Trip type", esc(d.tripType)],
          ["Dates", `${esc(dateInfo)}${d.nights ? ` · ${d.nights} nights` : ""}`],
          ["Travellers", travellers],
          ["Hotel rating", d.hotelRating ? esc(d.hotelRating) : null],
          ["Board basis", d.boardBasis ? esc(d.boardBasis) : null],
          ["Flights included", d.flightsIncluded ? `Yes — from ${esc(d.departAirport ?? "?")}${d.cabinClass ? `, ${esc(d.cabinClass)}` : ""}` : "No"],
          ["Budget", esc(d.budget)],
          ["Notes", d.notes ? esc(d.notes) : null],
        ];

  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#031e3e;padding:20px 24px;border-radius:8px 8px 0 0">
    <img src="https://www.luxeonair.co.uk/Logo/main-logo.png" alt="Luxeonair" height="28" style="opacity:.9"/>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px">
    <h2 style="margin:0 0 4px;font-size:18px;color:#031e3e">New ${d.quoteType === "flight" ? "flight" : "holiday package"} enquiry</h2>
    <p style="margin:0 0 20px;color:#6b7280;font-size:13px">Received just now — rapid response needed.</p>

    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${rowsHtml(rows)}
    </table>

    <div style="margin-top:24px">
      <a href="https://www.luxeonair.co.uk/admin/enquiries"
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
    subject: `New ${d.quoteType} enquiry: ${d.name} — ${d.destination}`,
    html,
  });
}

// ─── Enquiry confirmation (system → customer) ──────────────────────────────────

export async function sendEnquiryConfirmation(d: Pick<EnquiryPayload, "name" | "email" | "destination">) {
  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#031e3e;padding:20px 24px;border-radius:8px 8px 0 0">
    <img src="https://www.luxeonair.co.uk/Logo/main-logo.png" alt="Luxeonair" height="28" style="opacity:.9"/>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px">
    <h2 style="margin:0 0 4px;font-size:18px;color:#031e3e">We've got your enquiry</h2>
    <p style="margin:0 0 16px">Hi ${esc(d.name.split(" ")[0] || d.name)},</p>
    <p style="margin:0 0 16px;line-height:1.6">Thanks for sending us your ${esc(d.destination)} enquiry. A named consultant is on it now and will be in touch with a rapid response by email or phone.</p>
    <p style="margin:0;line-height:1.6">In the meantime, if anything changes or you'd like to add details, just reply to this email.</p>
    <p style="margin:24px 0 0">Best regards,<br/>The Luxeonair team</p>
  </div>
  <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;text-align:center">Luxeonair · luxeonair.co.uk</p>
</div>`;

  await client().emails.send({
    from: from(),
    to: d.email,
    subject: "We've got your enquiry — Luxeonair",
    html,
  });
}

// ─── Enquiry reply (admin → customer) ──────────────────────────────────────────

export async function sendEnquiryReply(d: { to: string; name: string; subject: string; message: string }) {
  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#031e3e;padding:20px 24px;border-radius:8px 8px 0 0">
    <img src="https://www.luxeonair.co.uk/Logo/main-logo.png" alt="Luxeonair" height="28" style="opacity:.9"/>
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
    <img src="https://www.luxeonair.co.uk/Logo/main-logo.png" alt="Luxeonair" height="28" style="opacity:.9"/>
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
  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#031e3e;padding:20px 24px;border-radius:8px 8px 0 0">
    <img src="https://www.luxeonair.co.uk/Logo/main-logo.png" alt="Luxeonair" height="28" style="opacity:.9"/>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px">
    <h2 style="margin:0 0 4px;font-size:18px;color:#031e3e">We've got your flight enquiry</h2>
    <p style="margin:0 0 16px">Hi ${esc(d.name.split(" ")[0] || d.name)},</p>
    <p style="margin:0 0 16px;line-height:1.6">Thanks for enquiring about ${esc(d.routeLabel)}. A consultant is confirming live availability and pricing now, and will come back to you with a rapid response.</p>
    <p style="margin:0;line-height:1.6">If anything changes or you'd like to add details, just reply to this email.</p>
    <p style="margin:24px 0 0">Best regards,<br/>The Luxeonair team</p>
  </div>
  <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;text-align:center">Luxeonair · luxeonair.co.uk</p>
</div>`;

  await client().emails.send({
    from: from(),
    to: d.email,
    subject: "We've got your flight enquiry — Luxeonair",
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
    <img src="https://www.luxeonair.co.uk/Logo/main-logo.png" alt="Luxeonair" height="28" style="opacity:.9"/>
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
  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#031e3e;padding:20px 24px;border-radius:8px 8px 0 0">
    <img src="https://www.luxeonair.co.uk/Logo/main-logo.png" alt="Luxeonair" height="28" style="opacity:.9"/>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px">
    <h2 style="margin:0 0 4px;font-size:18px;color:#031e3e">We've got your message</h2>
    <p style="margin:0 0 16px">Hi ${esc(d.name.split(" ")[0] || d.name)},</p>
    <p style="margin:0 0 16px;line-height:1.6">Thanks for getting in touch. A member of the Luxeonair team will get back to you with a rapid response.</p>
    <p style="margin:0;line-height:1.6">If anything changes or you'd like to add details, just reply to this email.</p>
    <p style="margin:24px 0 0">Best regards,<br/>The Luxeonair team</p>
  </div>
  <p style="margin:16px 0 0;font-size:11px;color:#9ca3af;text-align:center">Luxeonair · luxeonair.co.uk</p>
</div>`;

  await client().emails.send({
    from: from(),
    to: d.email,
    subject: "We've got your message — Luxeonair",
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
