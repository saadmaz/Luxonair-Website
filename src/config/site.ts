// ─── Luxonair site configuration ─────────────────────────────────────────────
// Single source of truth for all brand constants used across the app.
// Update the TODO fields before go-live; empty strings act as "disabled" sentinels
// (social icons hidden, forms run in demo/console mode, accreditation badges suppressed).

export const SITE = {
  phone: {
    /** Human-readable display string (used in UI copy) */
    display: "+44 7448 009739",
    /** E.164 format for tel: links */
    tel: "+447448009739",
    /** Digits only, no +, for wa.me links */
    whatsapp: "447448009739",
  },
  email: "info@luxeonair.co.uk",
  address: "11 Charlotte Avenue, Bicester, OX27 8AS",

  hours: {
    weekday: { days: "Mon–Fri", open: "09:00", close: "18:00" },
    weekend: { days: "Sat–Sun", open: "09:00", close: "16:00" },
    /** Short one-liner for UI copy */
    display: "Mon–Fri 09:00–18:00 · Sat–Sun 09:00–16:00 GMT",
  },
  registration: "00000000",           // TODO: Companies House registration number

  social: {
    instagram: "",  // TODO: add Instagram URL
    facebook: "",   // TODO: add Facebook URL
    tiktok: "",     // TODO: add TikTok URL
    linkedin: "",   // TODO: add LinkedIn URL
  },

  accreditation: {
    // Set to real membership numbers when available
    atol: "",   // TODO: ATOL membership number
    iata: "",   // TODO: IATA code
  },

  stats: {
    // Shown on the About page stats strip
    trips: "500+",
    repeatRate: "78%",
    years: "8",
    corporate: "40+",
  },

  team: {
    location: "London",
    avgYears: "12",
  },

  /**
   * Formspree form IDs - create free forms at https://formspree.io
   * Leave empty to run in demo mode (submissions logged to console).
   */
  formspree: {
    quote: "",       // TODO: paste your Formspree quote-form ID here
    contact: "",     // TODO: paste your Formspree contact-form ID here
    newsletter: "",  // TODO: paste your Formspree / Mailchimp list ID here
  },
} as const;
