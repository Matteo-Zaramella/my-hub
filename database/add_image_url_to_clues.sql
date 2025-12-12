-- Aggiungi colonna image_url alla tabella game_clues
-- Per salvare il path dell'immagine di ogni indizio

ALTER TABLE game_clues
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Commento per spiegare l'uso della colonna
COMMENT ON COLUMN game_clues.image_url IS 'URL o path dell''immagine dell''indizio. L''immagine viene rivelata solo il lunedì successivo alla revealed_date';

-- Verifica la struttura della tabella
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'game_clues'
ORDER BY ordinal_position;
