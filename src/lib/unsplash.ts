// Centralised Unsplash URL builder.
// All four data modules (destinations, deals, holidayTypes, blog) used the same
// inline helper. Keeping it here means a CDN swap or quality-level change is a
// one-line edit, not a four-file hunt.
export const unsplashImg = (id: string, w = 1600): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
