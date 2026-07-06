-- Replaces the 'closed_won' / 'closed_lost' statuses with 'sale_done' / 'cancelled'.
-- New pipeline: New, Contacted, In Progress, No Response, Sale Done, Cancelled.
-- Existing rows are remapped before the ENUM is redefined so no data is lost.

UPDATE `enquiry_packages` SET `status` = 'sale_done' WHERE `status` = 'closed_won';
UPDATE `enquiry_packages` SET `status` = 'cancelled' WHERE `status` = 'closed_lost';
UPDATE `enquiry_flights` SET `status` = 'sale_done' WHERE `status` = 'closed_won';
UPDATE `enquiry_flights` SET `status` = 'cancelled' WHERE `status` = 'closed_lost';

ALTER TABLE `enquiry_packages`
  MODIFY `status` ENUM('new','contacted','in_progress','no_response','sale_done','cancelled') NOT NULL DEFAULT 'new';

ALTER TABLE `enquiry_flights`
  MODIFY `status` ENUM('new','contacted','in_progress','no_response','sale_done','cancelled') NOT NULL DEFAULT 'new';
