-- ============================================
-- FIX GAME_SETTINGS TABLE - DATABASE DEV
-- ============================================
-- Questo script corregge la struttura della tabella game_settings
-- per usare il formato key-value come in produzione
-- ============================================

-- 1. DROP tabella esistente con struttura errata
DROP TABLE IF EXISTS game_settings CASCADE;

-- 2. Ricrea tabella con struttura corretta (key-value)
CREATE TABLE game_settings (
  id SERIAL PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crea indice per performance
CREATE INDEX IF NOT EXISTS idx_game_settings_key ON game_settings(setting_key);

-- 4. Inserisci impostazioni default
INSERT INTO game_settings (setting_key, setting_value, description)
VALUES
  ('ceremony_active', false, 'Controls if ceremony mode is active'),
  ('registration_button_enabled', true, 'Controls if registration button is visible on landing page'),
  ('wishlist_button_enabled', true, 'Controls if wishlist button is visible on landing page'),
  ('password_input_enabled', false, 'Controls if password input for game access is enabled'),
  ('minigame_button_enabled', false, 'Controls if minigame button (Cerchio 95) is enabled'),
  ('maintenance_mode', false, 'Controls if maintenance mode is active')
ON CONFLICT (setting_key)
DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;

-- 5. Aggiungi commenti
COMMENT ON TABLE game_settings IS 'Global game settings (key-value format)';
COMMENT ON COLUMN game_settings.setting_key IS 'Unique setting identifier';
COMMENT ON COLUMN game_settings.setting_value IS 'Boolean value for the setting';
COMMENT ON COLUMN game_settings.description IS 'Human-readable description';

-- 6. Crea trigger per updated_at
CREATE OR REPLACE FUNCTION update_game_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_game_settings_updated_at ON game_settings;
CREATE TRIGGER update_game_settings_updated_at
  BEFORE UPDATE ON game_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_game_settings_timestamp();

-- ============================================
-- COMPLETATO! ✅
-- ============================================
