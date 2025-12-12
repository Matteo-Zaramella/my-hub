-- ============================================
-- Update Participants Categories
-- Created: 2025-11-11
-- ============================================

-- Step 1: Drop old constraint
ALTER TABLE game_participants DROP CONSTRAINT IF EXISTS game_participants_category_check;

-- Step 2: Add new constraint with Vigodarzere
ALTER TABLE game_participants
ADD CONSTRAINT game_participants_category_check
CHECK (category IN ('Arcella', 'Mare', 'Severi', 'Mortise', 'Famiglia', 'Colleghi', 'Amici', 'Vigodarzere') OR category IS NULL);

-- Step 3: Update existing participants

-- Angelica Bettella → Mortise
UPDATE game_participants SET category = 'Mortise'
WHERE participant_name ILIKE '%angelica%' AND participant_name ILIKE '%bettella%';

-- Benedetta → Arcella
UPDATE game_participants SET category = 'Arcella'
WHERE participant_name ILIKE '%benedetta%' AND category IS NULL;

-- Elena → Severi
UPDATE game_participants SET category = 'Severi'
WHERE participant_name ILIKE '%elena%' AND category IS NULL;

-- Elisa Volpatti → Severi
UPDATE game_participants SET category = 'Severi'
WHERE participant_name ILIKE '%elisa%' AND participant_name ILIKE '%volpatti%';

-- Emanuele Pedroni → Arcella
UPDATE game_participants SET category = 'Arcella'
WHERE participant_name ILIKE '%emanuele%' AND participant_name ILIKE '%pedroni%';

-- Colombin → Vigodarzere
UPDATE game_participants SET category = 'Vigodarzere'
WHERE participant_name ILIKE '%colombin%';

-- Pasini → Severi
UPDATE game_participants SET category = 'Severi'
WHERE participant_name ILIKE '%pasini%';

-- Corricelli → Famiglia
UPDATE game_participants SET category = 'Famiglia'
WHERE participant_name ILIKE '%corricelli%';

-- Gaia (coinquilina di Anastasia) - per ora lasciamo NULL, da relazionare
-- UPDATE game_participants SET notes = 'Coinquilina di Anastasia'
-- WHERE participant_name ILIKE '%gaia%' AND participant_name NOT ILIKE '%zordan%';

-- Giulia → Mare
UPDATE game_participants SET category = 'Mare'
WHERE participant_name ILIKE '%giulia%' AND category IS NULL;

-- Giulio → Arcella
UPDATE game_participants SET category = 'Arcella'
WHERE participant_name ILIKE '%giulio%';

-- Bortolami → Arcella
UPDATE game_participants SET category = 'Arcella'
WHERE participant_name ILIKE '%bortolami%';

-- Barnaba → Vigodarzere
UPDATE game_participants SET category = 'Vigodarzere'
WHERE participant_name ILIKE '%barnaba%';

-- Sara Giacometti → Arcella
UPDATE game_participants SET category = 'Arcella'
WHERE participant_name ILIKE '%sara%' AND participant_name ILIKE '%giacometti%';

-- Sophia Gardin → Severi
UPDATE game_participants SET category = 'Severi'
WHERE participant_name ILIKE '%sophia%' AND participant_name ILIKE '%gardin%';

-- Step 4: Verify updates
SELECT participant_name, category
FROM game_participants
WHERE participant_name ILIKE ANY(ARRAY[
  '%angelica%bettella%',
  '%benedetta%',
  '%elena%',
  '%elisa%volpatti%',
  '%emanuele%pedroni%',
  '%colombin%',
  '%pasini%',
  '%corricelli%',
  '%giulia%',
  '%giulio%',
  '%bortolami%',
  '%barnaba%',
  '%sara%giacometti%',
  '%sophia%gardin%'
])
ORDER BY category, participant_name;
