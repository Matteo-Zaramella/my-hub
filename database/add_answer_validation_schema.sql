-- =====================================================
-- SCHEMA UPDATE: Sistema Validazione Risposte
-- =====================================================
-- Aggiunge colonne answer_code e tabelle submissions
-- per il sistema di validazione automatico
-- Data: 28 Novembre 2025
-- =====================================================

-- 1. Aggiungi colonna answer_code a game_clues
-- =====================================================
ALTER TABLE game_clues
ADD COLUMN IF NOT EXISTS answer_code VARCHAR(30) NULL;

-- 2. Aggiungi colonna answer_code a game_challenges
-- =====================================================
ALTER TABLE game_challenges
ADD COLUMN IF NOT EXISTS answer_code VARCHAR(30) NULL;

-- 3. Crea tabella clue_submissions
-- =====================================================
CREATE TABLE IF NOT EXISTS clue_submissions (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER NOT NULL REFERENCES game_participants(id) ON DELETE CASCADE,
  clue_id INTEGER NOT NULL REFERENCES game_clues(id) ON DELETE CASCADE,
  submitted_code VARCHAR(30) NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  submission_rank INTEGER NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraint: un partecipante può validare un indizio una sola volta
  CONSTRAINT unique_participant_clue UNIQUE (participant_id, clue_id)
);

-- Index per performance
CREATE INDEX IF NOT EXISTS idx_clue_submissions_participant ON clue_submissions(participant_id);
CREATE INDEX IF NOT EXISTS idx_clue_submissions_clue ON clue_submissions(clue_id);
CREATE INDEX IF NOT EXISTS idx_clue_submissions_submitted_at ON clue_submissions(submitted_at);

-- 4. Crea tabella challenge_submissions
-- =====================================================
CREATE TABLE IF NOT EXISTS challenge_submissions (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER NOT NULL REFERENCES game_participants(id) ON DELETE CASCADE,
  challenge_id INTEGER NOT NULL REFERENCES game_challenges(id) ON DELETE CASCADE,
  submitted_code VARCHAR(30) NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  submission_rank INTEGER NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraint: un partecipante può validare una sfida una sola volta
  CONSTRAINT unique_participant_challenge UNIQUE (participant_id, challenge_id)
);

-- Index per performance
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_participant ON challenge_submissions(participant_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_challenge ON challenge_submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_submitted_at ON challenge_submissions(submitted_at);

-- 5. Commenti sulle tabelle
-- =====================================================
COMMENT ON TABLE clue_submissions IS 'Traccia validazioni indizi da parte dei partecipanti';
COMMENT ON TABLE challenge_submissions IS 'Traccia validazioni sfide da parte dei partecipanti';

COMMENT ON COLUMN game_clues.answer_code IS 'Codice validazione indizio (30 caratteri, case-sensitive)';
COMMENT ON COLUMN game_challenges.answer_code IS 'Codice validazione sfida (30 caratteri, case-sensitive)';

COMMENT ON COLUMN clue_submissions.submitted_code IS 'Codice inserito dal partecipante (perfect match)';
COMMENT ON COLUMN clue_submissions.points_earned IS 'Punti guadagnati in base al rank di inserimento';
COMMENT ON COLUMN clue_submissions.submission_rank IS 'Posizione in classifica (1=primo a validare)';

COMMENT ON COLUMN challenge_submissions.submitted_code IS 'Codice inserito dal partecipante (perfect match)';
COMMENT ON COLUMN challenge_submissions.points_earned IS 'Punti guadagnati in base al rank di inserimento';
COMMENT ON COLUMN challenge_submissions.submission_rank IS 'Posizione in classifica (1=primo a validare)';

-- 6. Row Level Security (RLS)
-- =====================================================

-- Abilita RLS sulle nuove tabelle
ALTER TABLE clue_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: i partecipanti possono vedere solo le proprie submissions
CREATE POLICY "Participants can view own clue submissions"
  ON clue_submissions
  FOR SELECT
  USING (
    participant_id IN (
      SELECT id FROM game_participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can view own challenge submissions"
  ON challenge_submissions
  FOR SELECT
  USING (
    participant_id IN (
      SELECT id FROM game_participants
      WHERE user_id = auth.uid()
    )
  );

-- Policy: i partecipanti possono inserire solo le proprie submissions
CREATE POLICY "Participants can insert own clue submissions"
  ON clue_submissions
  FOR INSERT
  WITH CHECK (
    participant_id IN (
      SELECT id FROM game_participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can insert own challenge submissions"
  ON challenge_submissions
  FOR INSERT
  WITH CHECK (
    participant_id IN (
      SELECT id FROM game_participants
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Admin può vedere tutto (assumendo role admin)
-- Se non hai un sistema di ruoli, rimuovi questa policy
CREATE POLICY "Admin can view all clue submissions"
  ON clue_submissions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admin can view all challenge submissions"
  ON challenge_submissions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- =====================================================
-- FINE SCHEMA UPDATE
-- =====================================================

-- Verifica:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'game_clues';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'game_challenges';
-- SELECT * FROM clue_submissions;
-- SELECT * FROM challenge_submissions;
