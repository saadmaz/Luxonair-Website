ALTER TABLE `admin_users`
  MODIFY `role` enum('admin','superadmin','user') NOT NULL DEFAULT 'admin';
--> statement-breakpoint
ALTER TABLE `admin_users`
  ADD `sections` json NOT NULL DEFAULT ('[]');
