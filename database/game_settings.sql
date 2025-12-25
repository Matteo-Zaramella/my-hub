-- =====================================================
-- GAME SETTINGS TABLE
-- =====================================================
-- Tabella per gestire le impostazioni globali del gioco
-- Include on/off switches per varie features
-- =====================================================

-- Crea tabella game_settings (se non esiste)
CREATE TABLE IF NOT EXISTS game_settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserisci le impostazioni di default
INSERT INTO game_settings (setting_key, setting_value, description)
VALUES
  ('registration_enabled', false, 'Abilita/disabilita il form di registrazione partecipanti'),
  ('ceremony_active', false, 'Attiva la cerimonia di apertura (password EVOLUZIONE)'),
  ('chat_enabled', false, 'Abilita la chat di gruppo'),
  ('clues_reveal_enabled', false, 'Abilita la rivelazione automatica indizi settimanali')
ON CONFLICT (setting_key) DO NOTHING;

-- Crea trigger per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_game_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS game_settings_updated_at ON game_settings;
CREATE TRIGGER game_settings_updated_at
  BEFORE UPDATE ON game_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_game_settings_updated_at();

-- RLS Policies (solo admin può modificare, tutti possono leggere)
ALTER TABLE game_settings ENABLE ROW LEVEL SECURITY;

-- Policy per lettura (tutti possono leggere)
DROP POLICY IF EXISTS "Anyone can read game settings" ON game_settings;
CREATE POLICY "Anyone can read game settings"
  ON game_settings FOR SELECT
  USING (true);

-- Policy per modifica (solo authenticated users - admin tramite dashboard)
DROP POLICY IF EXISTS "Authenticated users can update game settings" ON game_settings;
CREATE POLICY "Authenticated users can update game settings"
  ON game_settings FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Verifica
SELECT * FROM game_settings ORDER BY setting_key;
