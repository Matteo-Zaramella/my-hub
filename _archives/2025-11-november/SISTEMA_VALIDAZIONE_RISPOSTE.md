# 🔐 Sistema Validazione Risposte Automatico

**Data creazione:** 28 Novembre 2025
**Priorità:** ALTA
**Deadline:** 15 Dicembre 2025

---

## 📋 Overview

Sistema automatizzato per la validazione delle risposte agli indizi e alle sfide mensili. Ogni partecipante potrà inserire codici unici per validare risposte e ottenere punteggi in base all'ordine di inserimento.

---

## 🎯 Requisiti Funzionali

### 1. Codici Unici (Password)

**Specifiche NordPass:**
- Generatore: NordPass Password Generator
- Lunghezza: 30 caratteri
- Composizione: Minuscole + Maiuscole + Numeri
- NO Simboli
- Esempio: `aB3dE5fG7hI9jK2lM4nO6pQ8rS1tU`

**Quantità Totale: 44 codici**
- 33 codici indizi (3 indizi × 11 sfide mensili)
- 11 codici sfide (1 per ogni sfida mensile)

**Distribuzione:**
```
Sfida Febbraio:  3 indizi + 1 sfida = 4 codici
Sfida Marzo:     3 indizi + 1 sfida = 4 codici
Sfida Aprile:    4 indizi + 1 sfida = 5 codici
Sfida Maggio:    3 indizi + 1 sfida = 4 codici
Sfida Giugno:    4 indizi + 1 sfida = 5 codici
Sfida Luglio:    3 indizi + 1 sfida = 4 codici
Sfida Agosto:    3 indizi + 1 sfida = 4 codici
Sfida Settembre: 4 indizi + 1 sfida = 5 codici
Sfida Ottobre:   3 indizi + 1 sfida = 4 codici
Sfida Novembre:  3 indizi + 1 sfida = 4 codici
Sfida Dicembre:  4 indizi + 1 sfida = 5 codici
-------------------------------------------
TOTALE:         36 indizi + 11 sfide = 47 codici
```

**CORREZIONE**: Totale effettivo = **47 codici** (non 44)

---

### 2. Flow Utente

**Step 1: Rivelazione Indizio**
1. Partecipante riceve notifica nuovo indizio rivelato (sabato 00:00)
2. Legge l'enigma dell'indizio nell'app
3. Risolve l'enigma per trovare il codice nascosto

**Step 2: Validazione Indizio**
1. Partecipante inserisce codice nel form `/game/validate-answer`
2. Sistema verifica codice nel database
3. Se corretto:
   - Registra timestamp inserimento
   - Assegna punti in base alla posizione in classifica
   - Mostra messaggio successo
4. Se errato:
   - Mostra messaggio errore generico (no hint)
   - Log tentativo fallito per analytics

**Step 3: Completamento Sfida**
1. Dopo aver validato TUTTI gli indizi di una sfida
2. Partecipante partecipa alla sfida fisica (weekend)
3. Risolve la sfida e trova il codice finale
4. Inserisce codice sfida per completamento

---

### 3. Sistema Punteggi

**Indizi (33 totali):**
- 1° classificato: 1000 punti
- 2° classificato: 950 punti
- 3° classificato: 900 punti
- 4° classificato: 850 punti
- ...
- Ultimo (52°): 450 punti
- Formula: `max(1000 - (posizione - 1) * 50, 450)`

**Sfide (11 totali):**
- 1° classificato: 1200 punti
- 2° classificato: 1140 punti
- 3° classificato: 1080 punti
- 4° classificato: 1020 punti
- ...
- Ultimo (52°): 540 punti
- Formula: `max(1200 - (posizione - 1) * 60, 540)`

**Punteggio Massimo Teorico:**
- Indizi: 33 × 1000 = 33,000 punti
- Sfide: 11 × 1200 = 13,200 punti
- Cerimonia: 100 punti (password EVOLUZIONE)
- **TOTALE: 46,300 punti**

---

## 💾 Schema Database

### Tabella: `game_clues`

Già esistente, da aggiungere campo `answer_code`:

```sql
ALTER TABLE game_clues
ADD COLUMN answer_code VARCHAR(30) UNIQUE NOT NULL DEFAULT '';

-- Index per performance
CREATE INDEX idx_game_clues_answer_code ON game_clues(answer_code);
```

**Struttura completa:**
```sql
CREATE TABLE game_clues (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER REFERENCES game_challenges(id),
  clue_number INTEGER NOT NULL,
  clue_text TEXT NOT NULL,
  reveal_date TIMESTAMP NOT NULL,
  answer_code VARCHAR(30) UNIQUE NOT NULL, -- NUOVO
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabella: `game_challenges`

Già esistente, da aggiungere campo `answer_code`:

```sql
ALTER TABLE game_challenges
ADD COLUMN answer_code VARCHAR(30) UNIQUE NOT NULL DEFAULT '';

-- Index per performance
CREATE INDEX idx_game_challenges_answer_code ON game_challenges(answer_code);
```

**Struttura completa:**
```sql
CREATE TABLE game_challenges (
  id SERIAL PRIMARY KEY,
  month VARCHAR(50) NOT NULL,
  challenge_date DATE NOT NULL,
  challenge_type VARCHAR(100),
  location VARCHAR(255),
  description TEXT,
  answer_code VARCHAR(30) UNIQUE NOT NULL, -- NUOVO
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabella: `clue_submissions` (NUOVA)

Traccia tutti i tentativi di validazione indizi:

```sql
CREATE TABLE clue_submissions (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
  clue_id INTEGER REFERENCES game_clues(id) ON DELETE CASCADE,
  submitted_code VARCHAR(30) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW(),
  points_awarded INTEGER DEFAULT 0,
  rank_position INTEGER, -- Posizione in classifica quando ha risposto

  -- Prevent duplicate correct submissions
  UNIQUE(participant_id, clue_id)
);

-- Indexes
CREATE INDEX idx_clue_submissions_participant ON clue_submissions(participant_id);
CREATE INDEX idx_clue_submissions_clue ON clue_submissions(clue_id);
CREATE INDEX idx_clue_submissions_correct ON clue_submissions(is_correct, submitted_at);
```

### Tabella: `challenge_submissions` (NUOVA)

Traccia tutti i tentativi di validazione sfide:

```sql
CREATE TABLE challenge_submissions (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
  challenge_id INTEGER REFERENCES game_challenges(id) ON DELETE CASCADE,
  submitted_code VARCHAR(30) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW(),
  points_awarded INTEGER DEFAULT 0,
  rank_position INTEGER,

  -- Prevent duplicate correct submissions
  UNIQUE(participant_id, challenge_id)
);

-- Indexes
CREATE INDEX idx_challenge_submissions_participant ON challenge_submissions(participant_id);
CREATE INDEX idx_challenge_submissions_challenge ON challenge_submissions(challenge_id);
CREATE INDEX idx_challenge_submissions_correct ON challenge_submissions(is_correct, submitted_at);
```

### RLS Policies

**clue_submissions:**
```sql
-- Partecipanti possono vedere solo le proprie submissions
ALTER TABLE clue_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view own clue submissions"
  ON clue_submissions FOR SELECT
  USING (auth.uid() = (SELECT auth_id FROM participants WHERE id = participant_id));

CREATE POLICY "Participants can insert own clue submissions"
  ON clue_submissions FOR INSERT
  WITH CHECK (auth.uid() = (SELECT auth_id FROM participants WHERE id = participant_id));
```

**challenge_submissions:**
```sql
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view own challenge submissions"
  ON challenge_submissions FOR SELECT
  USING (auth.uid() = (SELECT auth_id FROM participants WHERE id = participant_id));

CREATE POLICY "Participants can insert own challenge submissions"
  ON challenge_submissions FOR INSERT
  WITH CHECK (auth.uid() = (SELECT auth_id FROM participants WHERE id = participant_id));
```

---

## 🔧 API Routes

### `/api/validate-clue-answer`

**Method:** POST

**Request Body:**
```typescript
{
  participantId: number,
  clueId: number,
  submittedCode: string
}
```

**Response Success (200):**
```typescript
{
  success: true,
  correct: true,
  pointsAwarded: 1000,
  rankPosition: 1,
  message: "Codice indizio corretto! +1000 punti"
}
```

**Response Wrong Code (200):**
```typescript
{
  success: true,
  correct: false,
  message: "Codice non valido. Riprova."
}
```

**Response Already Submitted (400):**
```typescript
{
  success: false,
  error: "Hai già validato questo indizio."
}
```

**Logic:**
1. Verifica che l'indizio sia già rivelato (`reveal_date <= NOW()`)
2. Verifica che il partecipante non abbia già risposto correttamente
3. Query database per `answer_code` dell'indizio
4. ⚠️ **CRITICAL**: Confronta `submittedCode` con `answer_code`:
   - **EXACT MATCH** (perfect match)
   - **CASE-SENSITIVE** (`aB3` ≠ `ab3` ≠ `AB3`)
   - **NO TRIM** (spazi contano)
   - **NO NORMALIZATION** (nessuna conversione)
   - Esempio: `aB3dE5fG7hI9jK2lM4nO6pQ8rS1tU` richiede esattamente questi caratteri
5. Se corretto:
   - Conta quanti hanno già risposto correttamente (`rank_position`)
   - Calcola punti: `max(1000 - (rank_position - 1) * 50, 450)`
   - Inserisci in `clue_submissions`
6. Se errato:
   - Log tentativo fallito
   - Return messaggio generico (no hint)

### `/api/validate-challenge-answer`

**Method:** POST

**Request Body:**
```typescript
{
  participantId: number,
  challengeId: number,
  submittedCode: string
}
```

**Response Success (200):**
```typescript
{
  success: true,
  correct: true,
  pointsAwarded: 1200,
  rankPosition: 1,
  message: "Sfida completata! +1200 punti"
}
```

**Logic:** Identica a `/api/validate-clue-answer` ma con:
- Formula punti: `max(1200 - (rank_position - 1) * 60, 540)`
- Tabella `challenge_submissions`

---

## 🎨 UI Components

### `ValidateAnswerForm.tsx`

**Location:** `/app/game/components/ValidateAnswerForm.tsx`

```typescript
'use client'

import { useState } from 'react'

interface Props {
  type: 'clue' | 'challenge'
  itemId: number
  participantId: number
}

export default function ValidateAnswerForm({ type, itemId, participantId }: Props) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    correct?: boolean
    points?: number
    message: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const endpoint = type === 'clue'
      ? '/api/validate-clue-answer'
      : '/api/validate-challenge-answer'

    const body = type === 'clue'
      ? { participantId, clueId: itemId, submittedCode: code }
      : { participantId, challengeId: itemId, submittedCode: code }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      setResult(data)

      if (data.correct) {
        setCode('') // Clear input on success
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Errore di connessione. Riprova.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">
        {type === 'clue' ? '🔐 Valida Indizio' : '🏆 Valida Sfida'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-white/80 mb-2">
            Inserisci il codice trovato
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="aB3dE5fG7hI9jK2lM4nO6pQ8rS1tU"
            maxLength={30}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-mono"
            required
            disabled={loading}
          />
          <p className="text-xs text-white/40 mt-1">
            30 caratteri: maiuscole, minuscole e numeri
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || code.length !== 30}
          className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition"
        >
          {loading ? 'Verifica in corso...' : 'Valida Risposta'}
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-4 rounded-lg ${
          result.correct
            ? 'bg-green-500/20 border border-green-500/50'
            : 'bg-red-500/20 border border-red-500/50'
        }`}>
          <p className={`font-bold ${result.correct ? 'text-green-300' : 'text-red-300'}`}>
            {result.message}
          </p>
          {result.correct && result.points && (
            <p className="text-sm text-white/60 mt-2">
              Punti assegnati: +{result.points}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
```

---

## 📊 Leaderboard Real-Time

### Calcolo Punteggio Totale

```sql
-- View per punteggio totale partecipante
CREATE VIEW participant_total_scores AS
SELECT
  p.id AS participant_id,
  p.display_name,
  COALESCE(SUM(cs.points_awarded), 0) +
  COALESCE(SUM(chs.points_awarded), 0) +
  COALESCE(p.ceremony_points, 0) AS total_points
FROM participants p
LEFT JOIN clue_submissions cs ON cs.participant_id = p.id AND cs.is_correct = true
LEFT JOIN challenge_submissions chs ON chs.participant_id = p.id AND chs.is_correct = true
GROUP BY p.id, p.display_name, p.ceremony_points
ORDER BY total_points DESC;
```

---

## ✅ Task Checklist

### Phase 1: Database Setup (1-2 ore)
- [ ] Creare tabella `clue_submissions`
- [ ] Creare tabella `challenge_submissions`
- [ ] Aggiungere campo `answer_code` a `game_clues`
- [ ] Aggiungere campo `answer_code` a `game_challenges`
- [ ] Configurare RLS policies
- [ ] Creare view `participant_total_scores`

### Phase 2: Password Generation (30 min)
- [ ] Generare 47 password con NordPass (30 caratteri, no simboli)
- [ ] Salvare password in file sicuro (es. `.env.passwords` - NON committare)
- [ ] Inserire password nel database con script

### Phase 3: API Development (3-4 ore)
- [ ] Implementare `/api/validate-clue-answer`
- [ ] Implementare `/api/validate-challenge-answer`
- [ ] Rate limiting (max 10 tentativi/minuto per partecipante)
- [ ] Logging tentativi falliti
- [ ] Error handling

### Phase 4: UI Development (2-3 ore)
- [ ] Creare component `ValidateAnswerForm`
- [ ] Integrare form in pagina indizi
- [ ] Integrare form in pagina sfide
- [ ] Mostrare storico submissions partecipante
- [ ] Animazioni success/error

### Phase 5: Testing (2-3 ore)
- [ ] Test validazione codice corretto (exact match)
- [ ] Test validazione codice errato
- [ ] ⚠️ **CRITICAL**: Test case-sensitivity (`aB3` vs `ab3` vs `AB3` - tutti devono fallire tranne exact)
- [ ] Test con spazi extra (` aB3 ` deve fallire - no trim)
- [ ] Test duplicate submission (deve bloccare)
- [ ] Test calcolo punti e rank
- [ ] Test con 5 partecipanti simulati
- [ ] Test leaderboard real-time
- [ ] Test performance con 50+ submissions simultanee

### Phase 6: Security Audit (1 ora)
- [ ] Verificare RLS policies funzionanti
- [ ] Verificare codici NON visibili in frontend
- [ ] Verificare rate limiting attivo
- [ ] Test SQL injection
- [ ] Test authorization bypass

---

## 🔒 Security Considerations

**CRITICAL:**
1. ✅ Password `answer_code` NON devono MAI essere inviate al frontend
2. ✅ API routes devono verificare autenticazione partecipante
3. ✅ Rate limiting per prevenire brute force
4. ✅ Logging tentativi per detect cheating
5. ✅ RLS Supabase attivo su tutte le tabelle
6. ✅ Case-sensitive comparison per codici (no toLowerCase)

**Anti-Cheating:**
- Log IP address su submissions
- Alert se stesso partecipante > 5 tentativi falliti consecutivi
- Blocco temporaneo dopo 20 tentativi falliti (10 minuti)
- Admin dashboard per review suspicious activity

---

## 📝 Script Popolazione Database

**File:** `scripts/populate-answer-codes.mjs`

```javascript
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Password generate da NordPass (30 caratteri, no simboli)
const ANSWER_CODES = {
  clues: {
    // Febbraio (3 indizi)
    feb_1: 'aB3dE5fG7hI9jK2lM4nO6pQ8rS1tU',
    feb_2: 'cD4eF6gH8iJ0kL1mN3oP5qR7sT9uV',
    feb_3: 'eF5gH7iJ9kL1mN3oP5qR7sT9uV2wX',

    // Marzo (3 indizi)
    mar_1: 'gH6iJ8kL0mN2oP4qR6sT8uV0wX1yZ',
    mar_2: 'iJ7kL9mN1oP3qR5sT7uV9wX1yZ2aB',
    mar_3: 'kL8mN0oP2qR4sT6uV8wX0yZ1aB3cD',

    // ... continue for all 36 clues
  },
  challenges: {
    feb: 'mN9oP1qR3sT5uV7wX9yZ1aB3cD5eF',
    mar: 'oP0qR2sT4uV6wX8yZ0aB2cD4eF6gH',
    // ... continue for all 11 challenges
  }
}

async function populateAnswerCodes() {
  console.log('🔑 Populating answer codes...\n')

  // Update clues
  // (implementation here)

  // Update challenges
  // (implementation here)

  console.log('\n✅ All answer codes populated!')
}

populateAnswerCodes()
```

---

**Tempo Totale Stimato:** 10-15 ore
**Deadline:** 15 Dicembre 2025
**Responsabile:** Matteo Zaramella
