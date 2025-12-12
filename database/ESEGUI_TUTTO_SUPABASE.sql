-- ============================================
-- SCRIPT COMPLETO PER SETUP SUPABASE
-- The Game - My Hub
-- Data: 11 Novembre 2025
-- ============================================
--
-- ISTRUZIONI:
-- 1. Apri Supabase SQL Editor: https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql
-- 2. Copia TUTTO questo file
-- 3. Incolla nell'editor
-- 4. Clicca "RUN"
-- 5. Verifica che non ci siano errori
--
-- Questo script include:
-- ✓ Fix colonna 'note' in workout_sessions (CRITICO)
-- ✓ Colonna 'current_points' in game_participants
-- ✓ Colonna 'email' in game_participants
-- ✓ Aggiornamento constraint categorie (+ Vigodarzere)
-- ✓ Aggiornamento categorie partecipanti esistenti
-- ✓ Tabelle chat di gruppo (game_chat_messages_v2)
-- ✓ Tabelle chat sistema auth (game_chat_messages, game_user_profiles)
-- ✓ RLS policies complete
-- ✓ Realtime subscriptions
-- ✓ Indexes per performance
--
-- ============================================


-- ============================================
-- PARTE 1: FIX CRITICI DATABASE
-- ============================================

-- 1.1 Fix workout_sessions - Aggiungi colonna 'note' mancante
-- IMPORTANTE: Questa colonna è referenziata nel codice ma manca nel DB
ALTER TABLE workout_sessions
ADD COLUMN IF NOT EXISTS note TEXT;

COMMENT ON COLUMN workout_sessions.note IS 'Note aggiuntive per la sessione di allenamento';


-- ============================================
-- PARTE 2: GAME PARTICIPANTS - NUOVE COLONNE
-- ============================================

-- 2.1 Aggiungi colonna punteggio
ALTER TABLE game_participants
ADD COLUMN IF NOT EXISTS current_points INTEGER DEFAULT 0 NOT NULL;

CREATE INDEX IF NOT EXISTS idx_game_participants_points ON game_participants(current_points DESC);

COMMENT ON COLUMN game_participants.current_points IS 'Punteggio corrente del partecipante in The Game';


-- 2.2 Aggiungi colonna email
ALTER TABLE game_participants
ADD COLUMN IF NOT EXISTS email TEXT;

CREATE INDEX IF NOT EXISTS idx_game_participants_email ON game_participants(email);

COMMENT ON COLUMN game_participants.email IS 'Email del partecipante';


-- ============================================
-- PARTE 3: CATEGORIE PARTECIPANTI
-- ============================================

-- 3.1 Aggiorna constraint per includere "Vigodarzere"
ALTER TABLE game_participants DROP CONSTRAINT IF EXISTS game_participants_category_check;

ALTER TABLE game_participants
ADD CONSTRAINT game_participants_category_check
CHECK (category IN ('Arcella', 'Mare', 'Severi', 'Mortise', 'Famiglia', 'Colleghi', 'Amici', 'Vigodarzere') OR category IS NULL);


-- 3.2 Aggiorna categorie partecipanti esistenti
-- Angelica Bettella → Mortise
UPDATE game_participants SET category = 'Mortise'
WHERE participant_name ILIKE '%angelica%' AND participant_name ILIKE '%bettella%';

-- Benedetta → Arcella
UPDATE game_participants SET category = 'Arcella'
WHERE participant_name ILIKE '%benedetta%' AND category IS NULL;

-- Elena → Severi
UPDATE game_participants SET category = 'Severi'
WHERE participant_name ILIKE '%elena%' AND category IS NULL;

-- Elisa Volpatti → Severi
UPDATE game_participants SET category = 'Severi'
WHERE participant_name ILIKE '%elisa%' AND participant_name ILIKE '%volpatti%';

-- Emanuele Pedroni → Arcella
UPDATE game_participants SET category = 'Arcella'
WHERE participant_name ILIKE '%emanuele%' AND participant_name ILIKE '%pedroni%';

-- Colombin → Vigodarzere
UPDATE game_participants SET category = 'Vigodarzere'
WHERE participant_name ILIKE '%colombin%';

-- Pasini → Severi
UPDATE game_participants SET category = 'Severi'
WHERE participant_name ILIKE '%pasini%';

-- Corricelli → Famiglia
UPDATE game_participants SET category = 'Famiglia'
WHERE participant_name ILIKE '%corricelli%';

-- Giulia → Mare
UPDATE game_participants SET category = 'Mare'
WHERE participant_name ILIKE '%giulia%' AND category IS NULL;

-- Giulio → Arcella
UPDATE game_participants SET category = 'Arcella'
WHERE participant_name ILIKE '%giulio%';

-- Bortolami → Arcella
UPDATE game_participants SET category = 'Arcella'
WHERE participant_name ILIKE '%bortolami%';

-- Barnaba → Vigodarzere
UPDATE game_participants SET category = 'Vigodarzere'
WHERE participant_name ILIKE '%barnaba%';

-- Sara Giacometti → Arcella
UPDATE game_participants SET category = 'Arcella'
WHERE participant_name ILIKE '%sara%' AND participant_name ILIKE '%giacometti%';

-- Sophia Gardin → Severi
UPDATE game_participants SET category = 'Severi'
WHERE participant_name ILIKE '%sophia%' AND participant_name ILIKE '%gardin%';


-- ============================================
-- PARTE 4: CHAT SISTEMA PARTECIPANTI (V2)
-- ============================================
-- Sistema chat usato nella game area pubblica
-- Basato su game_participants invece di auth.users

-- 4.1 Crea tabella messaggi chat v2
CREATE TABLE IF NOT EXISTS game_chat_messages_v2 (
  id BIGSERIAL PRIMARY KEY,
  participant_id INTEGER NOT NULL REFERENCES game_participants(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  participant_code TEXT NOT NULL,
  message TEXT NOT NULL,
  is_system_message BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4.2 Indexes per performance
CREATE INDEX IF NOT EXISTS idx_chat_v2_created_at ON game_chat_messages_v2(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_v2_participant_id ON game_chat_messages_v2(participant_id);

-- 4.3 Row Level Security
ALTER TABLE game_chat_messages_v2 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view chat messages v2" ON game_chat_messages_v2;
CREATE POLICY "Anyone can view chat messages v2"
  ON game_chat_messages_v2 FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can send messages v2" ON game_chat_messages_v2;
CREATE POLICY "Anyone can send messages v2"
  ON game_chat_messages_v2 FOR INSERT
  WITH CHECK (true);

-- 4.4 Realtime subscription
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND tablename = 'game_chat_messages_v2'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE game_chat_messages_v2;
  END IF;
END $$;

-- 4.5 Messaggio di benvenuto
INSERT INTO game_chat_messages_v2 (participant_id, participant_name, participant_code, message, is_system_message)
SELECT 1, 'Sistema', 'SYSTEM', '🎉 Benvenuti nella chat di gruppo di The Game! Qui potrete comunicare con tutti i partecipanti in tempo reale.', true
WHERE NOT EXISTS (SELECT 1 FROM game_chat_messages_v2 WHERE is_system_message = true LIMIT 1);


-- ============================================
-- PARTE 5: CHAT SISTEMA AUTH (ADMIN DASHBOARD)
-- ============================================
-- Sistema chat usato nella dashboard admin
-- Basato su auth.users

-- 5.1 Tabella profili utenti
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

-- 5.2 Tabella messaggi chat auth
CREATE TABLE IF NOT EXISTS game_chat_messages (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_system_message BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5.3 Tabella reazioni (feature futura)
CREATE TABLE IF NOT EXISTS game_chat_reactions (
  id BIGSERIAL PRIMARY KEY,
  message_id BIGINT REFERENCES game_chat_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- 5.4 Indexes per performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON game_chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON game_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON game_user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_online ON game_user_profiles(is_online) WHERE is_online = TRUE;
CREATE INDEX IF NOT EXISTS idx_chat_reactions_message_id ON game_chat_reactions(message_id);

-- 5.5 Row Level Security
ALTER TABLE game_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_chat_reactions ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
DROP POLICY IF EXISTS "Anyone can view user profiles" ON game_user_profiles;
CREATE POLICY "Anyone can view user profiles"
  ON game_user_profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON game_user_profiles;
CREATE POLICY "Users can update own profile"
  ON game_user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON game_user_profiles;
CREATE POLICY "Users can insert own profile"
  ON game_user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Chat Messages Policies
DROP POLICY IF EXISTS "Anyone can view chat messages" ON game_chat_messages;
CREATE POLICY "Anyone can view chat messages"
  ON game_chat_messages FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can send messages" ON game_chat_messages;
CREATE POLICY "Authenticated users can send messages"
  ON game_chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own recent messages" ON game_chat_messages;
CREATE POLICY "Users can update own recent messages"
  ON game_chat_messages FOR UPDATE
  USING (
    auth.uid() = user_id
    AND created_at > NOW() - INTERVAL '5 minutes'
  );

DROP POLICY IF EXISTS "Users can delete own recent messages" ON game_chat_messages;
CREATE POLICY "Users can delete own recent messages"
  ON game_chat_messages FOR DELETE
  USING (
    auth.uid() = user_id
    AND created_at > NOW() - INTERVAL '5 minutes'
  );

-- Chat Reactions Policies
DROP POLICY IF EXISTS "Anyone can view reactions" ON game_chat_reactions;
CREATE POLICY "Anyone can view reactions"
  ON game_chat_reactions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can add reactions" ON game_chat_reactions;
CREATE POLICY "Authenticated users can add reactions"
  ON game_chat_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove own reactions" ON game_chat_reactions;
CREATE POLICY "Users can remove own reactions"
  ON game_chat_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- 5.6 Triggers per updated_at automatico
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON game_user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON game_user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON game_chat_messages;
CREATE TRIGGER update_chat_messages_updated_at
  BEFORE UPDATE ON game_chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5.7 Realtime subscriptions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND tablename = 'game_chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE game_chat_messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND tablename = 'game_user_profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE game_user_profiles;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND tablename = 'game_chat_reactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE game_chat_reactions;
  END IF;
END $$;


-- ============================================
-- PARTE 6: VERIFICA FINALE
-- ============================================

-- Verifica categorie aggiornate
SELECT
  'CATEGORIE AGGIORNATE' as check_type,
  participant_name,
  category
FROM game_participants
WHERE category IN ('Mortise', 'Vigodarzere', 'Severi', 'Arcella', 'Famiglia', 'Mare')
ORDER BY category, participant_name;

-- Verifica colonne nuove
SELECT
  'COLONNE PARTECIPANTI' as check_type,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'game_participants'
  AND column_name IN ('current_points', 'email', 'note')
ORDER BY column_name;

-- Verifica tabelle chat create
SELECT
  'TABELLE CHAT' as check_type,
  table_name
FROM information_schema.tables
WHERE table_name IN ('game_chat_messages_v2', 'game_chat_messages', 'game_user_profiles', 'game_chat_reactions')
  AND table_schema = 'public'
ORDER BY table_name;

-- Count messaggi chat
SELECT
  'MESSAGGI CHAT V2' as check_type,
  COUNT(*) as total_messages,
  COUNT(*) FILTER (WHERE is_system_message = true) as system_messages
FROM game_chat_messages_v2;


-- ============================================
-- COMPLETATO! ✅
-- ============================================
--
-- Verifica che tutti i SELECT sopra restituiscano dati corretti.
--
-- Prossimi passi:
-- 1. Testa dashboard partecipanti: http://localhost:3000/dashboard/game-management
-- 2. Verifica colonne Punteggio ed Email visibili
-- 3. Testa form "Aggiungi Partecipante"
-- 4. Testa modifica inline con pulsante "Modifica"
-- 5. Aggiungi Gaia Zordan tramite form
-- 6. Testa chat (dopo 26/01/2026 o modificando data)
--
-- ============================================
