-- CORREZIONE DEFINITIVA EVENTI
-- 25/01/2026 = CERIMONIA APERTURA (non Sfida 1)
-- 27/12/2026 = SFIDA 12 (non Serata Finale)
-- 23/01/2027 = SERATA FINALE

-- Correggi evento 25/01 -> Cerimonia Apertura
UPDATE game_challenges
SET title = 'Cerimonia Apertura',
    description = 'Serata di apertura del gioco',
    updated_at = NOW()
WHERE challenge_number = 1;

-- Correggi evento 27/12 -> Sfida 12 (se il titolo era sbagliato)
UPDATE game_challenges
SET title = 'Sfida 12',
    description = 'Descrizione della Sfida 12',
    updated_at = NOW()
WHERE challenge_number = 12;

-- Verifica finale
SELECT challenge_number, title, start_date, description
FROM game_challenges
ORDER BY challenge_number;
