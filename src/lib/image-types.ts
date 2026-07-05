// Kept in sync with the mime_type enum on the `images` table in db/schema.ts.
export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/bmp",
  "image/tiff",
  "image/svg+xml",
  "image/avif",
] as const;

export type ImageMimeType = (typeof IMAGE_MIME_TYPES)[number];

export const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // 20MB

// A quality floor, not a thumbnail limit — blocks placeholder/scraped-thumbnail
// uploads while staying low enough not to reject small logos or icons.
// Vector images (SVG) have no fixed pixel size and skip this check entirely.
export const MIN_IMAGE_WIDTH = 100;
export const MIN_IMAGE_HEIGHT = 100;
