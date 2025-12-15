-- CLEANUP DUPLICATE WISHLIST POLICIES
-- Rimuove policy duplicate e lascia solo quella corretta

-- Drop tutte le policy SELECT per public/anon
DROP POLICY IF EXISTS "Allow public read" ON wishlist_items;
DROP POLICY IF EXISTS "Anyone can view public wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Public can view public wishlist items" ON wishlist_items;

-- Ricrea solo la policy corretta per accesso pubblico
CREATE POLICY "Public can view public wishlist items"
ON wishlist_items
FOR SELECT
TO public
USING (pubblico = true);

-- Verifica policy finali
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'wishlist_items'
ORDER BY cmd, policyname;
