-- Deals no longer link to a destination record — the admin "Destination slug"
-- field is removed. Drop the FK before the column it constrains.
ALTER TABLE `deals` DROP FOREIGN KEY `deals_destination_slug_destinations_slug_fk`;
--> statement-breakpoint
ALTER TABLE `deals` DROP COLUMN `destination_slug`;
