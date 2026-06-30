CREATE TABLE `sessions` (
	`id` varchar(64) NOT NULL,
	`email` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`revoked_at` timestamp,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `sessions_email_idx` ON `sessions` (`email`);