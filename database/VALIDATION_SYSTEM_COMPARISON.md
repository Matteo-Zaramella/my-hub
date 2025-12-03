# 🔐 Sistema Validazione - Confronto SQL Files

**Data:** 3 Dicembre 2025

---

## 📋 Files Esistenti

### 1. `add_answer_validation_schema.sql`
**Data creazione:** 28 Novembre 2025
**Status:** ✅ Base implementata

**Features:**
- ✅ Colonne `answer_code` su `game_clues` e `game_challenges`
- ✅ Tabelle `clue_submissions` e `challenge_submissions`
- ✅ Indexes per performance
- ✅ RLS policies base
- ✅ Constraints UNIQUE per evitare duplicati

**Campi tabelle submissions:**
```sql
- id SERIAL PRIMARY KEY
- participant_id INTEGER (FK)
- clue_id / challenge_id INTEGER (FK)
- submitted_code VARCHAR(30)
- points_earned INTEGER
- submission_rank INTEGER
- submitted_at TIMESTAMPTZ
- created_at TIMESTAMPTZ
```

---

### 2. `create_validation_system.sql` (NUOVO)
**Data creazione:** 3 Dicembre 2025
**Status:** ⚠️ Versione avanzata non eseguita

**Features Aggiuntive:**
- ✅ **Trigger automatici** per calcolo rank e punti
- ✅ **Functions SQL** per formule punteggio (1000-450 indizi, 1200-540 sfide)
- ✅ **View `participant_total_scores`** per leaderboard real-time
- ✅ **Campi anti-cheating:** `ip_address`, `user_agent`, `is_correct`
- ✅ **Auto-calcolo punti** in base a timestamp submission
- ✅ **Comments estesi** per documentazione

**Campi tabelle submissions (estesi):**
```sql
- id SERIAL PRIMARY KEY
- participant_id INTEGER (FK)
- clue_id / challenge_id INTEGER (FK)
- submitted_code VARCHAR(30)
- is_correct BOOLEAN          -- NUOVO
- points_awarded INTEGER       -- Renamed da points_earned
- rank_position INTEGER        -- Renamed da submission_rank
- submitted_at TIMESTAMP
- ip_address INET             -- NUOVO (anti-cheating)
- user_agent TEXT             -- NUOVO (analytics)
```

---

## 🔍 Differenze Chiave

| Feature | Schema Base (v1) | Schema Avanzato (v2) |
|---------|------------------|---------------------|
| **Calcolo rank/punti** | Manuale in API | Automatico (Trigger SQL) |
| **Formula punti** | Hardcoded in JS | Function SQL riusabile |
| **View leaderboard** | ❌ Query manuale | ✅ View `participant_total_scores` |
| **Campi anti-cheating** | ❌ No tracking | ✅ IP + User Agent |
| **Campo `is_correct`** | ❌ Manca | ✅ Presente (track errori) |
| **Auto-documentation** | ⚠️ Comments base | ✅ Comments estesi |

---

## 💡 Raccomandazione

### Opzione A: Upgrade Graduale (CONSIGLIATO)
1. ✅ **Esegui `add_answer_validation_schema.sql`** (se non già fatto)
2. ⏳ **Test sistema base** con API `/api/validate-clue-answer`
3. 📊 **Poi upgrade** con features avanzate da v2:
   ```sql
   -- Aggiungi campi mancanti
   ALTER TABLE clue_submissions ADD COLUMN is_correct BOOLEAN;
   ALTER TABLE clue_submissions ADD COLUMN ip_address INET;
   ALTER TABLE clue_submissions ADD COLUMN user_agent TEXT;

   -- Rinomina colonne (opzionale, per consistency)
   ALTER TABLE clue_submissions RENAME COLUMN points_earned TO points_awarded;
   ALTER TABLE clue_submissions RENAME COLUMN submission_rank TO rank_position;

   -- Aggiungi functions e trigger
   [Copia da create_validation_system.sql]
   ```

### Opzione B: Fresh Start (Più complesso)
1. ❌ **DROP tabelle esistenti** (perdita dati se già popolate)
2. ✅ **Esegui `create_validation_system.sql`** da zero
3. ⚠️ **Rischio:** Se sistema già in uso, dati persi

---

## 📝 Decisione Progettuale

**Scelta:** Opzione A - Upgrade Graduale

**Motivo:**
- Schema base già eseguito (probabilmente)
- Minimizza rischio perdita dati
- Permette test incrementali
- Backwards compatible

**Step da seguire:**
1. Verifica quale schema è stato eseguito su Supabase
2. Se v1 eseguito, crea migration incrementale per upgrade a v2
3. Se nessuno eseguito, esegui direttamente v2 (più completo)

---

## 🔧 Migration Incrementale (v1 → v2)

**File:** `upgrade_validation_system_v1_to_v2.sql` (DA CREARE)

```sql
-- Upgrade da schema base a schema avanzato

-- Step 1: Aggiungi campi mancanti
ALTER TABLE clue_submissions
ADD COLUMN IF NOT EXISTS is_correct BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS ip_address INET,
ADD COLUMN IF NOT EXISTS user_agent TEXT;

ALTER TABLE challenge_submissions
ADD COLUMN IF NOT EXISTS is_correct BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS ip_address INET,
ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Step 2: Popola is_correct per dati esistenti
-- (Assume che tutti i record esistenti siano corretti)
UPDATE clue_submissions SET is_correct = true WHERE is_correct IS NULL;
UPDATE challenge_submissions SET is_correct = true WHERE is_correct IS NULL;

-- Step 3: Rinomina colonne per consistency (OPZIONALE)
-- ALTER TABLE clue_submissions RENAME COLUMN points_earned TO points_awarded;
-- ALTER TABLE clue_submissions RENAME COLUMN submission_rank TO rank_position;
-- ALTER TABLE challenge_submissions RENAME COLUMN points_earned TO points_awarded;
-- ALTER TABLE challenge_submissions RENAME COLUMN submission_rank TO rank_position;

-- Step 4: Aggiungi functions calcolo punti
[Copia da create_validation_system.sql]

-- Step 5: Aggiungi trigger auto-calcolo
[Copia da create_validation_system.sql]

-- Step 6: Crea view leaderboard
[Copia da create_validation_system.sql]
```

---

## ⚠️ Note Importanti

1. **Non eseguire entrambi gli SQL completi** - causerebbero conflitti
2. **Verificare prima quale schema è attivo** su Supabase
3. **I nomi colonne differiscono:** `points_earned` (v1) vs `points_awarded` (v2)
4. **API routes devono essere consistent** con schema scelto

---

## 🎯 TODO per Utente

Quando torni:
1. [ ] Verifica quale schema SQL è stato eseguito su Supabase
2. [ ] Decidi se upgrade a v2 o rimanere su v1
3. [ ] Se upgrade, creare migration incrementale
4. [ ] Implementare API routes coerenti con schema scelto

---

*Documento creato: 3 Dicembre 2025*
*Scopo: Evitare confusione tra 2 versioni schema validazione*
