ALTER TABLE `enquiries` ADD `quote_type` enum('package','flight') NOT NULL DEFAULT 'package';
ALTER TABLE `enquiries` MODIFY `nights` int NULL;
ALTER TABLE `enquiries` MODIFY `depart_airport` text NULL;
ALTER TABLE `enquiries` MODIFY `cabin_class` text NULL;
ALTER TABLE `enquiries` ADD `hotel_rating` text NULL;
ALTER TABLE `enquiries` ADD `board_basis` text NULL;
ALTER TABLE `enquiries` ADD `flights_included` boolean DEFAULT true;
CREATE INDEX `enquiries_quote_type_idx` ON `enquiries` (`quote_type`);
