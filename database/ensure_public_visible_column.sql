-- Ensure public_visible column exists (might already be called 'pubblico')
-- This migration is idempotent

-- If column 'pubblico' doesn't exist, create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'wishlist_items'
        AND column_name = 'pubblico'
    ) THEN
        ALTER TABLE wishlist_items
        ADD COLUMN pubblico BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Set specific items to NOT public
-- Borsa da manubrio, integratori, maglione Uniqlo
UPDATE wishlist_items
SET pubblico = false
WHERE nome ILIKE '%borsa%manubrio%'
   OR nome ILIKE '%integratori%'
   OR nome ILIKE '%uniqlo%';

-- Add comment
COMMENT ON COLUMN wishlist_items.pubblico IS 'Se true, l''item è visibile nella wishlist pubblica';
