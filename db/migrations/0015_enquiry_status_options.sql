-- Expands enquiry status from (New, In Progress, Responded) to the full CRM
-- pipeline: New, Contacted, In Progress, Closed Won, Closed Lost, No Response.
-- Existing 'responded' rows become 'contacted' (closest equivalent — it meant
-- "we replied", not a closed outcome). The column is also tightened from a
-- free-text field to an ENUM so only these six values can ever be stored.

UPDATE `enquiry_packages` SET `status` = 'contacted' WHERE `status` = 'responded';
UPDATE `enquiry_flights` SET `status` = 'contacted' WHERE `status` = 'responded';

ALTER TABLE `enquiry_packages`
  MODIFY `status` ENUM('new','contacted','in_progress','closed_won','closed_lost','no_response') NOT NULL DEFAULT 'new';

ALTER TABLE `enquiry_flights`
  MODIFY `status` ENUM('new','contacted','in_progress','closed_won','closed_lost','no_response') NOT NULL DEFAULT 'new';
