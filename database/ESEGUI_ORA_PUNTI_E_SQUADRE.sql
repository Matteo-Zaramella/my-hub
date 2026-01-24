-- =============================================
-- ESEGUI TUTTO SU SUPABASE SQL EDITOR
-- Data: 24/01/2026
-- =============================================

-- PARTE 1: COLONNA PUNTI INDIVIDUALI
ALTER TABLE game_participants ADD COLUMN IF NOT EXISTS individual_points INT DEFAULT 0;

-- PARTE 2: TABELLA PUNTI
CREATE TABLE IF NOT EXISTS game_points (
  id SERIAL PRIMARY KEY,
  participant_id INT REFERENCES game_participants(id) ON DELETE CASCADE,
  team_id INT REFERENCES game_teams(id) ON DELETE CASCADE,
  points INT NOT NULL DEFAULT 0,
  reason TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici
CREATE INDEX IF NOT EXISTS idx_game_points_participant ON game_points(participant_id);
CREATE INDEX IF NOT EXISTS idx_game_points_team ON game_points(team_id);
CREATE INDEX IF NOT EXISTS idx_game_points_reason ON game_points(reason);

-- RLS
ALTER TABLE game_points ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "game_points_select_all" ON game_points;
CREATE POLICY "game_points_select_all" ON game_points FOR SELECT USING (true);
DROP POLICY IF EXISTS "game_points_insert_service" ON game_points;
CREATE POLICY "game_points_insert_service" ON game_points FOR INSERT WITH CHECK (true);

-- PARTE 3: FUNZIONE AGGIORNAMENTO PUNTI
CREATE OR REPLACE FUNCTION update_team_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE game_teams
  SET total_points = (
    SELECT COALESCE(SUM(points), 0)
    FROM game_points
    WHERE team_id = NEW.team_id
  )
  WHERE id = NEW.team_id;

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

DROP TRIGGER IF EXISTS trigger_update_team_points ON game_points;
CREATE TRIGGER trigger_update_team_points
  AFTER INSERT ON game_points
  FOR EACH ROW
  EXECUTE FUNCTION update_team_points();

-- PARTE 4: ASSEGNAZIONE AUTOMATICA SQUADRE (per nuove registrazioni)
CREATE OR REPLACE FUNCTION assign_team_to_participant()
RETURNS TRIGGER AS $$
DECLARE
  selected_team_id INT;
BEGIN
  IF NEW.team_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  SELECT t.id INTO selected_team_id
  FROM game_teams t
  LEFT JOIN game_participants p ON p.team_id = t.id
  GROUP BY t.id
  ORDER BY COUNT(p.id) ASC, t.id ASC
  LIMIT 1;

  NEW.team_id := selected_team_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_assign_team ON game_participants;
CREATE TRIGGER trigger_assign_team
  BEFORE INSERT ON game_participants
  FOR EACH ROW
  EXECUTE FUNCTION assign_team_to_participant();

-- PARTE 5: ASSEGNA SQUADRE AI PARTECIPANTI ESISTENTI (semplificato)
-- Assegna in ordine round-robin
UPDATE game_participants SET team_id = 1 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 2 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 3 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 4 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 1 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 2 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 3 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 4 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 1 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 2 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 3 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 4 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 1 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 2 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 3 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 4 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 1 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 2 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 3 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 4 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 1 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 2 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 3 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);
UPDATE game_participants SET team_id = 4 WHERE team_id IS NULL AND id IN (
  SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id LIMIT 1 OFFSET 0
);

-- PARTE 6: VISTE CLASSIFICA
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

-- VERIFICA FINALE
SELECT
  t.team_code,
  t.team_name,
  COUNT(p.id) AS membri
FROM game_teams t
LEFT JOIN game_participants p ON p.team_id = t.id
GROUP BY t.id, t.team_code, t.team_name
ORDER BY t.id;
