-- ================================================================
-- RESET COLONNE CERIMONIA APERTURA
-- ================================================================
-- Questo script cancella TUTTI gli indizi trovati dalla tabella
-- ceremony_clues_found, facendo tornare le colonne spente sulla homepage
-- ================================================================

-- Cancella tutti i record dalla tabella ceremony_clues_found
DELETE FROM ceremony_clues_found;

-- Verifica che la tabella sia vuota
SELECT COUNT(*) as total_records FROM ceremony_clues_found;
-- Dovrebbe ritornare: total_records = 0

-- ================================================================
-- FATTO!
-- ================================================================
-- Dopo aver eseguito questo script:
-- 1. Ricarica la homepage (http://localhost:3000)
-- 2. Le colonne dovrebbero essere tutte SPENTE (nere)
-- 3. Il sistema è pronto per la cerimonia di apertura
-- ================================================================
