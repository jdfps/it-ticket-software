-- Run once on an EXISTING TMS database. Do not run schema.sql (it drops the DB).
USE TMS;
ALTER TABLE tickets ADD COLUMN other_category VARCHAR(100) NULL AFTER description;
INSERT INTO categories (category_name) VALUES ('Other')
ON DUPLICATE KEY UPDATE category_name = VALUES(category_name);
