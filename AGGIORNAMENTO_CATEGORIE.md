# 📋 Aggiornamento Categorie Partecipanti

## Modifiche da Applicare

### 🆕 Nuova Categoria
- **Vigodarzere** (aggiunta alle categorie esistenti)

### 👥 Partecipanti da Aggiornare

| Nome | Categoria |
|------|-----------|
| Angelica Bettella | Mortise |
| Benedetta | Arcella |
| Elena | Severi |
| Elisa Volpatti | Severi |
| Emanuele Pedroni | Arcella |
| Colombin | Vigodarzere |
| Pasini | Severi |
| Corricelli | Famiglia |
| Giulia | Mare |
| Giulio | Arcella |
| Bortolami | Arcella |
| Barnaba | Vigodarzere |
| Sara Giacometti | Arcella |
| Sophia Gardin | Severi |

### ➕ Nuova Partecipante
- **Gaia Zordan** - Vigodarzere (codice: GZRD01)

### ❓ Da Verificare
- **Gaia** (senza cognome) - Coinquilina di Anastasia - categoria da decidere

---

## 🚀 Script SQL da Eseguire

### Step 1: Aggiorna Constraint e Categorie

**Apri:** https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql

**Esegui questo script:**

```sql
-- Drop old constraint
ALTER TABLE game_participants DROP CONSTRAINT IF EXISTS game_participants_category_check;

-- Add new constraint with Vigodarzere
ALTER TABLE game_participants
ADD CONSTRAINT game_participants_category_check
CHECK (category IN ('Arcella', 'Mare', 'Severi', 'Mortise', 'Famiglia', 'Colleghi', 'Amici', 'Vigodarzere') OR category IS NULL);

-- Update participants

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
```

### Step 2: Aggiungi Gaia Zordan

```sql
-- Add Gaia Zordan
INSERT INTO game_participants (
  user_id,
  participant_name,
  phone_number,
  instagram_handle,
  category,
  participant_code,
  notes,
  is_couple,
  current_points
)
VALUES (
  (SELECT user_id FROM game_participants LIMIT 1),
  'Gaia Zordan',
  NULL,
  NULL,
  'Vigodarzere',
  'GZRD01',
  'Nuova invitata - Gruppo Vigodarzere',
  FALSE,
  0
)
ON CONFLICT (participant_code) DO NOTHING;
```

### Step 3: Verifica Modifiche

```sql
-- Verifica tutte le modifiche
SELECT participant_name, category, participant_code
FROM game_participants
WHERE category = 'Vigodarzere' OR participant_name IN (
  'Angelica Bettella', 'Benedetta', 'Elena', 'Elisa Volpatti',
  'Emanuele Pedroni', 'Pasini', 'Corricelli', 'Giulia',
  'Giulio', 'Bortolami', 'Sara Giacometti', 'Sophia Gardin', 'Gaia Zordan'
)
ORDER BY category, participant_name;

-- Conta partecipanti per categoria
SELECT category, COUNT(*) as total
FROM game_participants
GROUP BY category
ORDER BY category;
```

---

## ✅ Risultato Atteso

Dopo aver eseguito gli script:

### Categorie Totali
1. Arcella
2. Mare
3. Severi
4. Mortise
5. Famiglia
6. Colleghi
7. Amici
8. **Vigodarzere** (nuovo)

### Partecipanti Aggiornati
- ✅ 14 partecipanti con categoria aggiornata
- ✅ 1 nuova partecipante aggiunta (Gaia Zordan)
- ✅ Categoria Vigodarzere creata

### Nella Dashboard
Ricarica la pagina `/dashboard/game-management` e vedrai:
- Nuovo filtro categoria: **Vigodarzere**
- Partecipanti con categorie aggiornate
- Gaia Zordan nella lista con codice **GZRD01**

---

## 📝 Note

### Gaia (senza cognome)
La partecipante "Gaia" (coinquilina di Anastasia) necessita di:
- Cognome completo
- Categoria definitiva
- Eventuale relazione con Anastasia nel campo notes

### Conflitti
Se alcuni nomi non matchano esattamente (es. variazioni di cognome), potrebbe essere necessario:
1. Verificare i nomi esatti nel database
2. Aggiustare le query ILIKE di conseguenza

### Verifica Manuale
Dopo l'esecuzione, verifica manualmente nella dashboard che tutti i partecipanti siano stati aggiornati correttamente.

---

**Tempo richiesto**: 5 minuti
**File**: `database/update_participants_categories.sql` e `database/add_gaia_zordan.sql`
