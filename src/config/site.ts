// ─── Luxonair site configuration ─────────────────────────────────────────────
// Single source of truth for all brand constants used across the app.
// Empty strings are "disabled" sentinels — social icons hidden, accreditation
// badges suppressed. Fill before go-live.

export const SITE = {
  phone: {
    display: "+44 7448 009739",
    tel: "+447448009739",
    whatsapp: "447448009739",
  },
  email: "info@luxeonair.co.uk",
  address: "11 Charlotte Avenue, Bicester, OX27 8AS",

  hours: {
    weekday: { days: "Mon–Fri", open: "09:00", close: "18:00" },
    weekend: { days: "Sat–Sun", open: "09:00", close: "16:00" },
    display: "Mon–Fri 09:00–18:00 · Sat–Sun 09:00–16:00 GMT",
  },

  // TODO: replace with real Companies House registration number before go-live
  registration: "",

  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
    linkedin: "",
  },

  accreditation: {
    // Set to real numbers when available; empty string = badge not rendered
    atol: "",
    iata: "",
  },

  stats: {
    trips: "500+",
    repeatRate: "78%",
    years: "8",
    corporate: "40+",
  },

  team: {
    location: "London",
    avgYears: "12",
  },
} as const;
