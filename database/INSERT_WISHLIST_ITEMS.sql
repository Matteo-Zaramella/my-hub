-- Inserimento nuovi prodotti wishlist
-- Eseguire su Supabase Dashboard > SQL Editor

INSERT INTO wishlist_items (nome, descrizione, link, prezzo, priorita, pubblico)
VALUES
  (
    'Windows 11 Pro - Licenza',
    'Licenza digitale Windows 11 Pro per il nuovo PC',
    'https://www.microsoft.com/it-it/d/windows-11-pro/dg7gmgf0d8h4',
    145.00,
    'alta',
    true
  ),
  (
    'Helldivers 2',
    'Videogioco cooperativo shooter - Steam',
    'https://store.steampowered.com/app/553850/HELLDIVERS_2/',
    39.99,
    'media',
    true
  ),
  (
    'Google Nest Hub',
    'Smart display Google con assistente vocale',
    'https://store.google.com/it/product/nest_hub_2nd_gen',
    99.99,
    'media',
    true
  ),
  (
    'Cavo Ethernet Cat 6 - 30m',
    'Cavo di rete Ethernet RJ45 Cat 6, 30 metri',
    'https://www.amazon.it/s?k=cavo+ethernet+30m+cat+6',
    25.00,
    'alta',
    true
  );
