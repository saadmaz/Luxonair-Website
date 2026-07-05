import { createAPIFileRoute } from "@tanstack/react-start/api";
import { randomUUID } from "node:crypto";
import { imageSize } from "image-size";
import { db, images } from "../../../db/index";
import { requireAuth } from "@/server/auth";
import {
  IMAGE_MIME_TYPES,
  MAX_IMAGE_BYTES,
  MIN_IMAGE_HEIGHT,
  MIN_IMAGE_WIDTH,
  type ImageMimeType,
} from "@/lib/image-types";

// Maps the format `image-size` detects from the file's actual bytes to a mime
// type — never trust the client-supplied Content-Type/File.type, which is
// fully attacker-controlled in a multipart request. Several HEIF brand
// variants all mean HEIC; mif1/msf1 are the generic (non-Apple) HEIF brand.
const DETECTED_TYPE_TO_MIME: Record<string, ImageMimeType> = {
  jpg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  avif: "image/avif",
  heic: "image/heic",
  heix: "image/heic",
  hevc: "image/heic",
  hevx: "image/heic",
  mif1: "image/heif",
  msf1: "image/heif",
};

export const APIRoute = createAPIFileRoute("/api/upload")({
  POST: async ({ request }) => {
    await requireAuth(request);

    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > MAX_IMAGE_BYTES) {
      return Response.json(
        { error: `Image is too large (max ${MAX_IMAGE_BYTES / 1024 / 1024}MB)` },
        { status: 413 },
      );
    }

    const form = await request.formData().catch(() => null);
    const file = form?.get("file");
    if (!file || !(file instanceof File)) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return Response.json(
        { error: `Image is too large (max ${MAX_IMAGE_BYTES / 1024 / 1024}MB)` },
        { status: 413 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let dimensions: { width?: number; height?: number; type?: string } | null = null;
    try {
      dimensions = imageSize(buffer);
    } catch {
      dimensions = null;
    }

    const mimeType = dimensions?.type ? DETECTED_TYPE_TO_MIME[dimensions.type] : undefined;
    if (!mimeType || !IMAGE_MIME_TYPES.includes(mimeType)) {
      return Response.json(
        { error: "Unsupported image type — use JPG, PNG, WEBP, GIF, HEIC, HEIF, BMP, TIFF, SVG or AVIF" },
        { status: 400 },
      );
    }

    // SVGs are vector — width/height may be genuinely absent (no resolution
    // floor applies to them). Every other format must have decodable
    // dimensions and meet the minimum resolution.
    const width = dimensions?.width ?? null;
    const height = dimensions?.height ?? null;
    if (mimeType !== "image/svg+xml") {
      if (!width || !height) {
        return Response.json({ error: "Could not read image dimensions" }, { status: 400 });
      }
      if (width < MIN_IMAGE_WIDTH || height < MIN_IMAGE_HEIGHT) {
        return Response.json(
          { error: `Image resolution too low (min ${MIN_IMAGE_WIDTH}×${MIN_IMAGE_HEIGHT}px)` },
          { status: 400 },
        );
      }
    }

    const id = randomUUID();
    await db.insert(images).values({
      id,
      mimeType,
      data: buffer,
      byteSize: buffer.length,
      width,
      height,
    });

    return Response.json({ url: `/api/uploads/${id}` }, { status: 201 });
  },
});
