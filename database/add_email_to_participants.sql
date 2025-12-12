-- Add email column to game_participants
ALTER TABLE game_participants
ADD COLUMN IF NOT EXISTS email TEXT;

-- Add index for email searches
CREATE INDEX IF NOT EXISTS idx_game_participants_email ON game_participants(email);

COMMENT ON COLUMN game_participants.email IS 'Email del partecipante';
