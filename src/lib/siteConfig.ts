// ─── Luxonair site configuration ─────────────────────────────────────────────
// All brand constants in one place. Update these before going live.

export const SITE = {
  phone: {
    /** Human-readable display string (used in UI copy) */
    display: "0800 000 0000",        // TODO: replace with real freephone number
    /** E.164 format for tel: links */
    tel: "+440000000000",             // TODO: replace with real E.164 number
    /** Digits only, no +, for wa.me links */
    whatsapp: "440000000000",         // TODO: replace with real WhatsApp number
  },
  email: "hello@luxonair.com",
  address: "London, United Kingdom",
  registration: "00000000",           // TODO: Companies House registration number

  social: {
    // Set to a real URL to show the icon; leave as empty string to hide it
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  },

  accreditation: {
    // Set to real membership numbers when available
    atol: "",   // TODO: ATOL membership number
    abta: "",   // TODO: ABTA membership number
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
   * Formspree form IDs — create free forms at https://formspree.io
   * Leave empty to run in demo mode (submissions logged to console).
   */
  formspree: {
    quote: "",       // TODO: paste your Formspree quote-form ID here
    contact: "",     // TODO: paste your Formspree contact-form ID here
    newsletter: "",  // TODO: paste your Formspree / Mailchimp list ID here
  },
} as const;
