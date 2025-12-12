-- ============================================
-- Add current_points column to game_participants
-- Created: 2025-11-11
-- ============================================

-- Add current_points column with default value 0
ALTER TABLE game_participants
ADD COLUMN IF NOT EXISTS current_points INTEGER DEFAULT 0 NOT NULL;

-- Create index for performance when sorting by points
CREATE INDEX IF NOT EXISTS idx_game_participants_points ON game_participants(current_points DESC);

-- Add comment
COMMENT ON COLUMN game_participants.current_points IS 'Punteggio corrente del partecipante in The Game';
