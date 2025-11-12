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
