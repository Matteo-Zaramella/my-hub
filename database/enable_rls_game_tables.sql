-- Enable RLS e crea policies permissive per le tabelle del gioco
-- Questo risolve gli errori di accesso da frontend

-- ============================================
-- GAME TABLES - RLS POLICIES
-- ============================================

-- 1. game_challenges
ALTER TABLE game_challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to game_challenges" ON game_challenges;
CREATE POLICY "Allow public read access to game_challenges"
ON game_challenges FOR SELECT
TO public
USING (true);

-- 2. game_clues
ALTER TABLE game_clues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to game_clues" ON game_clues;
CREATE POLICY "Allow public read access to game_clues"
ON game_clues FOR SELECT
TO public
USING (true);

-- 3. game_settings
ALTER TABLE game_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to game_settings" ON game_settings;
CREATE POLICY "Allow public read access to game_settings"
ON game_settings FOR SELECT
TO public
USING (true);

-- 4. participants
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to participants" ON participants;
CREATE POLICY "Allow public read access to participants"
ON participants FOR SELECT
TO public
USING (true);

-- 5. ceremony_clues
ALTER TABLE ceremony_clues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to ceremony_clues" ON ceremony_clues;
CREATE POLICY "Allow public read access to ceremony_clues"
ON ceremony_clues FOR SELECT
TO public
USING (true);

-- 6. ceremony_clues_found
ALTER TABLE ceremony_clues_found ENABLE ROW LEVEL SECURITY;

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

-- 7. chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

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

-- 8. wishlist_items
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to wishlist_items" ON wishlist_items;
CREATE POLICY "Allow public read access to wishlist_items"
ON wishlist_items FOR SELECT
TO public
USING (true);

-- 9. game_phases (se esiste)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'game_phases') THEN
    ALTER TABLE game_phases ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Allow public read access to game_phases" ON game_phases;
    CREATE POLICY "Allow public read access to game_phases"
    ON game_phases FOR SELECT
    TO public
    USING (true);
  END IF;
END $$;

-- ============================================
-- VERIFICA POLICIES
-- ============================================

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('game_challenges', 'game_clues', 'game_settings', 'participants',
                    'ceremony_clues', 'ceremony_clues_found', 'chat_messages', 'wishlist_items')
ORDER BY tablename, policyname;
