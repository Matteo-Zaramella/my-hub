-- =============================================
-- FASE 3: ASSEGNAZIONE AUTOMATICA SQUADRE
-- Eseguire su Supabase SQL Editor
-- Data: 24/01/2026
-- =============================================

-- 1. Funzione per assegnare automaticamente una squadra
-- Assegna alla squadra con meno membri
CREATE OR REPLACE FUNCTION assign_team_to_participant()
RETURNS TRIGGER AS $$
DECLARE
  selected_team_id INT;
BEGIN
  -- Se team_id è già assegnato, non fare nulla
  IF NEW.team_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Trova la squadra con meno membri
  SELECT t.id INTO selected_team_id
  FROM game_teams t
  LEFT JOIN game_participants p ON p.team_id = t.id
  GROUP BY t.id
  ORDER BY COUNT(p.id) ASC, t.id ASC
  LIMIT 1;

  -- Assegna la squadra
  NEW.team_id := selected_team_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Trigger per assegnazione automatica alla registrazione
DROP TRIGGER IF EXISTS trigger_assign_team ON game_participants;
CREATE TRIGGER trigger_assign_team
  BEFORE INSERT ON game_participants
  FOR EACH ROW
  EXECUTE FUNCTION assign_team_to_participant();

-- 3. Assegna squadre a tutti i partecipanti esistenti senza squadra
-- Distribuisce equamente tra le 4 squadre
DO $$
DECLARE
  participant RECORD;
  team_counts INT[];
  min_team_id INT;
  min_count INT;
BEGIN
  -- Inizializza conteggi
  team_counts := ARRAY[0, 0, 0, 0];

  -- Conta membri esistenti per squadra
  FOR i IN 1..4 LOOP
    SELECT COUNT(*) INTO team_counts[i]
    FROM game_participants
    WHERE team_id = i;
  END LOOP;

  -- Per ogni partecipante senza squadra
  FOR participant IN
    SELECT id FROM game_participants WHERE team_id IS NULL ORDER BY id
  LOOP
    -- Trova squadra con meno membri
    min_count := team_counts[1];
    min_team_id := 1;
    FOR i IN 2..4 LOOP
      IF team_counts[i] < min_count THEN
        min_count := team_counts[i];
        min_team_id := i;
      END IF;
    END LOOP;

    -- Assegna
    UPDATE game_participants SET team_id = min_team_id WHERE id = participant.id;
    team_counts[min_team_id] := team_counts[min_team_id] + 1;
  END LOOP;
END $$;

-- 4. Verifica distribuzione
SELECT
  t.team_code,
  t.team_name,
  COUNT(p.id) AS membri
FROM game_teams t
LEFT JOIN game_participants p ON p.team_id = t.id
GROUP BY t.id, t.team_code, t.team_name
ORDER BY t.id;
