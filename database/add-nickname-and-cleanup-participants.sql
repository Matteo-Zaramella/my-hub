-- ============================================
-- Aggiunge campo 'nickname' e pulisce partecipanti
-- Data: 15 Dicembre 2025
-- ============================================

-- 1. Aggiungi colonna 'nickname' alla tabella game_participants
ALTER TABLE game_participants
ADD COLUMN IF NOT EXISTS nickname TEXT;

COMMENT ON COLUMN game_participants.nickname IS 'Soprannome scelto dal partecipante durante la registrazione';

-- 2. Elimina tutti i partecipanti TRANNE 'TEST'
DELETE FROM game_participants
WHERE name != 'TEST';

-- 3. Verifica risultato
SELECT
  id,
  name,
  participant_code,
  email,
  phone_number,
  instagram_handle,
  nickname,
  registration_completed
FROM game_participants
ORDER BY name;

-- ============================================
-- Note:
-- - Il campo nickname è opzionale (può essere NULL)
-- - Tutti i partecipanti tranne TEST sono stati rimossi
-- - I nuovi utenti si registreranno autonomamente
-- ============================================
