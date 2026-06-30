CREATE TABLE `rate_limits` (
	`key` varchar(255) NOT NULL,
	`count` int NOT NULL DEFAULT 1,
	`reset_at` bigint NOT NULL,
	CONSTRAINT `rate_limits_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE INDEX `blog_posts_date_idx` ON `blog_posts` (`date`);--> statement-breakpoint
CREATE INDEX `contacts_read_idx` ON `contacts` (`read`);--> statement-breakpoint
CREATE INDEX `contacts_created_at_idx` ON `contacts` (`created_at`);--> statement-breakpoint
CREATE INDEX `deals_expires_idx` ON `deals` (`expires`);--> statement-breakpoint
CREATE INDEX `destinations_region_idx` ON `destinations` (`region`);--> statement-breakpoint
CREATE INDEX `destinations_budget_band_idx` ON `destinations` (`budget_band`);--> statement-breakpoint
CREATE INDEX `enquiries_status_idx` ON `enquiries` (`created_at`);--> statement-breakpoint
CREATE INDEX `enquiries_created_at_idx` ON `enquiries` (`created_at`);--> statement-breakpoint
CREATE INDEX `faq_groups_sort_order_idx` ON `faq_groups` (`sort_order`);--> statement-breakpoint
CREATE INDEX `faq_items_group_id_idx` ON `faq_items` (`faq_group_id`);--> statement-breakpoint
CREATE INDEX `faq_items_sort_order_idx` ON `faq_items` (`sort_order`);--> statement-breakpoint
CREATE INDEX `subscribers_created_at_idx` ON `subscribers` (`created_at`);--> statement-breakpoint
CREATE INDEX `testimonials_created_at_idx` ON `testimonials` (`created_at`);