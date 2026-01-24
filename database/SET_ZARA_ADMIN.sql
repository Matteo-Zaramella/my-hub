-- Imposta ZARA come admin/organizzatore
-- Esegui su Supabase SQL Editor

-- 1. Aggiungi colonna is_admin
ALTER TABLE game_participants ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Imposta ZARA (id=71) come admin
UPDATE game_participants SET is_admin = TRUE WHERE id = 71;

-- 3. Rimuovi ZARA dalla squadra (superpartes)
UPDATE game_participants SET team_id = NULL WHERE id = 71;

-- 4. Verifica
SELECT id, nickname, is_admin, team_id FROM game_participants WHERE id = 71;
