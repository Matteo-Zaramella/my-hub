-- Inserimento nuovi prodotti wishlist - 12 Gennaio 2026
-- Articoli dalla mail office@milanesi.biz
-- Eseguire su Supabase Dashboard > SQL Editor

INSERT INTO wishlist_items (nome, descrizione, link, prezzo, priorita, pubblico, categoria)
VALUES
  (
    'Gigaset PURE 120A Duo',
    'Telefono cordless con segreteria, due cornette',
    'https://www.amazon.it/s?k=Gigaset+PURE+120A+Duo',
    60.00,
    'media',
    true,
    'elettrodomestici'
  ),
  (
    'Nothing Phone 3',
    'Smartphone Nothing Phone 3 - Bianco, 16GB RAM, 512GB Storage',
    'https://nothing.tech',
    800.00,
    'alta',
    true,
    'tech'
  ),
  (
    'Scaldacollo Invernale',
    'Scaldacollo termico per inverno',
    'https://www.amazon.it/s?k=scaldacollo+invernale',
    25.00,
    'media',
    true,
    'vestiti'
  ),
  (
    'Coprigambe Impermeabile Bici',
    'Protezione impermeabile per gambe durante tragitto in bici',
    'https://www.amazon.it/s?k=coprigambe+impermeabile+bici',
    45.00,
    'alta',
    true,
    'bici'
  ),
  (
    'Calzini Lunghi Taglia 47/50',
    'Pack calzini lunghi per taglie grandi 47-50',
    'https://www.amazon.it/s?k=calzini+lunghi+47+50',
    30.00,
    'media',
    true,
    'vestiti'
  );
