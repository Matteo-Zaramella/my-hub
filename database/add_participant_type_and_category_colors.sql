-- ============================================
-- AGGIORNAMENTO PARTECIPANTI
-- 21 Novembre 2025
-- ============================================
--
-- MODIFICHE:
-- 1. Aggiunta colonna participant_type (principale/partner)
-- 2. Assegnazione colori alle categorie
-- 3. Aggiornamento status partecipanti
--

-- ============================================
-- PARTE 1: AGGIUNGI COLONNA TIPO PARTECIPANTE
-- ============================================

-- Aggiungi colonna per distinguere invitati principali da partner
ALTER TABLE game_participants
ADD COLUMN IF NOT EXISTS participant_type TEXT DEFAULT 'principale'
CHECK (participant_type IN ('principale', 'partner'));

COMMENT ON COLUMN game_participants.participant_type IS 'Tipo di partecipante: principale (invitato diretto) o partner (accompagnatore)';

-- Crea indice per query veloci
CREATE INDEX IF NOT EXISTS idx_game_participants_type ON game_participants(participant_type);


-- ============================================
-- PARTE 2: MARCA I PARTNER
-- ============================================

-- Partner identificati (hanno nome completo)
UPDATE game_participants SET participant_type = 'partner' WHERE participant_name ILIKE '%andrea zotta%';
UPDATE game_participants SET participant_type = 'partner' WHERE participant_name ILIKE '%angelica bettella%';
UPDATE game_participants SET participant_type = 'partner' WHERE participant_name ILIKE '%anna gianaselli%';
UPDATE game_participants SET participant_type = 'partner' WHERE participant_name ILIKE '%benedetta ferronato%';
UPDATE game_participants SET participant_type = 'partner' WHERE participant_name ILIKE '%elena ardito%';
UPDATE game_participants SET participant_type = 'partner' WHERE participant_name ILIKE '%elisa volpatti%';
UPDATE game_participants SET participant_type = 'partner' WHERE participant_name ILIKE '%emanuele pedron%';
UPDATE game_participants SET participant_type = 'partner' WHERE participant_name ILIKE '%francesca pasini%';
UPDATE game_participants SET participant_type = 'partner' WHERE participant_name ILIKE '%francesco corricelli%';
UPDATE game_participants SET participant_type = 'partner' WHERE participant_name ILIKE '%sophia gardin%';
UPDATE game_participants SET participant_type = 'partner' WHERE participant_name ILIKE '%vittoria bocchese%';

-- Partner generici (da identificare - hanno "ragazzo di" o "ragazza di")
-- Questi rimarranno come partner ma con nome generico
-- Quando verranno identificati, il nome verrà aggiornato manualmente


-- ============================================
-- PARTE 3: COLORI CATEGORIE
-- ============================================

-- Creare tabella per colori categorie
CREATE TABLE IF NOT EXISTS category_colors (
  category TEXT PRIMARY KEY,
  color_hex TEXT NOT NULL,
  color_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE category_colors IS 'Colori assegnati alle categorie di partecipanti';

-- Inserisci colori per ogni categoria
INSERT INTO category_colors (category, color_hex, color_name) VALUES
  ('Mare', '#3B82F6', 'Blu'),           -- Blu oceano
  ('Arcella', '#10B981', 'Verde'),      -- Verde smeraldo
  ('Severi', '#8B5CF6', 'Viola'),       -- Viola
  ('Mortise', '#F59E0B', 'Arancione'),  -- Arancione
  ('Famiglia', '#EF4444', 'Rosso'),     -- Rosso
  ('Colleghi', '#6366F1', 'Indaco'),    -- Indaco
  ('Amici', '#EC4899', 'Rosa'),         -- Rosa
  ('Vigodarzere', '#14B8A6', 'Teal')    -- Teal/Verde acqua
ON CONFLICT (category) DO UPDATE SET
  color_hex = EXCLUDED.color_hex,
  color_name = EXCLUDED.color_name;


-- ============================================
-- PARTE 4: VERIFICA
-- ============================================

-- Conta partecipanti per tipo
SELECT
  'PARTECIPANTI PER TIPO' as check_type,
  participant_type,
  COUNT(*) as totale
FROM game_participants
GROUP BY participant_type
ORDER BY participant_type;

-- Conta partecipanti per categoria con colore
SELECT
  'PARTECIPANTI PER CATEGORIA' as check_type,
  gp.category,
  cc.color_name,
  cc.color_hex,
  COUNT(*) as totale
FROM game_participants gp
LEFT JOIN category_colors cc ON gp.category = cc.category
GROUP BY gp.category, cc.color_name, cc.color_hex
ORDER BY gp.category;

-- Lista partner
SELECT
  'LISTA PARTNER' as check_type,
  participant_name,
  category,
  partner_name as "è_partner_di"
FROM game_participants
WHERE participant_type = 'partner'
ORDER BY participant_name;

-- ============================================
-- COMPLETATO! ✅
-- ============================================
