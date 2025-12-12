-- FIX DATE CORRETTE SECONDO DATE_SFIDE_UFFICIALI.txt
-- Eseguito il: 9 Dicembre 2025
-- FONTE VERITÀ: DATE_SFIDE_UFFICIALI.txt

-- SFIDA 1: 25/01/2026 (mezzanotte tra 24 e 25)
UPDATE game_challenges
SET start_date = '2026-01-25T00:00:00'::timestamp,
    end_date = '2026-01-25T00:00:00'::timestamp,
    updated_at = NOW()
WHERE challenge_number = 1;

-- SFIDA 2: 22/02/2026
UPDATE game_challenges
SET start_date = '2026-02-22T00:00:00'::timestamp,
    end_date = '2026-02-22T00:00:00'::timestamp,
    updated_at = NOW()
WHERE challenge_number = 2;

-- SFIDA 3: 29/03/2026
UPDATE game_challenges
SET start_date = '2026-03-29T00:00:00'::timestamp,
    end_date = '2026-03-29T00:00:00'::timestamp,
    updated_at = NOW()
WHERE challenge_number = 3;

-- SFIDA 4: 26/04/2026
UPDATE game_challenges
SET start_date = '2026-04-26T00:00:00'::timestamp,
    end_date = '2026-04-26T00:00:00'::timestamp,
    updated_at = NOW()
WHERE challenge_number = 4;

-- SFIDA 5: 31/05/2026
UPDATE game_challenges
SET start_date = '2026-05-31T00:00:00'::timestamp,
    end_date = '2026-05-31T00:00:00'::timestamp,
    updated_at = NOW()
WHERE challenge_number = 5;

-- SFIDA 6: 28/06/2026
UPDATE game_challenges
SET start_date = '2026-06-28T00:00:00'::timestamp,
    end_date = '2026-06-28T00:00:00'::timestamp,
    updated_at = NOW()
WHERE challenge_number = 6;

-- SFIDA 7: 26/07/2026
UPDATE game_challenges
SET start_date = '2026-07-26T00:00:00'::timestamp,
    end_date = '2026-07-26T00:00:00'::timestamp,
    updated_at = NOW()
WHERE challenge_number = 7;

-- SFIDA 8: 30/08/2026
UPDATE game_challenges
SET start_date = '2026-08-30T00:00:00'::timestamp,
    end_date = '2026-08-30T00:00:00'::timestamp,
    updated_at = NOW()
WHERE challenge_number = 8;

-- SFIDA 9: 27/09/2026
UPDATE game_challenges
SET start_date = '2026-09-27T00:00:00'::timestamp,
    end_date = '2026-09-27T00:00:00'::timestamp,
    updated_at = NOW()
WHERE challenge_number = 9;

-- SFIDA 10: 25/10/2026
UPDATE game_challenges
SET start_date = '2026-10-25T00:00:00'::timestamp,
    end_date = '2026-10-25T00:00:00'::timestamp,
    updated_at = NOW()
WHERE challenge_number = 10;

-- SFIDA 11: 29/11/2026
UPDATE game_challenges
SET start_date = '2026-11-29T00:00:00'::timestamp,
    end_date = '2026-11-29T00:00:00'::timestamp,
    updated_at = NOW()
WHERE challenge_number = 11;

-- SFIDA 12: 27/12/2026
UPDATE game_challenges
SET start_date = '2026-12-27T00:00:00'::timestamp,
    end_date = '2026-12-27T00:00:00'::timestamp,
    updated_at = NOW()
WHERE challenge_number = 12;

-- Verifica
SELECT challenge_number, title, start_date, end_date
FROM game_challenges
ORDER BY challenge_number;
