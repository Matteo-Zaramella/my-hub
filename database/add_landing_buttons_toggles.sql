-- ⚠️ OBSOLETO - NON USARE QUESTO FILE
-- Questo tentava di aggiungere i toggle a game_phases,
-- ma abbiamo deciso di usare game_settings invece.
-- Vedere: add_landing_toggles_to_settings.sql
-- Data obsolescenza: 3 Dicembre 2025

-- Add toggle fields for landing page buttons control
-- These fields control which buttons are visible/active on the landing page

ALTER TABLE game_phases
ADD COLUMN IF NOT EXISTS registration_button_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS wishlist_button_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS password_input_enabled BOOLEAN DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN game_phases.registration_button_enabled IS 'Controls if registration button (numero 2, position 1) is visible on landing page';
COMMENT ON COLUMN game_phases.wishlist_button_enabled IS 'Controls if wishlist button (numero 1, position 0) is visible on landing page';
COMMENT ON COLUMN game_phases.password_input_enabled IS 'Controls if password input for game access (position 99) is enabled';

-- Update the registration phase (id=1) to have these enabled by default
UPDATE game_phases
SET
  registration_button_enabled = true,
  wishlist_button_enabled = true,
  password_input_enabled = false
WHERE id = 1;
