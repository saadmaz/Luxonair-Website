-- Splits the single `enquiries` table into two dedicated tables —
-- `enquiry_packages` and `enquiry_flights` — each with its own notes table,
-- matching the redesigned quote wizard (Package vs Flight, asked separately).
--
-- Assumes the database is currently at the schema produced by migrations
-- 0000-0013 (a single `enquiries` table + `enquiry_notes`). Existing rows are
-- migrated across based on `trip_type = 'Flight only'` (the marker the old
-- combined form used for flight-only enquiries); everything else is treated
-- as a package enquiry. Existing activity-log notes are carried over too.
-- The old `enquiries` / `enquiry_notes` tables are dropped at the end —
-- back up your database before running this if that data matters.

-- ─── New tables ────────────────────────────────────────────────────────────

CREATE TABLE `enquiry_packages` (
  `id` int AUTO_INCREMENT NOT NULL,
  `legacy_id` int,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `phone` text NOT NULL,
  `destination` text NOT NULL,
  `region` text,
  `trip_type` text NOT NULL,
  `date_mode` text NOT NULL,
  `depart_window` text,
  `flexibility` text,
  `depart_date` text,
  `return_date` text,
  `nights` int NOT NULL,
  `budget` text NOT NULL,
  `hotel_rating` text,
  `board_basis` text,
  `flights_included` boolean NOT NULL DEFAULT true,
  `depart_airport` text,
  `cabin_class` text,
  `adults` int NOT NULL,
  `children` int NOT NULL DEFAULT 0,
  `infants` int NOT NULL DEFAULT 0,
  `notes` text,
  `status` text NOT NULL DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `enquiry_packages_id` PRIMARY KEY(`id`)
);
CREATE INDEX `enquiry_packages_status_idx` ON `enquiry_packages` (`status`);
CREATE INDEX `enquiry_packages_created_at_idx` ON `enquiry_packages` (`created_at`);

CREATE TABLE `enquiry_flights` (
  `id` int AUTO_INCREMENT NOT NULL,
  `legacy_id` int,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `phone` text NOT NULL,
  `depart_airport` text NOT NULL,
  `destination` text NOT NULL,
  `trip_type` varchar(20) NOT NULL,
  `date_mode` text NOT NULL,
  `depart_window` text,
  `depart_date` text,
  `return_date` text,
  `adults` int NOT NULL,
  `children` int NOT NULL DEFAULT 0,
  `infants` int NOT NULL DEFAULT 0,
  `cabin_class` text NOT NULL,
  `direct_only` text,
  `preferred_airlines` text,
  `budget` text NOT NULL,
  `notes` text,
  `status` text NOT NULL DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `enquiry_flights_id` PRIMARY KEY(`id`)
);
CREATE INDEX `enquiry_flights_status_idx` ON `enquiry_flights` (`status`);
CREATE INDEX `enquiry_flights_created_at_idx` ON `enquiry_flights` (`created_at`);

CREATE TABLE `enquiry_package_notes` (
  `id` int AUTO_INCREMENT NOT NULL,
  `enquiry_id` int NOT NULL,
  `body` text NOT NULL,
  `type` enum('note','call','follow_up','email') NOT NULL DEFAULT 'note',
  `author_email` varchar(255) NOT NULL,
  `author_name` varchar(100),
  `created_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `enquiry_package_notes_id` PRIMARY KEY(`id`),
  CONSTRAINT `enquiry_package_notes_enquiry_id_fk` FOREIGN KEY (`enquiry_id`) REFERENCES `enquiry_packages`(`id`) ON DELETE CASCADE
);
CREATE INDEX `enquiry_package_notes_enquiry_id_idx` ON `enquiry_package_notes` (`enquiry_id`);

CREATE TABLE `enquiry_flight_notes` (
  `id` int AUTO_INCREMENT NOT NULL,
  `enquiry_id` int NOT NULL,
  `body` text NOT NULL,
  `type` enum('note','call','follow_up','email') NOT NULL DEFAULT 'note',
  `author_email` varchar(255) NOT NULL,
  `author_name` varchar(100),
  `created_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `enquiry_flight_notes_id` PRIMARY KEY(`id`),
  CONSTRAINT `enquiry_flight_notes_enquiry_id_fk` FOREIGN KEY (`enquiry_id`) REFERENCES `enquiry_flights`(`id`) ON DELETE CASCADE
);
CREATE INDEX `enquiry_flight_notes_enquiry_id_idx` ON `enquiry_flight_notes` (`enquiry_id`);

-- ─── Migrate existing rows ─────────────────────────────────────────────────
-- `legacy_id` is a temporary bridge column used only to re-link notes below;
-- it's dropped at the end of this migration.

INSERT INTO `enquiry_packages`
  (`legacy_id`, `name`, `email`, `phone`, `destination`, `region`, `trip_type`, `date_mode`, `depart_window`, `flexibility`, `depart_date`, `return_date`, `nights`, `budget`, `depart_airport`, `cabin_class`, `flights_included`, `adults`, `children`, `infants`, `notes`, `status`, `created_at`)
SELECT
  `id`, `name`, `email`, `phone`, `destination`, `region`, `trip_type`, `date_mode`, `depart_window`, `flexibility`, `depart_date`, `return_date`, `nights`, `budget`, `depart_airport`, `cabin_class`, true, `adults`, `children`, `infants`, `notes`, `status`, `created_at`
FROM `enquiries`
WHERE `trip_type` <> 'Flight only';

INSERT INTO `enquiry_flights`
  (`legacy_id`, `name`, `email`, `phone`, `depart_airport`, `destination`, `trip_type`, `date_mode`, `depart_window`, `depart_date`, `return_date`, `adults`, `children`, `infants`, `cabin_class`, `direct_only`, `preferred_airlines`, `budget`, `notes`, `status`, `created_at`)
SELECT
  `id`, `name`, `email`, `phone`, `depart_airport`, `destination`, 'Return', `date_mode`, `depart_window`, `depart_date`, `return_date`, `adults`, `children`, `infants`, `cabin_class`, `direct_only`, `preferred_airlines`, `budget`, `notes`, `status`, `created_at`
FROM `enquiries`
WHERE `trip_type` = 'Flight only';

-- Carry over the CRM activity log (calls/follow-ups/notes) against whichever
-- new table each enquiry landed in.
INSERT INTO `enquiry_package_notes` (`enquiry_id`, `body`, `type`, `author_email`, `author_name`, `created_at`)
SELECT ep.`id`, n.`body`, n.`type`, n.`author_email`, n.`author_name`, n.`created_at`
FROM `enquiry_notes` n
JOIN `enquiry_packages` ep ON ep.`legacy_id` = n.`enquiry_id`;

INSERT INTO `enquiry_flight_notes` (`enquiry_id`, `body`, `type`, `author_email`, `author_name`, `created_at`)
SELECT ef.`id`, n.`body`, n.`type`, n.`author_email`, n.`author_name`, n.`created_at`
FROM `enquiry_notes` n
JOIN `enquiry_flights` ef ON ef.`legacy_id` = n.`enquiry_id`;

-- ─── Clean up ───────────────────────────────────────────────────────────────

ALTER TABLE `enquiry_packages` DROP COLUMN `legacy_id`;
ALTER TABLE `enquiry_flights` DROP COLUMN `legacy_id`;

DROP TABLE `enquiry_notes`;
DROP TABLE `enquiries`;
