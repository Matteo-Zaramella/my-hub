-- Add maintenance_mode column to game_settings table
ALTER TABLE game_settings
ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT FALSE;

-- Set default value
UPDATE game_settings SET maintenance_mode = false WHERE id = 1;
