-- ============================================
-- SETUP COMPLETO DATABASE DEV
-- ============================================
--
-- ESEGUI QUESTO SCRIPT NEL SQL EDITOR DEL NUOVO DATABASE DEV
-- https://supabase.com/dashboard/project/mheowbijzaparmddumsr/sql
--
-- Questo script crea TUTTE le tabelle necessarie per my-hub
-- ============================================

-- ============================================
-- TABELLA: game_settings
-- ============================================
CREATE TABLE IF NOT EXISTS game_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  ceremony_active BOOLEAN DEFAULT FALSE,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  show_wishlist_button BOOLEAN DEFAULT TRUE,
  show_registration_button BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row_check CHECK (id = 1)
);

-- Inserisci riga default
INSERT INTO game_settings (id, ceremony_active, maintenance_mode, show_wishlist_button, show_registration_button)
VALUES (1, FALSE, FALSE, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE game_settings IS 'Impostazioni globali del gioco (single row)';


-- ============================================
-- TABELLA: game_participants
-- ============================================
CREATE TABLE IF NOT EXISTS game_participants (
  id SERIAL PRIMARY KEY,
  participant_name TEXT NOT NULL,
  participant_code TEXT UNIQUE NOT NULL,
  category TEXT,
  current_points INTEGER DEFAULT 0 NOT NULL,
  email TEXT,
  participant_type TEXT DEFAULT 'player',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT game_participants_category_check
    CHECK (category IN ('Arcella', 'Mare', 'Severi', 'Mortise', 'Famiglia', 'Colleghi', 'Amici', 'Vigodarzere') OR category IS NULL)
);

CREATE INDEX IF NOT EXISTS idx_game_participants_code ON game_participants(participant_code);
CREATE INDEX IF NOT EXISTS idx_game_participants_points ON game_participants(current_points DESC);
CREATE INDEX IF NOT EXISTS idx_game_participants_email ON game_participants(email);

COMMENT ON TABLE game_participants IS 'Partecipanti al gioco';


-- ============================================
-- TABELLA: challenges
-- ============================================
CREATE TABLE IF NOT EXISTS challenges (
  id SERIAL PRIMARY KEY,
  challenge_number INTEGER UNIQUE NOT NULL,
  challenge_name TEXT NOT NULL,
  challenge_date DATE NOT NULL,
  challenge_description TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_challenges_date ON challenges(challenge_date);
CREATE INDEX IF NOT EXISTS idx_challenges_number ON challenges(challenge_number);

COMMENT ON TABLE challenges IS '12 sfide mensili del gioco (Sfida 1 = Cerimonia, Sfida 12 = Finale)';


-- ============================================
-- TABELLA: clues
-- ============================================
CREATE TABLE IF NOT EXISTS clues (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
  clue_number INTEGER NOT NULL,
  clue_text TEXT NOT NULL,
  clue_date DATE NOT NULL,
  image_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(challenge_id, clue_number)
);

CREATE INDEX IF NOT EXISTS idx_clues_challenge ON clues(challenge_id);
CREATE INDEX IF NOT EXISTS idx_clues_date ON clues(clue_date);

COMMENT ON TABLE clues IS 'Indizi settimanali per ogni sfida (37 totali)';


-- ============================================
-- TABELLA: ceremony_clues
-- ============================================
CREATE TABLE IF NOT EXISTS ceremony_clues (
  id SERIAL PRIMARY KEY,
  clue_word TEXT UNIQUE NOT NULL,
  order_number INTEGER UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT order_number_range CHECK (order_number >= 1 AND order_number <= 10)
);

CREATE INDEX IF NOT EXISTS idx_ceremony_clues_order ON ceremony_clues(order_number);

COMMENT ON TABLE ceremony_clues IS '10 parole chiave per la cerimonia di apertura';


-- ============================================
-- TABELLA: ceremony_clues_found
-- ============================================
CREATE TABLE IF NOT EXISTS ceremony_clues_found (
  id SERIAL PRIMARY KEY,
  clue_id INTEGER REFERENCES ceremony_clues(id) ON DELETE CASCADE,
  found_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clue_id)
);

CREATE INDEX IF NOT EXISTS idx_ceremony_found_clue ON ceremony_clues_found(clue_id);

COMMENT ON TABLE ceremony_clues_found IS 'Traccia quali indizi cerimonia sono stati trovati (globale)';


-- ============================================
-- TABELLA: challenge_answers
-- ============================================
CREATE TABLE IF NOT EXISTS challenge_answers (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
  correct_answer TEXT NOT NULL,
  answer_type TEXT DEFAULT 'text',
  validation_schema JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_answers_challenge ON challenge_answers(challenge_id);

COMMENT ON TABLE challenge_answers IS 'Risposte corrette per ogni sfida';


-- ============================================
-- TABELLA: participant_answers
-- ============================================
CREATE TABLE IF NOT EXISTS participant_answers (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER REFERENCES game_participants(id) ON DELETE CASCADE,
  challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
  submitted_answer TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  points_earned INTEGER DEFAULT 0,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_participant_answers_participant ON participant_answers(participant_id);
CREATE INDEX IF NOT EXISTS idx_participant_answers_challenge ON participant_answers(challenge_id);
CREATE INDEX IF NOT EXISTS idx_participant_answers_correct ON participant_answers(is_correct);

COMMENT ON TABLE participant_answers IS 'Risposte dei partecipanti alle sfide';


-- ============================================
-- TABELLA: wishlist_items
-- ============================================
CREATE TABLE IF NOT EXISTS wishlist_items (
  id SERIAL PRIMARY KEY,
  item_name TEXT NOT NULL,
  item_link TEXT,
  item_price NUMERIC(10,2),
  item_image TEXT,
  priority INTEGER DEFAULT 3,
  category TEXT,
  public_visible BOOLEAN DEFAULT TRUE,
  notes TEXT,
  purchased BOOLEAN DEFAULT FALSE,
  purchased_by TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wishlist_priority ON wishlist_items(priority);
CREATE INDEX IF NOT EXISTS idx_wishlist_category ON wishlist_items(category);
CREATE INDEX IF NOT EXISTS idx_wishlist_purchased ON wishlist_items(purchased);
CREATE INDEX IF NOT EXISTS idx_wishlist_public ON wishlist_items(public_visible);

COMMENT ON TABLE wishlist_items IS 'Wishlist pubblica visibile dalla landing page';


-- ============================================
-- TABELLA: workout_sessions
-- ============================================
CREATE TABLE IF NOT EXISTS workout_sessions (
  id SERIAL PRIMARY KEY,
  session_date DATE NOT NULL,
  workout_type TEXT NOT NULL,
  duration_minutes INTEGER,
  calories_burned INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_date ON workout_sessions(session_date DESC);
CREATE INDEX IF NOT EXISTS idx_workout_type ON workout_sessions(workout_type);

COMMENT ON TABLE workout_sessions IS 'Sessioni di allenamento (fitness tracker)';


-- ============================================
-- TABELLA: game_chat_messages_v2
-- ============================================
CREATE TABLE IF NOT EXISTS game_chat_messages_v2 (
  id BIGSERIAL PRIMARY KEY,
  participant_id INTEGER NOT NULL REFERENCES game_participants(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  participant_code TEXT NOT NULL,
  message TEXT NOT NULL,
  is_system_message BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_v2_created_at ON game_chat_messages_v2(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_v2_participant_id ON game_chat_messages_v2(participant_id);

COMMENT ON TABLE game_chat_messages_v2 IS 'Chat di gruppo basata su partecipanti (non auth)';


-- ============================================
-- TABELLA: game_user_profiles (per admin chat)
-- ============================================
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

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON game_user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_online ON game_user_profiles(is_online) WHERE is_online = TRUE;

COMMENT ON TABLE game_user_profiles IS 'Profili utenti per chat admin (basata su auth)';


-- ============================================
-- TABELLA: game_chat_messages (per admin chat)
-- ============================================
CREATE TABLE IF NOT EXISTS game_chat_messages (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_system_message BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON game_chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON game_chat_messages(user_id);

COMMENT ON TABLE game_chat_messages IS 'Messaggi chat admin (basata su auth)';


-- ============================================
-- TABELLA: game_chat_reactions
-- ============================================
CREATE TABLE IF NOT EXISTS game_chat_reactions (
  id BIGSERIAL PRIMARY KEY,
  message_id BIGINT REFERENCES game_chat_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

CREATE INDEX IF NOT EXISTS idx_chat_reactions_message_id ON game_chat_reactions(message_id);

COMMENT ON TABLE game_chat_reactions IS 'Reazioni emoji ai messaggi chat';


-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- wishlist_items RLS
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for public items" ON wishlist_items;
CREATE POLICY "Public read access for public items"
  ON wishlist_items FOR SELECT
  USING (public_visible = true);

DROP POLICY IF EXISTS "Admin full access" ON wishlist_items;
CREATE POLICY "Admin full access"
  ON wishlist_items FOR ALL
  USING (auth.role() = 'authenticated');

-- game_chat_messages_v2 RLS
ALTER TABLE game_chat_messages_v2 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view chat messages v2" ON game_chat_messages_v2;
CREATE POLICY "Anyone can view chat messages v2"
  ON game_chat_messages_v2 FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can send messages v2" ON game_chat_messages_v2;
CREATE POLICY "Anyone can send messages v2"
  ON game_chat_messages_v2 FOR INSERT
  WITH CHECK (true);

-- game_user_profiles RLS
ALTER TABLE game_user_profiles ENABLE ROW LEVEL SECURITY;

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

-- game_chat_messages RLS
ALTER TABLE game_chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view chat messages" ON game_chat_messages;
CREATE POLICY "Anyone can view chat messages"
  ON game_chat_messages FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can send messages" ON game_chat_messages;
CREATE POLICY "Authenticated users can send messages"
  ON game_chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- game_chat_reactions RLS
ALTER TABLE game_chat_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view reactions" ON game_chat_reactions;
CREATE POLICY "Anyone can view reactions"
  ON game_chat_reactions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can add reactions" ON game_chat_reactions;
CREATE POLICY "Authenticated users can add reactions"
  ON game_chat_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- ============================================
-- TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_game_settings_updated_at ON game_settings;
CREATE TRIGGER update_game_settings_updated_at
  BEFORE UPDATE ON game_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_game_participants_updated_at ON game_participants;
CREATE TRIGGER update_game_participants_updated_at
  BEFORE UPDATE ON game_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_wishlist_items_updated_at ON wishlist_items;
CREATE TRIGGER update_wishlist_items_updated_at
  BEFORE UPDATE ON wishlist_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON game_user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON game_user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE game_chat_messages_v2;
ALTER PUBLICATION supabase_realtime ADD TABLE game_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE game_user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE game_chat_reactions;


-- ============================================
-- DATI INIZIALI
-- ============================================

-- Partecipante Sistema (necessario per messaggi di sistema)
INSERT INTO game_participants (id, participant_name, participant_code, participant_type)
VALUES (1, 'Sistema', 'SYSTEM', 'system')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence per evitare conflitti futuri
SELECT setval('game_participants_id_seq', (SELECT MAX(id) FROM game_participants));

-- Messaggio benvenuto chat
INSERT INTO game_chat_messages_v2 (participant_id, participant_name, participant_code, message, is_system_message)
SELECT 1, 'Sistema', 'SYSTEM', '🎮 Database DEV inizializzato! Questa è una copia separata per lo sviluppo locale.', true
WHERE NOT EXISTS (SELECT 1 FROM game_chat_messages_v2 LIMIT 1);


-- ============================================
-- COMPLETATO! ✅
-- ============================================
--
-- Database DEV configurato con successo!
--
-- Ora puoi:
-- 1. Usare .env.local.dev per connetterti a questo database
-- 2. Lavorare offline senza influenzare la produzione
-- 3. Importare dati di test se necessario
--
-- ============================================
