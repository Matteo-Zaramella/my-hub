-- =============================================
-- RIBILANCIAMENTO SQUADRE
-- Dopo rimozione BENNY e JACKBOA
-- Data: 24/01/2026
-- =============================================

-- Situazione attuale:
-- FSB (id=1): 5 membri
-- MOSSAD (id=2): 3 membri (persi BENNY e JACKBOA)
-- MSS (id=3): 5 membri
-- AISE (id=4): 5 membri
-- Totale: 18 partecipanti + ZARA admin

-- Obiettivo: distribuzione 4-5-4-5 o simile

-- 1. Verifica situazione attuale
SELECT t.team_code, t.team_name, COUNT(p.id) as membri
FROM game_teams t
LEFT JOIN game_participants p ON p.team_id = t.id AND p.is_admin = FALSE
GROUP BY t.id, t.team_code, t.team_name
ORDER BY t.id;

-- 2. Sposta 1 membro da FSB a MOSSAD (l'ultimo iscritto)
UPDATE game_participants
SET team_id = 2
WHERE id = (
  SELECT id FROM game_participants
  WHERE team_id = 1 AND is_admin = FALSE
  ORDER BY id DESC
  LIMIT 1
);

-- 3. Sposta 1 membro da MSS a MOSSAD (l'ultimo iscritto)
UPDATE game_participants
SET team_id = 2
WHERE id = (
  SELECT id FROM game_participants
  WHERE team_id = 3 AND is_admin = FALSE
  ORDER BY id DESC
  LIMIT 1
);

-- 4. Verifica nuova distribuzione
SELECT t.team_code, t.team_name, COUNT(p.id) as membri,
       STRING_AGG(p.nickname, ', ' ORDER BY p.nickname) as partecipanti
FROM game_teams t
LEFT JOIN game_participants p ON p.team_id = t.id AND p.is_admin = FALSE
GROUP BY t.id, t.team_code, t.team_name
ORDER BY t.id;

-- Risultato atteso:
-- FSB: 4 membri
-- MOSSAD: 5 membri
-- MSS: 4 membri
-- AISE: 5 membri
