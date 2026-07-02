ALTER TABLE `admin_users` ADD `role` enum('admin','superadmin') NOT NULL DEFAULT 'admin';
--> statement-breakpoint
CREATE TABLE `admin_actions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`admin_email` varchar(255) NOT NULL,
	`method` varchar(10) NOT NULL,
	`path` varchar(500) NOT NULL,
	`status` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_actions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `admin_actions_admin_email_idx` ON `admin_actions` (`admin_email`);
--> statement-breakpoint
CREATE INDEX `admin_actions_created_at_idx` ON `admin_actions` (`created_at`);
