CREATE TABLE `admin_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`category` varchar(50) NOT NULL,
	`author` varchar(255) NOT NULL,
	`date` varchar(10) NOT NULL,
	`read_minutes` int NOT NULL DEFAULT 5,
	`hero_image` text NOT NULL,
	`content` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`topic` text,
	`message` text NOT NULL,
	`read` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deals` (
	`id` varchar(100) NOT NULL,
	`title` text NOT NULL,
	`destination_slug` varchar(255) NOT NULL,
	`region` varchar(100) NOT NULL,
	`nights` int NOT NULL,
	`board` varchar(50) NOT NULL,
	`from_price` int NOT NULL,
	`old_price` int,
	`badge` varchar(50) NOT NULL,
	`expires` varchar(10) NOT NULL,
	`image` text NOT NULL,
	`blurb` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `deals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `destinations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`name` text NOT NULL,
	`country` varchar(255) NOT NULL,
	`region` varchar(50) NOT NULL,
	`trip_type` json NOT NULL,
	`budget_band` varchar(10) NOT NULL,
	`from_price` int NOT NULL,
	`duration_nights` int NOT NULL,
	`hero_image` text NOT NULL,
	`gallery` json NOT NULL,
	`tagline` text NOT NULL,
	`summary` text NOT NULL,
	`itinerary` json NOT NULL,
	`highlights` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `destinations_id` PRIMARY KEY(`id`),
	CONSTRAINT `destinations_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `enquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
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
	`depart_airport` text NOT NULL,
	`cabin_class` text NOT NULL,
	`direct_only` text,
	`preferred_airlines` text,
	`adults` int NOT NULL,
	`children` int NOT NULL DEFAULT 0,
	`budget` text NOT NULL,
	`notes` text,
	`status` text NOT NULL DEFAULT ('new'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `enquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faq_groups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `faq_groups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faq_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`faq_group_id` int NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `faq_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `holiday_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`tagline` text NOT NULL,
	`summary` text NOT NULL,
	`hero_image` text NOT NULL,
	`bullets` json NOT NULL,
	`destination_slugs` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `holiday_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `holiday_types_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscribers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`author` varchar(255) NOT NULL,
	`trip` varchar(255) NOT NULL,
	`rating` int NOT NULL DEFAULT 5,
	`date` varchar(10) NOT NULL,
	`body` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
