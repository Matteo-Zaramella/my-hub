-- Aggiunge il setting per tracciare se i punti bonus della cerimonia sono stati assegnati
-- Eseguire su Supabase Dashboard > SQL Editor

-- Inserisce il setting (ignora se esiste già)
INSERT INTO game_settings (setting_key, setting_value, description)
VALUES ('ceremony_bonus_awarded', false, 'True se i 50 punti bonus della cerimonia sono stati assegnati')
ON CONFLICT (setting_key) DO NOTHING;

-- Verifica
SELECT * FROM game_settings WHERE setting_key = 'ceremony_bonus_awarded';
