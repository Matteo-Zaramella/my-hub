# 🔐 Sistema Validazione Risposte - Setup Database

## 📋 Panoramica

Questo documento spiega come configurare il database per il sistema di validazione automatica delle risposte (indizi + sfide).

**Data creazione:** 28 Novembre 2025
**Stato:** Pronto per deployment

---

## 🎯 Cosa Fa Questo Sistema

Il sistema permette ai partecipanti di:
1. Inserire codici a 30 caratteri trovati negli indizi o nelle sfide
2. Ricevere punti in base all'ordine di inserimento (primi = più punti)
3. Vedere la propria posizione in classifica

**Caratteristiche chiave:**
- ✅ Case-sensitive (aB3 ≠ ab3 ≠ AB3)
- ✅ Exact match (no trim, no normalization)
- ✅ Ogni codice può essere usato una sola volta per partecipante
- ✅ Punti decrescenti in base al rank

---

## 📦 File Necessari

### 1. **Schema SQL**
- `add_answer_validation_schema.sql` - Aggiorna DB con colonne e tabelle

### 2. **Script Popolamento**
- `populate-answer-codes.mjs` - Inserisce 47 password nel DB

### 3. **Password Mapping**
- `PASSWORD_MAPPING_CONFIDENTIAL.md` - Riferimento password (NON committare!)

---

## 🚀 Procedura di Setup

### Step 1: Esegui Schema SQL su Supabase

1. Vai su [Supabase Dashboard](https://app.supabase.com)
2. Seleziona il progetto `my-hub`
3. Vai in **SQL Editor** → **New Query**
4. Copia e incolla il contenuto di `add_answer_validation_schema.sql`
5. Clicca **Run** (o F5)

**Cosa fa:**
- Aggiunge colonna `answer_code` a `game_clues`
- Aggiunge colonna `answer_code` a `game_challenges`
- Crea tabella `clue_submissions`
- Crea tabella `challenge_submissions`
- Configura RLS policies per sicurezza

**Output atteso:**
```
SUCCESS. Completed in XXms
```

---

### Step 2: Verifica Schema Creato

Esegui questa query su Supabase SQL Editor:

```sql
-- Verifica colonne aggiunte
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'game_clues'
AND column_name = 'answer_code';

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'game_challenges'
AND column_name = 'answer_code';

-- Verifica tabelle create
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('clue_submissions', 'challenge_submissions');
```

**Output atteso:**
```
answer_code | character varying

clue_submissions
challenge_submissions
```

---

### Step 3: Popola Database con Password

Esegui lo script Node.js per inserire le 47 password:

```bash
cd D:\Claude\my-hub
node scripts/populate-answer-codes.mjs
```

**Output atteso:**
```
============================================================
🔐 POPOLAMENTO DATABASE - CODICI VALIDAZIONE
============================================================

🔐 Assegnazione codici agli indizi...

📊 Trovate 11 sfide

📍 FEB - Sfida #1 (3 indizi)
   ✅ Indizio #1 → Eg2azaYN6F...
   ✅ Indizio #2 → TCPfxTnEbm...
   ✅ Indizio #3 → WEQ3VHWmfy...

[... altre sfide ...]

✅ Aggiornati 36 indizi

🎯 Assegnazione codici alle sfide...

✅ FEB Sfida #1 → FCbzg6aERC...
✅ MAR Sfida #2 → VYmwwfkEtp...
[... altre sfide ...]

✅ Aggiornate 11 sfide

🔍 Verifica assegnazioni...

✅ Indizi con codice: 36/36
✅ Sfide con codice: 11/11

✅ Verifica completata

============================================================
✅ PROCESSO COMPLETATO
============================================================
```

---

### Step 4: Verifica Password Inserite

Esegui questa query su Supabase per verificare:

```sql
-- Conta indizi con password
SELECT COUNT(*) as indizi_con_password
FROM game_clues
WHERE answer_code IS NOT NULL;

-- Conta sfide con password
SELECT COUNT(*) as sfide_con_password
FROM game_challenges
WHERE answer_code IS NOT NULL
AND start_date >= '2026-02-01'
AND start_date <= '2026-12-31';

-- Mostra primi 5 indizi (verifica case-sensitivity)
SELECT id, clue_number, challenge_id,
       LEFT(answer_code, 10) || '...' as code_preview
FROM game_clues
WHERE answer_code IS NOT NULL
LIMIT 5;
```

**Output atteso:**
```
indizi_con_password: 36
sfide_con_password: 11

id | clue_number | challenge_id | code_preview
---+-------------+--------------+------------------
1  | 1           | 1            | Eg2azaYN6F...
2  | 2           | 1            | TCPfxTnEbm...
...
```

---

## 🔒 Sicurezza

### Row Level Security (RLS)

Le policy RLS sono configurate automaticamente dallo script SQL:

**Partecipanti possono:**
- ✅ Vedere solo le proprie submissions
- ✅ Inserire solo le proprie submissions
- ❌ NON possono vedere submissions altrui
- ❌ NON possono modificare/eliminare submissions

**Admin possono:**
- ✅ Vedere tutte le submissions
- ✅ Modificare tutte le submissions

### Verifica RLS

```sql
-- Verifica policy attive
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('clue_submissions', 'challenge_submissions');
```

---

## 🧪 Test Sistema

### Test 1: Case Sensitivity

```javascript
// Test dal browser console su localhost:3000/game
// (dopo aver fatto login come partecipante)

const testCodes = [
  'Eg2azaYN6FvmBv3SfhqZZZswKb3QyS', // ✅ Corretto
  'eg2azayn6fvmbv3sfhqzzzsw kb3qys', // ❌ Lowercase
  'EG2AZAYN6FVMBV3SFHQZZZSW KB3QYS', // ❌ Uppercase
  'Eg2azaYN6FvmBv3SfhqZZZswKb3QyS ', // ❌ Spazio extra
]

for (const code of testCodes) {
  const res = await fetch('/api/validate-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      participantId: 1, // Sostituisci con ID reale
      submittedCode: code
    })
  })
  const data = await res.json()
  console.log(code.substring(0, 20), '->', data.correct)
}

// Output atteso:
// Eg2azaYN6FvmBv3SfhqZ -> true  ✅
// eg2azayn6fvmbv3sfhqz -> false ❌
// EG2AZAYN6FVMBV3SFHQZ -> false ❌
// Eg2azaYN6FvmBv3SfhqZ  -> false ❌
```

### Test 2: Rank e Punti

1. Crea 3 account partecipanti test
2. Fai validare lo stesso indizio in ordine
3. Verifica punti decrescenti:
   - 1° partecipante: 100 punti
   - 2° partecipante: 95 punti
   - 3° partecipante: 90 punti

```sql
-- Verifica rank e punti
SELECT p.participant_name, cs.submission_rank, cs.points_earned, cs.submitted_at
FROM clue_submissions cs
JOIN game_participants p ON cs.participant_id = p.id
WHERE cs.clue_id = 1
ORDER BY cs.submission_rank;
```

### Test 3: Duplicate Prevention

Prova a validare lo stesso codice due volte con lo stesso account:
- 1° tentativo: ✅ Successo + punti
- 2° tentativo: ❌ "Hai già validato questo indizio!"

---

## 📊 Query Utili

### Classifica Generale

```sql
-- Top 10 partecipanti per punti totali
SELECT
  p.participant_name,
  COALESCE(SUM(cs.points_earned), 0) + COALESCE(SUM(chs.points_earned), 0) as total_points,
  COUNT(DISTINCT cs.clue_id) as indizi_validati,
  COUNT(DISTINCT chs.challenge_id) as sfide_completate
FROM game_participants p
LEFT JOIN clue_submissions cs ON p.id = cs.participant_id
LEFT JOIN challenge_submissions chs ON p.id = chs.participant_id
GROUP BY p.id, p.participant_name
ORDER BY total_points DESC
LIMIT 10;
```

### Statistiche Indizio

```sql
-- Quanti hanno validato un indizio specifico
SELECT
  gc.clue_text,
  COUNT(cs.id) as total_submissions,
  AVG(cs.points_earned) as avg_points
FROM game_clues gc
LEFT JOIN clue_submissions cs ON gc.id = cs.clue_id
WHERE gc.id = 1
GROUP BY gc.id, gc.clue_text;
```

---

## 🚨 Troubleshooting

### Errore: "column answer_code does not exist"

**Soluzione:** Esegui di nuovo `add_answer_validation_schema.sql`

### Errore: "relation clue_submissions does not exist"

**Soluzione:** Verifica che lo script SQL sia stato eseguito completamente

### Password non vengono inserite

**Soluzione:**
1. Verifica env variables: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
2. Verifica che le sfide esistano nel DB (date 2026-02-01 a 2026-12-31)
3. Esegui `node scripts/populate-answer-codes.mjs` di nuovo

### RLS blocca inserimenti

**Soluzione:**
1. Verifica che il partecipante sia autenticato
2. Verifica che `participant_id` sia corretto
3. Controlla policy RLS su Supabase

---

## ✅ Checklist Deployment

- [ ] Eseguito `add_answer_validation_schema.sql` su Supabase
- [ ] Verificato creazione colonne `answer_code`
- [ ] Verificato creazione tabelle `clue_submissions` e `challenge_submissions`
- [ ] Eseguito `node scripts/populate-answer-codes.mjs`
- [ ] Verificato 36 indizi con password
- [ ] Verificato 11 sfide con password
- [ ] Testato case-sensitivity (aB3 vs ab3)
- [ ] Testato duplicate prevention
- [ ] Testato sistema punti e rank
- [ ] Verificato RLS policies attive
- [ ] Testato frontend tab "Valida Risposta"
- [ ] Deployment su Vercel

---

## 📝 Note Finali

**IMPORTANTE:**
- ⚠️ Le password sono case-sensitive e devono essere exact match
- ⚠️ `PASSWORD_MAPPING_CONFIDENTIAL.md` NON deve essere committato su GitHub
- ⚠️ Usa `SUPABASE_SERVICE_ROLE_KEY` solo per script backend, mai nel frontend
- ⚠️ Testa tutto su localhost prima di fare deployment su Vercel

**Contatti:**
- Creato da: Matteo Zaramella
- Data: 28 Novembre 2025
