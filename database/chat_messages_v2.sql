-- ============================================
-- CHAT MESSAGES V2 - Simplified for Participants
-- Created: 2025-11-11
-- ============================================

-- Chat Messages Table V2 (semplificata)
-- Store all chat messages with participant info
CREATE TABLE IF NOT EXISTS game_chat_messages_v2 (
  id BIGSERIAL PRIMARY KEY,
  participant_id INTEGER NOT NULL REFERENCES game_participants(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  participant_code TEXT NOT NULL,
  message TEXT NOT NULL,
  is_system_message BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_chat_v2_created_at ON game_chat_messages_v2(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_v2_participant_id ON game_chat_messages_v2(participant_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE game_chat_messages_v2 ENABLE ROW LEVEL SECURITY;

-- Everyone can read messages (public chat)
CREATE POLICY "Anyone can view chat messages v2"
  ON game_chat_messages_v2 FOR SELECT
  USING (true);

-- Anyone can send messages (we verify participant_id client-side)
CREATE POLICY "Anyone can send messages v2"
  ON game_chat_messages_v2 FOR INSERT
  WITH CHECK (true);

-- ============================================
-- REALTIME PUBLICATION
-- ============================================

-- Enable realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE game_chat_messages_v2;

-- ============================================
-- INITIAL SYSTEM MESSAGE
-- ============================================

-- Insert welcome message
INSERT INTO game_chat_messages_v2 (participant_id, participant_name, participant_code, message, is_system_message)
SELECT 1, 'Sistema', 'SYSTEM', '🎉 Benvenuti nella chat di gruppo di The Game! Qui potrete comunicare con tutti i partecipanti in tempo reale.', true
WHERE NOT EXISTS (SELECT 1 FROM game_chat_messages_v2 WHERE is_system_message = true LIMIT 1);

-- ============================================
-- HELPFUL QUERIES
-- ============================================

-- View recent messages
-- SELECT
--   id,
--   participant_name,
--   message,
--   created_at
-- FROM game_chat_messages_v2
-- ORDER BY created_at DESC
-- LIMIT 50;

-- Count messages per participant
-- SELECT
--   participant_name,
--   COUNT(*) as message_count
-- FROM game_chat_messages_v2
-- WHERE is_system_message = false
-- GROUP BY participant_name
-- ORDER BY message_count DESC;
