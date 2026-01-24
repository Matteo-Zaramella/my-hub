-- ============================================
-- FASE 1: DATABASE FOUNDATION
-- A Tutto Reality - Sistema Completo
-- ============================================
-- ESEGUI QUESTO SCRIPT NEL SQL EDITOR DI SUPABASE
-- ============================================

-- ============================================
-- 1.1 TABELLA: game_teams
-- ============================================
CREATE TABLE IF NOT EXISTS game_teams (
  id SERIAL PRIMARY KEY,
  team_code VARCHAR(10) UNIQUE NOT NULL,  -- FSB, MOSSAD, MSS, AISE
  team_name VARCHAR(50) NOT NULL,
  team_color VARCHAR(7) NOT NULL,  -- Hex color
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserisci le 4 squadre
INSERT INTO game_teams (team_code, team_name, team_color) VALUES
  ('FSB', 'FSB', '#DC2626'),       -- Rosso
  ('MOSSAD', 'Mossad', '#2563EB'), -- Blu
  ('MSS', 'MSS', '#16A34A'),       -- Verde
  ('AISE', 'AISE', '#CA8A04')      -- Oro/Giallo
ON CONFLICT (team_code) DO NOTHING;

COMMENT ON TABLE game_teams IS 'Le 4 squadre del gioco: FSB, Mossad, MSS, AISE';

-- ============================================
-- 1.2 MODIFICA: game_participants - Aggiungi team_id
-- ============================================
-- Prima verifica se la colonna esiste
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'game_participants' AND column_name = 'team_id'
  ) THEN
    ALTER TABLE game_participants ADD COLUMN team_id INTEGER REFERENCES game_teams(id);
    CREATE INDEX idx_game_participants_team ON game_participants(team_id);
  END IF;
END $$;

-- Aggiungi colonna total_points se non esiste (alcuni schema usano current_points)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'game_participants' AND column_name = 'total_points'
  ) THEN
    ALTER TABLE game_participants ADD COLUMN total_points INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================
-- 1.3 TABELLA: game_chat_messages (nuova versione per il gioco)
-- ============================================
-- Droppa se esiste una versione vecchia incompatibile
-- DROP TABLE IF EXISTS game_chat_messages_game CASCADE;

CREATE TABLE IF NOT EXISTS game_chat_messages_game (
  id BIGSERIAL PRIMARY KEY,
  participant_code VARCHAR(10),  -- Nullable per messaggi di sistema
  team_id INTEGER REFERENCES game_teams(id),
  nickname VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'user',  -- user, system, samantha
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_game_created_at ON game_chat_messages_game(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_game_team ON game_chat_messages_game(team_id);
CREATE INDEX IF NOT EXISTS idx_chat_game_participant ON game_chat_messages_game(participant_code);

-- RLS per chat
ALTER TABLE game_chat_messages_game ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view game chat" ON game_chat_messages_game;
CREATE POLICY "Anyone can view game chat"
  ON game_chat_messages_game FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can send game chat messages" ON game_chat_messages_game;
CREATE POLICY "Anyone can send game chat messages"
  ON game_chat_messages_game FOR INSERT
  WITH CHECK (true);

-- Abilita Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE game_chat_messages_game;

COMMENT ON TABLE game_chat_messages_game IS 'Chat di gruppo del gioco con supporto squadre';

-- ============================================
-- 1.4 TABELLA: game_clue_validations
-- ============================================
CREATE TABLE IF NOT EXISTS game_clue_validations (
  id SERIAL PRIMARY KEY,
  participant_code VARCHAR(10) NOT NULL,
  team_id INTEGER REFERENCES game_teams(id),
  clue_id INTEGER REFERENCES clues(id),
  challenge_id INTEGER REFERENCES challenges(id),
  validation_type VARCHAR(20) NOT NULL,  -- clue, challenge
  submitted_answer VARCHAR(100) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  points_awarded INTEGER DEFAULT 0,
  validated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_validations_participant ON game_clue_validations(participant_code);
CREATE INDEX IF NOT EXISTS idx_validations_team ON game_clue_validations(team_id);
CREATE INDEX IF NOT EXISTS idx_validations_challenge ON game_clue_validations(challenge_id);
CREATE INDEX IF NOT EXISTS idx_validations_correct ON game_clue_validations(is_correct);

-- RLS
ALTER TABLE game_clue_validations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view validations" ON game_clue_validations;
CREATE POLICY "Anyone can view validations"
  ON game_clue_validations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert validations" ON game_clue_validations;
CREATE POLICY "Anyone can insert validations"
  ON game_clue_validations FOR INSERT
  WITH CHECK (true);

COMMENT ON TABLE game_clue_validations IS 'Validazioni di indizi e sfide con punti';

-- ============================================
-- 1.5 TABELLA: game_state
-- ============================================
CREATE TABLE IF NOT EXISTS game_state (
  id SERIAL PRIMARY KEY,
  game_phase VARCHAR(20) DEFAULT 'pre_ceremony',  -- pre_ceremony, ceremony, game_active
  ceremony_completed BOOLEAN DEFAULT FALSE,
  ceremony_completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_game_state CHECK (id = 1)
);

-- Inserisci stato iniziale
INSERT INTO game_state (id, game_phase, ceremony_completed)
VALUES (1, 'pre_ceremony', FALSE)
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view game state" ON game_state;
CREATE POLICY "Anyone can view game state"
  ON game_state FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can update game state" ON game_state;
CREATE POLICY "Anyone can update game state"
  ON game_state FOR UPDATE
  USING (true);

-- Abilita Realtime per game_state
ALTER PUBLICATION supabase_realtime ADD TABLE game_state;

COMMENT ON TABLE game_state IS 'Stato globale del gioco (singola riga)';

-- ============================================
-- 1.6 TRIGGER: Aggiorna punti squadra su validazione
-- ============================================
CREATE OR REPLACE FUNCTION on_validation_success()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_correct AND NEW.points_awarded > 0 THEN
    -- Aggiorna punti partecipante
    UPDATE game_participants
    SET total_points = COALESCE(total_points, 0) + NEW.points_awarded,
        current_points = COALESCE(current_points, 0) + NEW.points_awarded
    WHERE participant_code = NEW.participant_code;

    -- Aggiorna punti squadra
    IF NEW.team_id IS NOT NULL THEN
      UPDATE game_teams
      SET total_points = total_points + NEW.points_awarded
      WHERE id = NEW.team_id;
    END IF;

    -- Inserisci messaggio sistema in chat
    INSERT INTO game_chat_messages_game (nickname, message, message_type, team_id)
    SELECT
      'Sistema',
      CASE
        WHEN NEW.validation_type = 'clue' THEN
          '🎯 La squadra ' || gt.team_name || ' ha trovato un indizio!'
        WHEN NEW.validation_type = 'challenge' THEN
          '🏆 La squadra ' || gt.team_name || ' ha completato una sfida!'
        ELSE
          '✨ ' || gt.team_name || ' ha guadagnato ' || NEW.points_awarded || ' punti!'
      END,
      'system',
      NEW.team_id
    FROM game_teams gt
    WHERE gt.id = NEW.team_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_on_validation_success ON game_clue_validations;
CREATE TRIGGER trigger_on_validation_success
  AFTER INSERT ON game_clue_validations
  FOR EACH ROW
  EXECUTE FUNCTION on_validation_success();

-- ============================================
-- 1.7 AGGIUNGI solution_code alla tabella clues
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clues' AND column_name = 'solution_code'
  ) THEN
    ALTER TABLE clues ADD COLUMN solution_code VARCHAR(50);
  END IF;
END $$;

-- ============================================
-- 1.8 TRIGGER: Assegna 50 punti bonus quando cerimonia completata
-- ============================================
CREATE OR REPLACE FUNCTION on_ceremony_completed()
RETURNS TRIGGER AS $$
BEGIN
  -- Se ceremony_completed passa da FALSE a TRUE
  IF NEW.ceremony_completed = TRUE AND (OLD.ceremony_completed = FALSE OR OLD.ceremony_completed IS NULL) THEN
    -- Assegna 50 punti a tutti i partecipanti (escluso SYSTEM)
    UPDATE game_participants
    SET total_points = COALESCE(total_points, 0) + 50,
        current_points = COALESCE(current_points, 0) + 50
    WHERE participant_code != 'SYSTEM';

    -- Aggiorna anche i punti delle squadre
    UPDATE game_teams gt
    SET total_points = total_points + (
      SELECT COUNT(*) * 50
      FROM game_participants gp
      WHERE gp.team_id = gt.id AND gp.participant_code != 'SYSTEM'
    );

    -- Inserisci messaggio di sistema nella chat
    INSERT INTO game_chat_messages_game (nickname, message, message_type)
    VALUES ('Sistema', '🎉 La cerimonia è completata! Tutti i partecipanti guadagnano 50 punti bonus! Il gioco ha inizio!', 'system');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_on_ceremony_completed ON game_state;
CREATE TRIGGER trigger_on_ceremony_completed
  AFTER UPDATE ON game_state
  FOR EACH ROW
  EXECUTE FUNCTION on_ceremony_completed();

-- ============================================
-- COMPLETATO! ✅
-- ============================================
--
-- Tabelle create:
-- - game_teams (4 squadre)
-- - game_chat_messages_game (chat con squadre)
-- - game_clue_validations (validazioni punti)
-- - game_state (stato gioco)
--
-- Modifiche:
-- - game_participants.team_id aggiunto
-- - clues.solution_code aggiunto
-- - Trigger per punti automatici (validazioni)
-- - Trigger per punti bonus cerimonia
--
-- ============================================
