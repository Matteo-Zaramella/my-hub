-- ============================================
-- Add Gaia Zordan as New Participant
-- Created: 2025-11-11
-- ============================================

-- Note: Replace USER_ID with the actual user_id from your dashboard
-- You can find it by running: SELECT id FROM auth.users LIMIT 1;

-- Add Gaia Zordan
INSERT INTO game_participants (
  user_id,
  participant_name,
  phone_number,
  instagram_handle,
  category,
  participant_code,
  notes,
  is_couple,
  current_points
)
VALUES (
  (SELECT user_id FROM game_participants LIMIT 1), -- Uses same user_id as other participants
  'Gaia Zordan',
  NULL, -- Add phone if available
  NULL, -- Add Instagram handle if available
  'Vigodarzere',
  'GZRD01', -- Unique code for Gaia Zordan
  'Nuova invitata - Gruppo Vigodarzere',
  FALSE, -- Set to TRUE if in couple
  0
)
ON CONFLICT (participant_code) DO NOTHING;

-- Verify insertion
SELECT participant_name, category, participant_code
FROM game_participants
WHERE participant_name = 'Gaia Zordan';
