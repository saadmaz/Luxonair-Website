ALTER TABLE `deals` ADD `gallery` json NOT NULL DEFAULT ('[]');
--> statement-breakpoint
ALTER TABLE `deals` ADD `is_favourite` boolean NOT NULL DEFAULT false;
--> statement-breakpoint
ALTER TABLE `holiday_types` ADD `is_favourite` boolean NOT NULL DEFAULT false;
--> statement-breakpoint
CREATE TABLE `destination_highlights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`image` text NOT NULL,
	`country` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`type` varchar(100) NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `destination_highlights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `deals_is_favourite_idx` ON `deals` (`is_favourite`);
--> statement-breakpoint
CREATE INDEX `destination_highlights_sort_order_idx` ON `destination_highlights` (`sort_order`);
