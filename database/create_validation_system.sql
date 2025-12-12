-- 🔐 Sistema Validazione Risposte - SQL Setup
-- Data: 3 Dicembre 2025
-- Ref: SISTEMA_VALIDAZIONE_RISPOSTE.md

-- ============================================
-- STEP 1: Aggiungi campi answer_code
-- ============================================

-- Aggiungi answer_code a game_clues (33 indizi totali)
ALTER TABLE game_clues
ADD COLUMN IF NOT EXISTS answer_code VARCHAR(30) UNIQUE;

-- Aggiungi answer_code a game_challenges (11 sfide totali)
ALTER TABLE game_challenges
ADD COLUMN IF NOT EXISTS answer_code VARCHAR(30) UNIQUE;

-- Indexes per performance
CREATE INDEX IF NOT EXISTS idx_game_clues_answer_code ON game_clues(answer_code);
CREATE INDEX IF NOT EXISTS idx_game_challenges_answer_code ON game_challenges(answer_code);

-- ============================================
-- STEP 2: Crea tabella clue_submissions
-- ============================================

CREATE TABLE IF NOT EXISTS clue_submissions (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER REFERENCES game_participants(id) ON DELETE CASCADE,
  clue_id INTEGER REFERENCES game_clues(id) ON DELETE CASCADE,
  submitted_code VARCHAR(30) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW(),
  points_awarded INTEGER DEFAULT 0,
  rank_position INTEGER, -- Posizione in classifica quando ha risposto
  ip_address INET, -- Per anti-cheating
  user_agent TEXT, -- Per analytics

  -- Prevent duplicate correct submissions
  UNIQUE(participant_id, clue_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_clue_submissions_participant ON clue_submissions(participant_id);
CREATE INDEX IF NOT EXISTS idx_clue_submissions_clue ON clue_submissions(clue_id);
CREATE INDEX IF NOT EXISTS idx_clue_submissions_correct ON clue_submissions(is_correct, submitted_at);
CREATE INDEX IF NOT EXISTS idx_clue_submissions_timestamp ON clue_submissions(submitted_at);

-- ============================================
-- STEP 3: Crea tabella challenge_submissions
-- ============================================

CREATE TABLE IF NOT EXISTS challenge_submissions (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER REFERENCES game_participants(id) ON DELETE CASCADE,
  challenge_id INTEGER REFERENCES game_challenges(id) ON DELETE CASCADE,
  submitted_code VARCHAR(30) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW(),
  points_awarded INTEGER DEFAULT 0,
  rank_position INTEGER,
  ip_address INET,
  user_agent TEXT,

  -- Prevent duplicate correct submissions
  UNIQUE(participant_id, challenge_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_participant ON challenge_submissions(participant_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_challenge ON challenge_submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_correct ON challenge_submissions(is_correct, submitted_at);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_timestamp ON challenge_submissions(submitted_at);

-- ============================================
-- STEP 4: RLS Policies
-- ============================================

-- Enable RLS on clue_submissions
ALTER TABLE clue_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Participants can view own clue submissions" ON clue_submissions;
DROP POLICY IF EXISTS "Participants can insert own clue submissions" ON clue_submissions;
DROP POLICY IF EXISTS "Users can view all clue submissions" ON clue_submissions;

-- Tutti possono vedere tutte le submissions (per leaderboard pubblico)
CREATE POLICY "Users can view all clue submissions"
  ON clue_submissions FOR SELECT
  USING (true);

-- Partecipanti possono inserire solo le proprie submissions
CREATE POLICY "Participants can insert own clue submissions"
  ON clue_submissions FOR INSERT
  WITH CHECK (
    participant_id IN (
      SELECT id FROM game_participants
      WHERE participant_code = current_setting('request.jwt.claims', true)::json->>'participantCode'
    )
  );

-- Enable RLS on challenge_submissions
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Participants can view own challenge submissions" ON challenge_submissions;
DROP POLICY IF EXISTS "Participants can insert own challenge submissions" ON challenge_submissions;
DROP POLICY IF EXISTS "Users can view all challenge submissions" ON challenge_submissions;

-- Tutti possono vedere tutte le submissions (per leaderboard pubblico)
CREATE POLICY "Users can view all challenge submissions"
  ON challenge_submissions FOR SELECT
  USING (true);

CREATE POLICY "Participants can insert own challenge submissions"
  ON challenge_submissions FOR INSERT
  WITH CHECK (
    participant_id IN (
      SELECT id FROM game_participants
      WHERE participant_code = current_setting('request.jwt.claims', true)::json->>'participantCode'
    )
  );

-- ============================================
-- STEP 5: View per leaderboard
-- ============================================

CREATE OR REPLACE VIEW participant_total_scores AS
SELECT
  p.id AS participant_id,
  p.participant_name,
  p.participant_code,
  COALESCE(SUM(CASE WHEN cs.is_correct THEN cs.points_awarded ELSE 0 END), 0) AS clue_points,
  COALESCE(SUM(CASE WHEN chs.is_correct THEN chs.points_awarded ELSE 0 END), 0) AS challenge_points,
  COALESCE(p.current_points, 0) AS ceremony_points,
  COALESCE(SUM(CASE WHEN cs.is_correct THEN cs.points_awarded ELSE 0 END), 0) +
  COALESCE(SUM(CASE WHEN chs.is_correct THEN chs.points_awarded ELSE 0 END), 0) +
  COALESCE(p.current_points, 0) AS total_points,
  COUNT(CASE WHEN cs.is_correct THEN 1 END) AS clues_solved,
  COUNT(CASE WHEN chs.is_correct THEN 1 END) AS challenges_completed
FROM game_participants p
LEFT JOIN clue_submissions cs ON cs.participant_id = p.id
LEFT JOIN challenge_submissions chs ON chs.participant_id = p.id
GROUP BY p.id, p.participant_name, p.participant_code, p.current_points
ORDER BY total_points DESC;

-- ============================================
-- STEP 6: Function calcolo punti indizio
-- ============================================

CREATE OR REPLACE FUNCTION calculate_clue_points(rank_pos INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Formula: max(1000 - (posizione - 1) * 50, 450)
  -- 1° = 1000, 2° = 950, 3° = 900, ... ultimo (52°) = 450
  RETURN GREATEST(1000 - (rank_pos - 1) * 50, 450);
END;
$$;

-- ============================================
-- STEP 7: Function calcolo punti sfida
-- ============================================

CREATE OR REPLACE FUNCTION calculate_challenge_points(rank_pos INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Formula: max(1200 - (posizione - 1) * 60, 540)
  -- 1° = 1200, 2° = 1140, 3° = 1080, ... ultimo (52°) = 540
  RETURN GREATEST(1200 - (rank_pos - 1) * 60, 540);
END;
$$;

-- ============================================
-- STEP 8: Trigger auto-calcolo rank e punti
-- ============================================

-- Function che calcola rank e punti automaticamente per clue
CREATE OR REPLACE FUNCTION auto_calculate_clue_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  current_rank INTEGER;
  points INTEGER;
BEGIN
  IF NEW.is_correct THEN
    -- Conta quanti hanno già risposto correttamente PRIMA di questo
    SELECT COUNT(*) + 1 INTO current_rank
    FROM clue_submissions
    WHERE clue_id = NEW.clue_id
      AND is_correct = true
      AND submitted_at < NEW.submitted_at;

    -- Calcola punti
    points := calculate_clue_points(current_rank);

    -- Aggiorna NEW record
    NEW.rank_position := current_rank;
    NEW.points_awarded := points;
  ELSE
    NEW.rank_position := NULL;
    NEW.points_awarded := 0;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger su clue_submissions
DROP TRIGGER IF EXISTS trigger_auto_calculate_clue_submission ON clue_submissions;
CREATE TRIGGER trigger_auto_calculate_clue_submission
  BEFORE INSERT ON clue_submissions
  FOR EACH ROW
  EXECUTE FUNCTION auto_calculate_clue_submission();

-- Function che calcola rank e punti automaticamente per challenge
CREATE OR REPLACE FUNCTION auto_calculate_challenge_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  current_rank INTEGER;
  points INTEGER;
BEGIN
  IF NEW.is_correct THEN
    -- Conta quanti hanno già risposto correttamente PRIMA di questo
    SELECT COUNT(*) + 1 INTO current_rank
    FROM challenge_submissions
    WHERE challenge_id = NEW.challenge_id
      AND is_correct = true
      AND submitted_at < NEW.submitted_at;

    -- Calcola punti
    points := calculate_challenge_points(current_rank);

    -- Aggiorna NEW record
    NEW.rank_position := current_rank;
    NEW.points_awarded := points;
  ELSE
    NEW.rank_position := NULL;
    NEW.points_awarded := 0;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger su challenge_submissions
DROP TRIGGER IF EXISTS trigger_auto_calculate_challenge_submission ON challenge_submissions;
CREATE TRIGGER trigger_auto_calculate_challenge_submission
  BEFORE INSERT ON challenge_submissions
  FOR EACH ROW
  EXECUTE FUNCTION auto_calculate_challenge_submission();

-- ============================================
-- STEP 9: Comments per documentazione
-- ============================================

COMMENT ON TABLE clue_submissions IS 'Traccia tutti i tentativi di validazione indizi (corretti e errati)';
COMMENT ON TABLE challenge_submissions IS 'Traccia tutti i tentativi di validazione sfide (corretti e errati)';
COMMENT ON COLUMN clue_submissions.submitted_code IS 'Codice 30 caratteri inserito dal partecipante (case-sensitive)';
COMMENT ON COLUMN clue_submissions.is_correct IS 'True se submitted_code match esatto con game_clues.answer_code';
COMMENT ON COLUMN clue_submissions.rank_position IS 'Posizione in classifica (1=primo, 2=secondo, etc)';
COMMENT ON COLUMN clue_submissions.points_awarded IS 'Punti assegnati (max 1000 per indizi, formula decrescente)';

-- ============================================
-- VERIFICA FINALE
-- ============================================

-- Test: Conta le tabelle create
SELECT
  'clue_submissions' AS table_name,
  COUNT(*) AS column_count
FROM information_schema.columns
WHERE table_name = 'clue_submissions'
UNION ALL
SELECT
  'challenge_submissions',
  COUNT(*)
FROM information_schema.columns
WHERE table_name = 'challenge_submissions';

-- Test: Verifica functions
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name IN ('calculate_clue_points', 'calculate_challenge_points', 'auto_calculate_clue_submission', 'auto_calculate_challenge_submission');

-- Test: Verifica view
SELECT table_name, view_definition
FROM information_schema.views
WHERE table_name = 'participant_total_scores';

-- ============================================
-- NOTES
-- ============================================

-- ⚠️ IMPORTANTE:
-- 1. Dopo eseguire questo SQL, eseguire scripts/populate-answer-codes.mjs
-- 2. Generare 47 password NordPass (30 char, no simboli)
-- 3. Testare validazione con partecipanti di test
-- 4. Verificare RLS policies con utenti non-admin

-- 📊 STATISTICS:
-- - Tabelle create: 2 (clue_submissions, challenge_submissions)
-- - Functions create: 4 (calcolo punti + trigger handlers)
-- - Views create: 1 (participant_total_scores)
-- - Policies RLS: 6 (3 per tabella)
-- - Triggers: 2 (auto-calcolo punti)
-- - Indexes: 8 (performance ottimizzata)
