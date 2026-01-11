-- Aggiornamento prezzi wishlist
-- Eseguire su Supabase Dashboard > SQL Editor

-- Farina d'avena istantanea (id: 15)
UPDATE wishlist_items SET prezzo = 3.89 WHERE id = 15;

-- Fascia porta cellulare (id: 5)
UPDATE wishlist_items SET prezzo = 9.99 WHERE id = 5;

-- Omega 3 (id: 19)
UPDATE wishlist_items SET prezzo = 17.90 WHERE id = 19;

-- Philips Serie 5000 frullatore (id: 1)
UPDATE wishlist_items SET prezzo = 34.99 WHERE id = 1;

-- Nothing Ear Pro -> Nothing Ear (id: 3)
UPDATE wishlist_items SET prezzo = 110.00, nome = 'Nothing Ear' WHERE id = 3;

-- Nothing CMF Watch 3 Pro (id: 14)
UPDATE wishlist_items SET prezzo = 69.00, nome = 'CMF Watch 3 Pro' WHERE id = 14;
