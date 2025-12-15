-- FIX PUBLIC ACCESS TO WISHLIST ITEMS
-- Permetti a TUTTI (anche non autenticati) di vedere gli item pubblici

-- Drop policy esistente per public access
DROP POLICY IF EXISTS "Public can view public wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Anyone can view public wishlist items" ON wishlist_items;

-- Abilita RLS sulla tabella (se non già abilitato)
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Policy per permettere a TUTTI (authenticated + anon) di vedere item pubblici
CREATE POLICY "Anyone can view public wishlist items"
ON wishlist_items
FOR SELECT
USING (pubblico = true);

-- Verifica policy
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
ORDER BY policyname;
