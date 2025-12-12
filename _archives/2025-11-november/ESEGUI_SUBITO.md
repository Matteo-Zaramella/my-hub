# 🚀 DA ESEGUIRE SUBITO SU SUPABASE

## Apri SQL Editor
**Link:** https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql

---

## Script 1: Aggiungi Colonna Punteggio

```sql
ALTER TABLE game_participants
ADD COLUMN IF NOT EXISTS current_points INTEGER DEFAULT 0 NOT NULL;

CREATE INDEX IF NOT EXISTS idx_game_participants_points ON game_participants(current_points DESC);
```

**Clicca "Run"**

---

## Script 2: Aggiungi Categoria Vigodarzere

```sql
ALTER TABLE game_participants DROP CONSTRAINT IF EXISTS game_participants_category_check;

ALTER TABLE game_participants
ADD CONSTRAINT game_participants_category_check
CHECK (category IN ('Arcella', 'Mare', 'Severi', 'Mortise', 'Famiglia', 'Colleghi', 'Amici', 'Vigodarzere') OR category IS NULL);
```

**Clicca "Run"**

---

## Script 3: Aggiungi Colonna Email

```sql
ALTER TABLE game_participants
ADD COLUMN IF NOT EXISTS email TEXT;

CREATE INDEX IF NOT EXISTS idx_game_participants_email ON game_participants(email);
```

**Clicca "Run"**

---

## ✅ Fatto!

Dopo aver eseguito questi 3 script, potrai:

1. **Vedere colonne: Punteggio ed Email** nella tabella partecipanti
2. **Usare il form "➕ Aggiungi Partecipante"** per aggiungere nuovi partecipanti
3. **Modificare TUTTO inline** cliccando "✏️ Modifica":
   - Telefono
   - Instagram
   - Email
   - Categoria
   - Partner

---

## 📋 Istruzioni per Aggiungere Partecipanti

1. Vai su `/dashboard/game-management`
2. Clicca tab "Partecipanti"
3. Clicca pulsante verde "➕ Aggiungi Partecipante"
4. Compila:
   - Nome e Cognome *
   - Telefono (opzionale)
   - Instagram (opzionale)
   - Email (opzionale)
   - Categoria * (seleziona dal menu)
   - In coppia (checkbox)
   - Nome Partner (se in coppia)
5. Clicca "✓ Aggiungi"
6. Il codice viene generato automaticamente!

## 📝 Istruzioni per Modificare Partecipanti

1. Vai su `/dashboard/game-management`
2. Clicca tab "Partecipanti"
3. Trova il partecipante da modificare (usa filtri/cerca)
4. Clicca pulsante "✏️ Modifica" nella colonna Azioni
5. Modifica i campi che vuoi:
   - Telefono
   - Instagram
   - Email
   - Categoria (menu dropdown)
   - Partner
6. Clicca "💾 Salva" per confermare
7. Oppure clicca "✕" per annullare

### Esempio: Gaia Zordan
- Nome: Gaia Zordan
- Categoria: Vigodarzere
- Codice generato: GZ12 (esempio)

---

**Nota:** Per modificare le categorie dei partecipanti esistenti, usa il filtro e la ricerca per trovarli, poi modifica manualmente usando il pulsante edit (prossima funzionalità) oppure eseguendo SQL diretti.

---

## Script 4: Crea Tabella Indizi Cerimonia Apertura

```sql
-- Tabella per tracciare quali indizi ogni partecipante ha trovato
CREATE TABLE IF NOT EXISTS ceremony_clues_found (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_code TEXT NOT NULL REFERENCES game_participants(participant_code) ON DELETE CASCADE,
  clue_word TEXT NOT NULL, -- Es: ENIGMA, VULCANO, etc.
  found_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_code, clue_word)
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_ceremony_clues_participant ON ceremony_clues_found(participant_code);
CREATE INDEX IF NOT EXISTS idx_ceremony_clues_word ON ceremony_clues_found(clue_word);
CREATE INDEX IF NOT EXISTS idx_ceremony_clues_found_at ON ceremony_clues_found(found_at);

-- RLS Policy
ALTER TABLE ceremony_clues_found ENABLE ROW LEVEL SECURITY;

-- Policy: Chiunque autenticato può leggere
CREATE POLICY "Anyone can read ceremony clues" ON ceremony_clues_found
  FOR SELECT USING (true);

-- Policy: Chiunque autenticato può inserire (trovare indizi)
CREATE POLICY "Anyone can insert ceremony clues" ON ceremony_clues_found
  FOR INSERT WITH CHECK (true);
```

**Clicca "Run"**

**Cosa fa:**
- Crea tabella `ceremony_clues_found` per tracciare indizi trovati
- Ogni riga = 1 indizio trovato da 1 partecipante
- UNIQUE constraint impedisce duplicati (stesso partecipante non può trovare stesso indizio 2 volte)
- Timestamp per sapere quando è stato trovato
- RLS abilitato per sicurezza

---

## Script 5: Aggiungi Campo Presenza Serata Apertura

```sql
-- Aggiungi campo per tracciare chi era presente alla serata di apertura
ALTER TABLE game_participants
ADD COLUMN IF NOT EXISTS present_at_opening BOOLEAN DEFAULT false NOT NULL;

-- Indice per query veloci sui presenti
CREATE INDEX IF NOT EXISTS idx_game_participants_present_opening ON game_participants(present_at_opening);

-- Aggiungi campo per tracciare se ha ricevuto i punti bonus serata apertura
ALTER TABLE game_participants
ADD COLUMN IF NOT EXISTS opening_bonus_awarded BOOLEAN DEFAULT false NOT NULL;
```

**Clicca "Run"**

**Cosa fa:**
- Aggiunge campo `present_at_opening` (default: false) per marcare chi era alla festa
- Aggiunge campo `opening_bonus_awarded` per evitare duplicati punti
- Crea indice per performance query

---

## Script 6: Aggiungi Campo Iscrizione Completata

```sql
-- Aggiungi campo per tracciare chi ha completato il form di iscrizione
ALTER TABLE game_participants
ADD COLUMN IF NOT EXISTS registration_completed BOOLEAN DEFAULT false NOT NULL;

-- Indice per query veloci sugli iscritti
CREATE INDEX IF NOT EXISTS idx_game_participants_registration ON game_participants(registration_completed);
```

**Clicca "Run"**

**Cosa fa:**
- Aggiunge campo `registration_completed` (default: false)
- Quando il partecipante compila il form → diventa true
- Il cerchio rosso sulla homepage diventa bianco quando tutti hanno completato

---
