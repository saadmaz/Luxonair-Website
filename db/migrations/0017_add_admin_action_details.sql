-- Enriches admin_actions (already auto-populated for every mutating admin
-- request — see src/api-router.ts) with structured fields so the new admin
-- Logs page can render human sentences like "Jane deleted a destination:
-- Bali Getaway" instead of raw method/path/status.
--
-- Existing rows get a best-effort `action` backfilled from their HTTP method;
-- resource_type/resource_label are left NULL for them since that detail
-- wasn't captured before this change.

ALTER TABLE `admin_actions`
  ADD COLUMN `action` varchar(20) NOT NULL DEFAULT 'other' AFTER `status`,
  ADD COLUMN `resource_type` varchar(100) DEFAULT NULL AFTER `action`,
  ADD COLUMN `resource_label` varchar(255) DEFAULT NULL AFTER `resource_type`;

UPDATE `admin_actions` SET `action` = CASE
  WHEN `method` = 'POST' THEN 'created'
  WHEN `method` IN ('PATCH', 'PUT') THEN 'updated'
  WHEN `method` = 'DELETE' THEN 'deleted'
  ELSE 'other'
END;
