-- Uploaded images are now stored as bytes in the database instead of on disk
-- (see src/routes/api/upload.ts). width/height are populated from the actual
-- decoded image and are NULL for vector SVGs, which have no fixed pixel size.

CREATE TABLE `images` (
  `id` varchar(36) NOT NULL,
  `mime_type` ENUM('image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif','image/bmp','image/tiff','image/svg+xml','image/avif') NOT NULL,
  `data` LONGBLOB NOT NULL,
  `byte_size` int NOT NULL,
  `width` int,
  `height` int,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `images_id` PRIMARY KEY(`id`)
);

CREATE INDEX `images_created_at_idx` ON `images` (`created_at`);
