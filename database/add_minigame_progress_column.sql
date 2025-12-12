-- Add minigame_progress column to game_participants table
-- This column stores an array of completed game numbers (1-5)
-- Example: [1, 2] means games 1 and 2 are completed

ALTER TABLE game_participants
ADD COLUMN IF NOT EXISTS minigame_progress INTEGER[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN game_participants.minigame_progress IS 'Array of completed minigame numbers (1-5) for February 2026 challenge';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_minigame_progress ON game_participants USING GIN (minigame_progress);
