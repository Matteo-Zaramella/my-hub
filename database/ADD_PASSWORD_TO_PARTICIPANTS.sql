-- ADD PASSWORD TO PARTICIPANTS
-- Aggiunge campi nickname e password per autenticazione partecipanti

-- 1. Aggiungi colonna 'nickname' se non esiste
ALTER TABLE game_participants
ADD COLUMN IF NOT EXISTS nickname TEXT;

COMMENT ON COLUMN game_participants.nickname IS 'Soprannome scelto dal partecipante durante la registrazione';

-- 2. Aggiungi colonna 'password' (hash bcrypt)
ALTER TABLE game_participants
ADD COLUMN IF NOT EXISTS password TEXT;

COMMENT ON COLUMN game_participants.password IS 'Password hash per autenticazione (bcrypt)';

-- 3. Rendi nickname UNIQUE per permettere login con nickname o email
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'idx_game_participants_nickname'
  ) THEN
    CREATE UNIQUE INDEX idx_game_participants_nickname
    ON game_participants(nickname)
    WHERE nickname IS NOT NULL;
  END IF;
END $$;

-- 4. Verifica struttura tabella
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'game_participants'
AND column_name IN ('nickname', 'password', 'email', 'name')
ORDER BY ordinal_position;
