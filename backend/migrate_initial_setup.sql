-- Optional manual migration for an existing MySQL installation.
-- The API also creates this table automatically during startup.
-- Run inside the existing TMS database, never re-run schema.sql.
CREATE TABLE IF NOT EXISTS installation_state (
    id INT PRIMARY KEY,
    initialized BOOLEAN NOT NULL DEFAULT FALSE
);
INSERT IGNORE INTO installation_state (id, initialized) VALUES (1, FALSE);
-- Existing users always block setup even if the marker is false.
-- Keep the marker true once your installation has been initialized.
