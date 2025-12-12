-- ⚠️ OBSOLETO - NON USARE QUESTO FILE
-- Questo tentava di inserire una riga in game_phases per i toggle,
-- ma abbiamo deciso di usare game_settings invece.
-- Vedere: add_landing_toggles_to_settings.sql
-- Data obsolescenza: 3 Dicembre 2025

-- Insert game_phases row with id=1 if it doesn't exist
-- This is needed for the landing page toggle controls

-- First, check if the row exists
INSERT INTO game_phases (
  id,
  phase_name,
  phase_description,
  start_date,
  end_date,
  is_active,
  registration_button_enabled,
  wishlist_button_enabled,
  password_input_enabled
)
SELECT
  1,
  'Fase Registrazione',
  'Fase iniziale del gioco con registrazione partecipanti',
  '2026-01-24'::date,
  '2026-01-26'::date,
  true,
  true,
  true,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM game_phases WHERE id = 1
);

-- Update existing row if it already exists (add new columns)
UPDATE game_phases
SET
  registration_button_enabled = COALESCE(registration_button_enabled, true),
  wishlist_button_enabled = COALESCE(wishlist_button_enabled, true),
  password_input_enabled = COALESCE(password_input_enabled, false)
WHERE id = 1;
