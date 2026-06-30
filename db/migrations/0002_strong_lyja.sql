DROP INDEX `enquiries_status_idx` ON `enquiries`;--> statement-breakpoint
ALTER TABLE `faq_items` ADD CONSTRAINT `faq_items_faq_group_id_faq_groups_id_fk` FOREIGN KEY (`faq_group_id`) REFERENCES `faq_groups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `enquiries_status_idx` ON `enquiries` (`status`);