# 🎯 Sistema Validazione - Decisione Finale

**Data:** 3 Dicembre 2025
**Status Verificato:** ✅ Nessuno schema eseguito su Supabase
**Azione Richiesta:** Eseguire SQL completo

---

## ✅ Verifica Effettuata

**Script eseguito:** `scripts/check-validation-schema.mjs`

**Risultato:**
- ❌ Colonna `answer_code` NON esiste su `game_clues`
- ❌ Colonna `answer_code` NON esiste su `game_challenges`
- ❌ Tabella `clue_submissions` NON esiste
- ❌ Tabella `challenge_submissions` NON esiste

**Conclusione:** Database pulito, nessuno schema di validazione presente.

---

## 🎯 Raccomandazione: Eseguire create_validation_system.sql

Visto che il database è pulito, **conviene eseguire direttamente la versione avanzata** (`create_validation_system.sql`) che include tutte le features:

### ✅ Vantaggi Versione Avanzata

1. **Calcolo automatico punti e rank** tramite trigger SQL
2. **Functions riusabili** per formula punteggio
3. **View leaderboard** (`participant_total_scores`) pronta all'uso
4. **Campi anti-cheating** (`ip_address`, `user_agent`)
5. **Campo `is_correct`** per tracciare anche errori
6. **Documentazione inline** con COMMENT SQL

### ⚙️ Features Tecniche

- **Trigger BEFORE INSERT**: Calcola rank e punti automaticamente
- **Formula punti indizi**: `max(1000 - (rank - 1) * 50, 450)`
- **Formula punti sfide**: `max(1200 - (rank - 1) * 60, 540)`
- **View aggregata**: Join automatico su `game_participants`, `clue_submissions`, `challenge_submissions`
- **RLS Policies**: Partecipanti vedono solo le proprie submissions, admin vede tutto

---

## 📝 Step da Seguire

### 1. Eseguire SQL su Supabase

**Link diretto:**
https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql/new

**File da copiare:**
`D:\Claude\my-hub\database\create_validation_system.sql`

**Procedura:**
1. Apri il link sopra
2. Copia tutto il contenuto del file SQL
3. Incolla nell'SQL Editor
4. Clicca **"Run"**
5. Attendi conferma esecuzione (circa 5-10 secondi)

### 2. Verificare Esecuzione

```bash
cd D:\Claude\my-hub
node scripts/check-validation-schema.mjs
```

**Output atteso:**
```
✅ Colonna answer_code esiste su game_clues
✅ Colonna answer_code esiste su game_challenges
✅ Tabella clue_submissions esiste (0 record)
✅ Tabella challenge_submissions esiste (0 record)
```

### 3. Popolare Answer Codes

Dopo aver verificato lo schema, eseguire:

```bash
node scripts/populate-answer-codes.mjs
```

**Questo script:**
- Genera 33 password NordPass per indizi (30 caratteri)
- Genera 11 password NordPass per sfide (30 caratteri)
- Inserisce i codici nel database
- Stampa un report con tutti i codici generati

**⚠️ IMPORTANTE:** Salvare l'output dello script in un file sicuro!

### 4. Testare Validazione

Creare una route API per testare:

```typescript
// app/api/validate-clue-answer/route.ts
export async function POST(request: Request) {
  const { participantCode, clueId, answerCode } = await request.json()

  // 1. Ottieni participant_id
  const { data: participant } = await supabase
    .from('game_participants')
    .select('id')
    .eq('participant_code', participantCode)
    .single()

  // 2. Ottieni answer_code corretto
  const { data: clue } = await supabase
    .from('game_clues')
    .select('answer_code')
    .eq('id', clueId)
    .single()

  // 3. Verifica match case-sensitive
  const isCorrect = answerCode === clue.answer_code

  // 4. Inserisci submission (trigger calcola punti e rank automaticamente)
  const { data: submission, error } = await supabase
    .from('clue_submissions')
    .insert({
      participant_id: participant.id,
      clue_id: clueId,
      submitted_code: answerCode,
      is_correct: isCorrect,
      ip_address: request.headers.get('x-forwarded-for'),
      user_agent: request.headers.get('user-agent')
    })
    .select('points_awarded, rank_position')
    .single()

  return Response.json({
    correct: isCorrect,
    points: submission.points_awarded,
    rank: submission.rank_position
  })
}
```

---

## 📊 Struttura Finale Database

### Tabelle Create

**1. `clue_submissions`**
```sql
- id SERIAL PRIMARY KEY
- participant_id INTEGER (FK → game_participants)
- clue_id INTEGER (FK → game_clues)
- submitted_code VARCHAR(30)
- is_correct BOOLEAN
- points_awarded INTEGER (calcolato da trigger)
- rank_position INTEGER (calcolato da trigger)
- submitted_at TIMESTAMP
- ip_address INET (anti-cheating)
- user_agent TEXT (analytics)
- UNIQUE(participant_id, clue_id)
```

**2. `challenge_submissions`**
```sql
-- Stessa struttura di clue_submissions, ma con challenge_id
```

### Functions Create

**1. `calculate_clue_points(rank_pos INTEGER) → INTEGER`**
```sql
-- Formula: max(1000 - (rank - 1) * 50, 450)
-- Esempi:
--   1° posto = 1000 punti
--   2° posto = 950 punti
--   10° posto = 550 punti
--   52° posto = 450 punti (minimo)
```

**2. `calculate_challenge_points(rank_pos INTEGER) → INTEGER`**
```sql
-- Formula: max(1200 - (rank - 1) * 60, 540)
-- Esempi:
--   1° posto = 1200 punti
--   2° posto = 1140 punti
--   10° posto = 660 punti
--   52° posto = 540 punti (minimo)
```

**3. `auto_calculate_clue_submission()` (TRIGGER FUNCTION)**
```sql
-- Eseguita BEFORE INSERT su clue_submissions
-- Conta quanti hanno già risposto correttamente PRIMA
-- Calcola rank e punti automaticamente
```

**4. `auto_calculate_challenge_submission()` (TRIGGER FUNCTION)**
```sql
-- Eseguita BEFORE INSERT su challenge_submissions
-- Stessa logica delle clue_submissions
```

### View Create

**`participant_total_scores`**
```sql
-- Aggrega automaticamente:
--   - Punti da indizi (SUM clue_submissions.points_awarded)
--   - Punti da sfide (SUM challenge_submissions.points_awarded)
--   - Punti cerimonia (game_participants.ceremony_points)
--   - Totale punti (somma di tutto)
--   - Indizi risolti (COUNT)
--   - Sfide completate (COUNT)
-- Ordinata per total_points DESC (leaderboard pronta)
```

---

## 🔐 RLS Policies Create

### Su `clue_submissions`:

1. **"Participants can view own clue submissions"**
   - SELECT: Solo proprie submissions
   - Basata su `current_setting('request.jwt.claims')`

2. **"Participants can insert own clue submissions"**
   - INSERT: Solo con proprio participant_id
   - Previene inserimenti per altri partecipanti

3. **"Admin can view all clue submissions"**
   - SELECT: Admin vedono tutto
   - Basata su `game_participants.is_admin = true`

### Su `challenge_submissions`:
- Stesse 3 policies delle clue_submissions

---

## ⚠️ Note Importanti

### 1. Constraint UNIQUE
```sql
UNIQUE(participant_id, clue_id)
UNIQUE(participant_id, challenge_id)
```

**Comportamento:**
- Ogni partecipante può rispondere **1 volta sola** a ogni indizio/sfida
- Se prova a rispondere di nuovo → errore `duplicate key value`
- Previene spam e multi-tentativi

**Gestione errori:**
```typescript
if (error?.code === '23505') {
  return Response.json({ error: 'Hai già risposto a questo indizio!' }, { status: 400 })
}
```

### 2. Case-Sensitivity
```sql
submitted_code VARCHAR(30)
```

**Match esatto richiesto:**
- `"AbC123"` ≠ `"abc123"`
- `"  trim  "` ≠ `"trim"`
- Utente deve copiare esattamente il codice

**Suggerimento UX:**
```typescript
// Trim spazi prima di inviare
const cleanCode = answerCode.trim()
```

### 3. Performance
```sql
-- Indexes già creati per performance ottimale
CREATE INDEX idx_clue_submissions_participant ON clue_submissions(participant_id);
CREATE INDEX idx_clue_submissions_clue ON clue_submissions(clue_id);
CREATE INDEX idx_clue_submissions_correct ON clue_submissions(is_correct, submitted_at);
CREATE INDEX idx_clue_submissions_timestamp ON clue_submissions(submitted_at);
```

**Query velocissime per:**
- Leaderboard (via view)
- Submission per partecipante
- Submission per indizio
- Ordine temporale risposte

---

## 🎯 TODO Dopo Esecuzione SQL

- [ ] Eseguire `create_validation_system.sql` su Supabase
- [ ] Verificare con `node scripts/check-validation-schema.mjs`
- [ ] Eseguire `node scripts/populate-answer-codes.mjs`
- [ ] Salvare output codici generati in file sicuro
- [ ] Creare API route `/api/validate-clue-answer`
- [ ] Creare API route `/api/validate-challenge-answer`
- [ ] Testare validazione con partecipanti di test
- [ ] Verificare RLS policies con utenti non-admin
- [ ] Testare leaderboard con view `participant_total_scores`

---

## 📚 Riferimenti

- **SQL Completo:** `database/create_validation_system.sql`
- **Confronto Versioni:** `database/VALIDATION_SYSTEM_COMPARISON.md`
- **Log Migrations:** `database/MIGRATIONS_LOG.md`
- **Checklist Generale:** `CHECKLIST_UNIFICATA_PRIORITA.md`

---

*Documento creato: 3 Dicembre 2025*
*Verifica effettuata: ✅ Database pulito, pronto per SQL completo*

