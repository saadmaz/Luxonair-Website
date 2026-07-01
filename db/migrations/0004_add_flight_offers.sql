CREATE TABLE `flight_offer_bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`offer_id` varchar(100) NOT NULL,
	`route_label` text NOT NULL,
	`cabin_class` varchar(20) NOT NULL,
	`price` int NOT NULL,
	`trip_type` varchar(20) NOT NULL,
	`depart_date` varchar(10),
	`return_date` varchar(10),
	`adults` int NOT NULL,
	`children` int NOT NULL DEFAULT 0,
	`infants` int NOT NULL DEFAULT 0,
	`budget` text,
	`notes` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'new',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `flight_offer_bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `flight_offers` (
	`id` varchar(100) NOT NULL,
	`cabin_class` varchar(20) NOT NULL,
	`from_city` varchar(100) NOT NULL,
	`from_country` varchar(100) NOT NULL,
	`to_city` varchar(100) NOT NULL,
	`to_country` varchar(100) NOT NULL,
	`airline_name` varchar(100) NOT NULL,
	`airline_logo` text NOT NULL,
	`price` int NOT NULL,
	`image` text NOT NULL,
	`featured` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `flight_offers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `flight_offer_bookings_status_idx` ON `flight_offer_bookings` (`status`);--> statement-breakpoint
CREATE INDEX `flight_offer_bookings_created_at_idx` ON `flight_offer_bookings` (`created_at`);--> statement-breakpoint
CREATE INDEX `flight_offers_cabin_class_idx` ON `flight_offers` (`cabin_class`);--> statement-breakpoint
CREATE INDEX `flight_offers_sort_order_idx` ON `flight_offers` (`sort_order`);