CREATE TABLE `enquiry_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enquiry_id` int NOT NULL,
	`body` text NOT NULL,
	`author_email` varchar(255) NOT NULL,
	`author_name` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `enquiry_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `enquiry_notes` ADD CONSTRAINT `enquiry_notes_enquiry_id_enquiries_id_fk` FOREIGN KEY (`enquiry_id`) REFERENCES `enquiries`(`id`) ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX `enquiry_notes_enquiry_id_idx` ON `enquiry_notes` (`enquiry_id`);
