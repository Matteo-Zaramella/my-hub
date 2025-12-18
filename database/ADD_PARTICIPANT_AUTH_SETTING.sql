-- ============================================
-- ADD PARTICIPANT AUTH SETTING
-- ============================================
-- Aggiunge il setting per controllare se mostrare
-- la schermata di autenticazione partecipanti
-- ============================================

INSERT INTO game_settings (setting_key, setting_value, description)
VALUES ('participant_auth_enabled', true, 'Controls if participant authentication screen is shown on landing page')
ON CONFLICT (setting_key)
DO UPDATE SET
  description = EXCLUDED.description;

-- ============================================
-- COMPLETATO! ✅
-- ============================================
