# 🚀 Guida Rapida: Esecuzione SQL su Supabase

**Obiettivo:** Sbloccare database abilitando Row Level Security (RLS)

---

## 📋 Prerequisiti

- Accesso a Supabase Dashboard: https://supabase.com/dashboard
- Project ID: `wuvuapmjclahbmngntku`

---

## ✅ Step 1: Apri SQL Editor

1. Vai a: https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql
2. Clicca su **"New Query"** o **"+"** per creare una nuova query

---

## ✅ Step 2: Esegui Script RLS

### File: `database/enable_rls_game_tables.sql`

1. Apri il file `D:\Claude\my-hub\database\enable_rls_game_tables.sql`
2. Copia **TUTTO** il contenuto (Ctrl+A, Ctrl+C)
3. Incolla nel SQL Editor di Supabase
4. Clicca **"Run"** o premi **Ctrl+Enter**

**Risultato atteso:**
```
ALTER TABLE
ALTER TABLE
... (8 volte)
CREATE POLICY
CREATE POLICY
... (10+ volte)
```

Alla fine vedrai una tabella con tutte le policies create.

---

## ✅ Step 3: Aggiungi Colonna Immagini

### File: `database/add_image_url_to_clues.sql`

1. Crea una **nuova query** (clicca "+" in alto)
2. Apri il file `D:\Claude\my-hub\database\add_image_url_to_clues.sql`
3. Copia tutto il contenuto
4. Incolla nel nuovo SQL Editor
5. Clicca **"Run"**

**Risultato atteso:**
```
ALTER TABLE
COMMENT
```

---

## ✅ Step 4: Verifica Successo

Torna alla command line e esegui:

```bash
cd D:\Claude\my-hub
node scripts/check-supabase-connection.mjs
```

**Output atteso:**
```
🔍 VERIFICA CONNESSIONE SUPABASE

📋 Testing: game_settings
   ✅ OK - 1 record

📋 Testing: game_challenges
   ✅ OK - 12 record

📋 Testing: game_clues
   ✅ OK - 37 record

... (tutte ✅ OK)

✅ Test completato
```

---

## ✅ Step 5: Testa Sito Web

1. Apri: http://localhost:3000
   - ✅ Verifica countdown visibile
   - ✅ Nessun errore in console browser (F12)

2. Apri: http://localhost:3000/game/area
   - Login con codice: `VHLZX5` (Alberto Faraldi)
   - Vai al tab **"🔍 Indizi"**
   - Espandi **"Sfida 22/02/2026"**
   - ✅ Verifica 3 card affiancate
   - ✅ Card lucchettate con icona 🔒
   - ✅ Data rivelazione: "Disponibile dal ..."

---

## 🐛 Troubleshooting

### Errore: "relation does not exist"
**Causa:** Nome tabella sbagliato
**Fix:** Verifica che le tabelle esistano nel database

### Errore: "permission denied"
**Causa:** User non ha permessi di ALTER TABLE
**Fix:** Usa l'utente admin di Supabase (quello del dashboard)

### Ancora 500 errors dopo SQL
**Causa:** RLS non applicata correttamente
**Fix:**
1. Vai su Supabase → Database → Tables
2. Clicca su `game_challenges`
3. Vai al tab "Security" (icona lucchetto)
4. Verifica che "RLS enabled" sia ON
5. Verifica che esistano policies per "SELECT"

---

## 📊 Cosa Fanno gli Script

### `enable_rls_game_tables.sql`
- Abilita RLS su 8 tabelle del gioco
- Crea policies **permissive** per lettura pubblica
- Permette INSERT su `ceremony_clues_found` e `chat_messages`
- **NON cancella** dati esistenti

### `add_image_url_to_clues.sql`
- Aggiunge colonna `image_url TEXT` a `game_clues`
- Valore default: `NULL` (non blocca il gioco)
- Permette upload immagini tramite script

---

## ⏱️ Tempo Stimato

- Step 1-3: **2 minuti**
- Step 4-5: **1 minuto**
- **Totale: 3 minuti**

---

## 🎯 Prossimi Passi Dopo SQL

Una volta completati gli step sopra:

1. ✅ Verifica date database:
   ```bash
   node scripts/verify-current-dates-v2.mjs
   ```

2. 🎨 Crea prime immagini indizi:
   - Sfida 2 (Febbraio): 3 immagini
   - Formato: 1080x1080px quadrate
   - Nomi: `sfida-2-indizio-1.jpg`, `sfida-2-indizio-2.jpg`, `sfida-2-indizio-3.jpg`

3. 📤 Upload immagini:
   ```bash
   # Metti immagine in public/indizi/
   node scripts/update-clue-image.mjs 2 1 sfida-2-indizio-1.jpg
   ```

---

**Responsabile:** Matteo Zaramella
**Data:** 5 Dicembre 2025
**Supporto:** SESSIONE_05_DIC_2025_RIEPILOGO.md
