-- Enable RLS e crea policies permissive per le tabelle del gioco
-- Versione 2: Gestisce errori se policies esistono già

-- ============================================
-- GAME TABLES - ENABLE RLS
-- ============================================

-- Prima disabilitiamo RLS temporaneamente per pulire
ALTER TABLE IF EXISTS game_challenges DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS game_clues DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS game_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS game_phases DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ceremony_clues DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ceremony_clues_found DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wishlist_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;

-- Ora riabilitiamo con le policies corrette
ALTER TABLE game_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_clues ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceremony_clues ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceremony_clues_found ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES - GAME CHALLENGES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to game_challenges" ON game_challenges;
CREATE POLICY "Allow public read access to game_challenges"
ON game_challenges FOR SELECT
TO public
USING (true);

-- ============================================
-- POLICIES - GAME CLUES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to game_clues" ON game_clues;
CREATE POLICY "Allow public read access to game_clues"
ON game_clues FOR SELECT
TO public
USING (true);

-- ============================================
-- POLICIES - GAME SETTINGS
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to game_settings" ON game_settings;
CREATE POLICY "Allow public read access to game_settings"
ON game_settings FOR SELECT
TO public
USING (true);

-- ============================================
-- POLICIES - GAME PHASES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to game_phases" ON game_phases;
CREATE POLICY "Allow public read access to game_phases"
ON game_phases FOR SELECT
TO public
USING (true);

-- ============================================
-- POLICIES - PARTICIPANTS
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to participants" ON participants;
CREATE POLICY "Allow public read access to participants"
ON participants FOR SELECT
TO public
USING (true);

-- ============================================
-- POLICIES - CEREMONY CLUES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to ceremony_clues" ON ceremony_clues;
CREATE POLICY "Allow public read access to ceremony_clues"
ON ceremony_clues FOR SELECT
TO public
USING (true);

-- ============================================
-- POLICIES - CEREMONY CLUES FOUND
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to ceremony_clues_found" ON ceremony_clues_found;
CREATE POLICY "Allow public read access to ceremony_clues_found"
ON ceremony_clues_found FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow public insert to ceremony_clues_found" ON ceremony_clues_found;
CREATE POLICY "Allow public insert to ceremony_clues_found"
ON ceremony_clues_found FOR INSERT
TO public
WITH CHECK (true);

-- ============================================
-- POLICIES - CHAT MESSAGES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to chat_messages" ON chat_messages;
CREATE POLICY "Allow public read access to chat_messages"
ON chat_messages FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow public insert to chat_messages" ON chat_messages;
CREATE POLICY "Allow public insert to chat_messages"
ON chat_messages FOR INSERT
TO public
WITH CHECK (true);

-- ============================================
-- POLICIES - WISHLIST ITEMS
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to wishlist_items" ON wishlist_items;
CREATE POLICY "Allow public read access to wishlist_items"
ON wishlist_items FOR SELECT
TO public
USING (true);

-- ============================================
-- POLICIES - USERS
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to users" ON users;
CREATE POLICY "Allow public read access to users"
ON users FOR SELECT
TO public
USING (true);

-- ============================================
-- POLICIES - PROFILES
-- ============================================

DROP POLICY IF EXISTS "Allow public read access to profiles" ON profiles;
CREATE POLICY "Allow public read access to profiles"
ON profiles FOR SELECT
TO public
USING (true);

-- ============================================
-- VERIFICA POLICIES
-- ============================================

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'game_challenges',
    'game_clues',
    'game_settings',
    'game_phases',
    'participants',
    'ceremony_clues',
    'ceremony_clues_found',
    'chat_messages',
    'wishlist_items',
    'users',
    'profiles'
  )
ORDER BY tablename, policyname;
