-- =============================================
-- FASE 2: SISTEMA PUNTI
-- Eseguire su Supabase SQL Editor
-- Data: 24/01/2026
-- =============================================

-- 1. Tabella per tracciare tutti i punti assegnati
CREATE TABLE IF NOT EXISTS game_points (
  id SERIAL PRIMARY KEY,
  participant_id INT REFERENCES game_participants(id) ON DELETE CASCADE,
  team_id INT REFERENCES game_teams(id) ON DELETE CASCADE,
  points INT NOT NULL DEFAULT 0,
  reason TEXT NOT NULL, -- 'ceremony_bonus', 'clue_found', 'challenge_completed', 'special_action'
  description TEXT, -- Descrizione opzionale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Indici per performance
CREATE INDEX IF NOT EXISTS idx_game_points_participant ON game_points(participant_id);
CREATE INDEX IF NOT EXISTS idx_game_points_team ON game_points(team_id);
CREATE INDEX IF NOT EXISTS idx_game_points_reason ON game_points(reason);

-- 3. Aggiungere colonna punti individuali ai partecipanti (se non esiste)
ALTER TABLE game_participants
ADD COLUMN IF NOT EXISTS individual_points INT DEFAULT 0;

-- 4. RLS Policies
ALTER TABLE game_points ENABLE ROW LEVEL SECURITY;

-- Tutti possono leggere i punti
CREATE POLICY "game_points_select_all" ON game_points
  FOR SELECT USING (true);

-- Solo service role può inserire/modificare
CREATE POLICY "game_points_insert_service" ON game_points
  FOR INSERT WITH CHECK (true);

-- 5. Funzione per aggiornare i punti totali
CREATE OR REPLACE FUNCTION update_team_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Aggiorna punti squadra
  UPDATE game_teams
  SET total_points = (
    SELECT COALESCE(SUM(points), 0)
    FROM game_points
    WHERE team_id = NEW.team_id
  )
  WHERE id = NEW.team_id;

  -- Aggiorna punti individuali del partecipante
  IF NEW.participant_id IS NOT NULL THEN
    UPDATE game_participants
    SET individual_points = (
      SELECT COALESCE(SUM(points), 0)
      FROM game_points
      WHERE participant_id = NEW.participant_id
    )
    WHERE id = NEW.participant_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger per aggiornare automaticamente i totali
DROP TRIGGER IF EXISTS trigger_update_team_points ON game_points;
CREATE TRIGGER trigger_update_team_points
  AFTER INSERT ON game_points
  FOR EACH ROW
  EXECUTE FUNCTION update_team_points();

-- 7. Vista per classifica squadre
CREATE OR REPLACE VIEW game_team_leaderboard AS
SELECT
  t.id,
  t.team_code,
  t.team_name,
  t.team_color,
  t.total_points,
  COUNT(p.id) AS member_count
FROM game_teams t
LEFT JOIN game_participants p ON p.team_id = t.id
GROUP BY t.id, t.team_code, t.team_name, t.team_color, t.total_points
ORDER BY t.total_points DESC;

-- 8. Vista per classifica individuale
CREATE OR REPLACE VIEW game_individual_leaderboard AS
SELECT
  p.id,
  p.nickname,
  p.individual_points,
  t.team_code,
  t.team_name,
  t.team_color
FROM game_participants p
LEFT JOIN game_teams t ON p.team_id = t.id
WHERE p.individual_points > 0
ORDER BY p.individual_points DESC;

-- =============================================
-- VERIFICA
-- =============================================
-- SELECT * FROM game_points;
-- SELECT * FROM game_team_leaderboard;
-- SELECT * FROM game_individual_leaderboard;
