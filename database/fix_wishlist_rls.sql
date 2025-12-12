-- FIX RLS POLICY PER WISHLIST_ITEMS
-- Permetti agli utenti autenticati di inserire/modificare/eliminare i propri item

-- Drop policy esistenti se ci sono
DROP POLICY IF EXISTS "Users can insert their own wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Users can view their own wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Users can update their own wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Users can delete their own wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Public can view public wishlist items" ON wishlist_items;

-- Abilita RLS sulla tabella
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Policy per INSERT: utenti autenticati possono inserire i propri item
CREATE POLICY "Users can insert their own wishlist items"
ON wishlist_items
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy per SELECT: utenti possono vedere i propri item
CREATE POLICY "Users can view their own wishlist items"
ON wishlist_items
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy per SELECT: tutti possono vedere gli item pubblici
CREATE POLICY "Public can view public wishlist items"
ON wishlist_items
FOR SELECT
TO anon
USING (pubblico = true);

-- Policy per UPDATE: utenti possono modificare i propri item
CREATE POLICY "Users can update their own wishlist items"
ON wishlist_items
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy per DELETE: utenti possono eliminare i propri item
CREATE POLICY "Users can delete their own wishlist items"
ON wishlist_items
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

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
WHERE tablename = 'wishlist_items';
