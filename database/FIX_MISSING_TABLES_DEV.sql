-- ============================================
-- FIX MISSING TABLES - DATABASE DEV
-- ============================================
-- Questo script aggiunge/rinomina le tabelle che il codice si aspetta
-- ============================================

-- 1. Rinomina 'challenges' in 'game_challenges' (se esiste)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'challenges') THEN
    ALTER TABLE challenges RENAME TO game_challenges;
  END IF;
END $$;

-- 2. Aggiungi colonne mancanti a game_challenges
ALTER TABLE game_challenges
ADD COLUMN IF NOT EXISTS title TEXT;

ALTER TABLE game_challenges
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE game_challenges
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE;

ALTER TABLE game_challenges
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;

ALTER TABLE game_challenges
ADD COLUMN IF NOT EXISTS answer_code TEXT;

ALTER TABLE game_challenges
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Copia dati dalle colonne vecchie alle nuove
UPDATE game_challenges SET title = challenge_name WHERE title IS NULL;
UPDATE game_challenges SET description = challenge_description WHERE description IS NULL;
UPDATE game_challenges SET start_date = challenge_date WHERE start_date IS NULL;
UPDATE game_challenges SET end_date = challenge_date + INTERVAL '2 days' WHERE end_date IS NULL;

CREATE INDEX IF NOT EXISTS idx_game_challenges_number ON game_challenges(challenge_number);
CREATE INDEX IF NOT EXISTS idx_game_challenges_dates ON game_challenges(start_date, end_date);

COMMENT ON TABLE game_challenges IS '12 sfide mensili del gioco';


-- 3. Rinomina 'ceremony_clues' in 'ceremony_clue_riddles' (se esiste)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ceremony_clues') THEN
    ALTER TABLE ceremony_clues RENAME TO ceremony_clue_riddles;
  END IF;
END $$;

-- 4. Crea tabella ceremony_clue_riddles se non esiste
CREATE TABLE IF NOT EXISTS ceremony_clue_riddles (
  id SERIAL PRIMARY KEY,
  clue_word TEXT UNIQUE NOT NULL,
  order_number INTEGER UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT order_number_range CHECK (order_number >= 1 AND order_number <= 10)
);

CREATE INDEX IF NOT EXISTS idx_ceremony_riddles_order ON ceremony_clue_riddles(order_number);

COMMENT ON TABLE ceremony_clue_riddles IS '10 parole chiave per la cerimonia di apertura';


-- 5. Aggiorna ceremony_clues_found per usare participant_code
DROP TABLE IF EXISTS ceremony_clues_found CASCADE;

CREATE TABLE ceremony_clues_found (
  id SERIAL PRIMARY KEY,
  clue_word TEXT NOT NULL,
  participant_code TEXT DEFAULT 'GLOBAL',
  found_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clue_word, participant_code)
);

CREATE INDEX IF NOT EXISTS idx_ceremony_found_code ON ceremony_clues_found(participant_code);
CREATE INDEX IF NOT EXISTS idx_ceremony_found_word ON ceremony_clues_found(clue_word);

COMMENT ON TABLE ceremony_clues_found IS 'Traccia quali indizi cerimonia sono stati trovati (per partecipante o globale)';


-- 6. Aggiungi colonna registration_completed a game_participants
ALTER TABLE game_participants
ADD COLUMN IF NOT EXISTS registration_completed BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_participants_registration ON game_participants(registration_completed);

COMMENT ON COLUMN game_participants.registration_completed IS 'Se il partecipante ha completato la registrazione dalla landing page';


-- 7. Crea trigger per updated_at su game_challenges
CREATE OR REPLACE FUNCTION update_game_challenges_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_game_challenges_updated_at ON game_challenges;
CREATE TRIGGER update_game_challenges_updated_at
  BEFORE UPDATE ON game_challenges
  FOR EACH ROW
  EXECUTE FUNCTION update_game_challenges_timestamp();


-- ============================================
-- DATI DI TEST (opzionali)
-- ============================================

-- Inserisci una sfida di esempio per evitare errori nel countdown
INSERT INTO game_challenges (challenge_number, challenge_name, title, challenge_description, description, challenge_date, start_date, end_date, is_published)
VALUES (
  1,
  'Cerimonia di Apertura',
  'Cerimonia di Apertura',
  'Prima sfida del gioco',
  'Prima sfida del gioco',
  '2026-01-24'::DATE,
  '2026-01-24 00:00:00+00',
  '2026-01-26 23:59:59+00',
  false
)
ON CONFLICT (challenge_number) DO NOTHING;


-- ============================================
-- COMPLETATO! ✅
-- ============================================
