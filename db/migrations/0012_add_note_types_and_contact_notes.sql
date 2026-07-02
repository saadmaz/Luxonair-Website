ALTER TABLE `enquiry_notes`
  ADD `type` enum('note','call','follow_up','email') NOT NULL DEFAULT 'note';
--> statement-breakpoint
CREATE TABLE `contact_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contact_id` int NOT NULL,
	`body` text NOT NULL,
	`type` enum('note','call','follow_up','email') NOT NULL DEFAULT 'note',
	`author_email` varchar(255) NOT NULL,
	`author_name` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `contact_notes` ADD CONSTRAINT `contact_notes_contact_id_contacts_id_fk` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX `contact_notes_contact_id_idx` ON `contact_notes` (`contact_id`);
