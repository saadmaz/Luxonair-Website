-- NOTE: this will fail to apply if any existing `deals.destination_slug` or
-- `flight_offer_bookings.offer_id` value has no matching row in `destinations`/
-- `flight_offers` (orphaned rows — exactly the scenario this FK prevents going
-- forward). Before running this against a database with real data, check for
-- orphans first:
--   SELECT d.id, d.destination_slug FROM deals d LEFT JOIN destinations x ON x.slug = d.destination_slug WHERE x.slug IS NULL;
--   SELECT b.id, b.offer_id FROM flight_offer_bookings b LEFT JOIN flight_offers o ON o.id = b.offer_id WHERE o.id IS NULL;
-- and either fix/remove the orphaned rows or adjust this migration accordingly.
ALTER TABLE `deals` ADD CONSTRAINT `deals_destination_slug_destinations_slug_fk` FOREIGN KEY (`destination_slug`) REFERENCES `destinations`(`slug`) ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `flight_offer_bookings` ADD CONSTRAINT `flight_offer_bookings_offer_id_flight_offers_id_fk` FOREIGN KEY (`offer_id`) REFERENCES `flight_offers`(`id`) ON DELETE restrict ON UPDATE no action;
