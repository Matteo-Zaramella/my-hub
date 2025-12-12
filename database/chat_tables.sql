-- ============================================
-- CHAT SYSTEM TABLES FOR THE GAME
-- Created: 2025-11-11
-- ============================================

-- 1. User Profiles Table
-- Store additional user information beyond auth.users
CREATE TABLE IF NOT EXISTS game_user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_original_participant BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Chat Messages Table
-- Store all chat messages with real-time support
CREATE TABLE IF NOT EXISTS game_chat_messages (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_system_message BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Chat Reactions Table (Optional - for future)
-- Allow users to react to messages with emojis
CREATE TABLE IF NOT EXISTS game_chat_reactions (
  id BIGSERIAL PRIMARY KEY,
  message_id BIGINT REFERENCES game_chat_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Index for fetching messages efficiently
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON game_chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON game_chat_messages(user_id);

-- Index for user profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON game_user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_online ON game_user_profiles(is_online) WHERE is_online = TRUE;

-- Index for reactions
CREATE INDEX IF NOT EXISTS idx_chat_reactions_message_id ON game_chat_reactions(message_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE game_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_chat_reactions ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
-- Everyone can view profiles
CREATE POLICY "Anyone can view user profiles"
  ON game_user_profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON game_user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON game_user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Chat Messages Policies
-- Everyone can read messages
CREATE POLICY "Anyone can view chat messages"
  ON game_chat_messages FOR SELECT
  USING (true);

-- Authenticated users can send messages
CREATE POLICY "Authenticated users can send messages"
  ON game_chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own messages (for 5 minutes)
CREATE POLICY "Users can update own recent messages"
  ON game_chat_messages FOR UPDATE
  USING (
    auth.uid() = user_id
    AND created_at > NOW() - INTERVAL '5 minutes'
  );

-- Users can delete their own messages (for 5 minutes)
CREATE POLICY "Users can delete own recent messages"
  ON game_chat_messages FOR DELETE
  USING (
    auth.uid() = user_id
    AND created_at > NOW() - INTERVAL '5 minutes'
  );

-- Chat Reactions Policies
-- Everyone can view reactions
CREATE POLICY "Anyone can view reactions"
  ON game_chat_reactions FOR SELECT
  USING (true);

-- Authenticated users can add reactions
CREATE POLICY "Authenticated users can add reactions"
  ON game_chat_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their own reactions
CREATE POLICY "Users can remove own reactions"
  ON game_chat_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS FOR AUTOMATIC UPDATES
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON game_user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at
  BEFORE UPDATE ON game_chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- REALTIME PUBLICATION
-- ============================================

-- Enable realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE game_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE game_user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE game_chat_reactions;

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert system user profile (for system messages)
-- This will be used for automatic messages like "Chat attivata!"
-- Note: You'll need to create a system user in auth.users first, or handle system messages differently

-- ============================================
-- HELPFUL QUERIES
-- ============================================

-- View recent messages with user info
-- SELECT
--   cm.id,
--   cm.message,
--   cm.created_at,
--   up.display_name,
--   up.is_online
-- FROM game_chat_messages cm
-- LEFT JOIN game_user_profiles up ON cm.user_id = up.user_id
-- ORDER BY cm.created_at DESC
-- LIMIT 50;

-- Count online users
-- SELECT COUNT(*) FROM game_user_profiles WHERE is_online = TRUE;

-- Get message with reactions
-- SELECT
--   cm.id,
--   cm.message,
--   cm.created_at,
--   up.display_name,
--   json_agg(
--     json_build_object(
--       'emoji', cr.emoji,
--       'user_id', cr.user_id
--     )
--   ) FILTER (WHERE cr.id IS NOT NULL) as reactions
-- FROM game_chat_messages cm
-- LEFT JOIN game_user_profiles up ON cm.user_id = up.user_id
-- LEFT JOIN game_chat_reactions cr ON cm.id = cr.message_id
-- GROUP BY cm.id, cm.message, cm.created_at, up.display_name
-- ORDER BY cm.created_at DESC;
