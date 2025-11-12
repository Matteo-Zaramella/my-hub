# 🚀 ESEGUI SUBITO - Script SQL Supabase

**Data:** 11 Novembre 2025
**Priorità:** 🚨 CRITICA - Da eseguire IMMEDIATAMENTE

---

## 📝 Cosa fa questo script?

Questo script completo configura tutto il database necessario per The Game:

### Fix Critici
- ✅ Aggiunge colonna `note` in `workout_sessions` (BLOCCANTE - il codice la richiede)
- ✅ Aggiunge colonna `current_points` in `game_participants` (per punteggi)
- ✅ Aggiunge colonna `email` in `game_participants`

### Categorie Partecipanti
- ✅ Aggiunge categoria "Vigodarzere" al vincolo CHECK
- ✅ Aggiorna categorie per 14 partecipanti esistenti:
  - Angelica Bettella → Mortise
  - Benedetta → Arcella
  - Elena → Severi
  - Elisa Volpatti → Severi
  - Emanuele Pedroni → Arcella
  - Colombin → Vigodarzere
  - Pasini → Severi
  - Corricelli → Famiglia
  - Giulia → Mare
  - Giulio → Arcella
  - Bortolami → Arcella
  - Barnaba → Vigodarzere
  - Sara Giacometti → Arcella
  - Sophia Gardin → Severi

### Sistema Chat
- ✅ Tabella `game_chat_messages_v2` (chat area pubblica)
- ✅ Tabella `game_chat_messages` (chat dashboard admin)
- ✅ Tabella `game_user_profiles` (profili utenti)
- ✅ Tabella `game_chat_reactions` (reazioni messaggi - feature futura)
- ✅ RLS policies complete
- ✅ Realtime subscriptions attive
- ✅ Indexes per performance

---

## 🔧 STEP 1: Apri Supabase SQL Editor

**Link diretto:**
👉 https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql

1. Clicca sul link sopra
2. Fai login se necessario
3. Dovresti vedere l'editor SQL

---

## 📋 STEP 2: Copia lo Script

1. Apri il file: `database/ESEGUI_TUTTO_SUPABASE.sql`
2. Seleziona TUTTO il contenuto (Ctrl+A / Cmd+A)
3. Copia (Ctrl+C / Cmd+C)

**File location completo:**
```
D:\my-hub\database\ESEGUI_TUTTO_SUPABASE.sql
```

---

## ▶️ STEP 3: Esegui lo Script

1. Nell'editor SQL di Supabase, incolla lo script copiato (Ctrl+V / Cmd+V)
2. Clicca il pulsante verde **"RUN"** in basso a destra
3. Aspetta che finisca (dovrebbe durare 2-5 secondi)

---

## ✅ STEP 4: Verifica Risultati

Dopo l'esecuzione, dovresti vedere nella sezione "Results":

### 1. CATEGORIE AGGIORNATE
Una tabella che mostra i partecipanti con categorie aggiornate:
- Categoria: Vigodarzere (Colombin, Barnaba)
- Categoria: Mortise (Angelica Bettella)
- Categoria: Severi (Elena, Elisa Volpatti, Pasini, Sophia Gardin)
- Categoria: Arcella (Benedetta, Emanuele Pedroni, Giulio, Bortolami, Sara Giacometti)
- Categoria: Famiglia (Corricelli)
- Categoria: Mare (Giulia)

### 2. COLONNE PARTECIPANTI
```
column_name      | data_type | is_nullable
-----------------|-----------|-------------
current_points   | integer   | NO
email            | text      | YES
```

### 3. TABELLE CHAT
```
table_name
--------------------------
game_chat_messages
game_chat_messages_v2
game_chat_reactions
game_user_profiles
```

### 4. MESSAGGI CHAT V2
```
total_messages | system_messages
---------------|----------------
1              | 1
```
(Il messaggio di benvenuto del sistema)

---

## ⚠️ Se Vedi Errori

### Errore: "column already exists"
✅ **SICURO - Ignora**
Significa che la colonna esiste già. Lo script usa `IF NOT EXISTS` quindi è normale.

### Errore: "table already exists"
✅ **SICURO - Ignora**
Significa che la tabella esiste già. Lo script usa `IF NOT EXISTS` quindi è normale.

### Errore: "policy already exists"
✅ **SICURO - Ignora**
Lo script prima elimina le policy esistenti (`DROP POLICY IF EXISTS`) quindi è normale.

### Errore: "relation does not exist"
❌ **PROBLEMA**
Significa che manca una tabella base (es. `game_participants`).
**Azione:** Contatta Claude Code con lo screenshot dell'errore.

### Errore: "permission denied"
❌ **PROBLEMA**
Significa che non hai i permessi necessari.
**Azione:** Verifica di essere loggato come owner del progetto Supabase.

---

## 🎯 STEP 5: Testa il Risultato

### Test 1: Dashboard Partecipanti

1. Vai su: http://localhost:3000/dashboard/game-management
2. Clicca tab "Partecipanti"
3. **Verifica che vedi:**
   - ✅ Colonna "Punteggio" nella tabella
   - ✅ Colonna "Email" nella tabella
   - ✅ Pulsante verde "➕ Aggiungi Partecipante"
   - ✅ Pulsante "✏️ Modifica" per ogni partecipante
   - ✅ Frecce ordinamento su tutte le colonne

### Test 2: Sorting Tabella

1. Clicca sulla freccia vicino a "Punteggio"
2. **Verifica:**
   - La tabella si ordina per punteggio
   - La freccia cambia direzione (↑ ↓)
3. Prova anche con: Nome, Categoria, Partner, Codice

### Test 3: Filtro Categoria "Vigodarzere"

1. Nel menu "Categoria", seleziona "Vigodarzere"
2. **Verifica:**
   - Vedi solo Colombin e Barnaba
   - (Dopo aver aggiunto Gaia Zordan, vedrai anche lei)

### Test 4: Form Aggiungi Partecipante

1. Clicca "➕ Aggiungi Partecipante"
2. Il form si apre
3. **Verifica campi presenti:**
   - Nome e Cognome *
   - Telefono
   - Instagram
   - Email ← **NUOVO**
   - Categoria (dropdown con Vigodarzere)
   - In coppia (checkbox)
   - Nome Partner

### Test 5: Modifica Inline

1. Trova un partecipante qualsiasi
2. Clicca "✏️ Modifica"
3. **Verifica:**
   - Tutti i campi diventano modificabili
   - Campo Email è presente
   - Categoria è un dropdown
   - Pulsanti "💾 Salva" e "✕ Annulla" appaiono

---

## 🆕 Prossima Azione: Aggiungi Gaia Zordan

Dopo aver verificato che tutto funziona:

1. Clicca "➕ Aggiungi Partecipante"
2. Compila:
   - **Nome e Cognome:** Gaia Zordan
   - **Telefono:** (lascia vuoto o aggiungi se ce l'hai)
   - **Instagram:** (lascia vuoto o aggiungi se ce l'hai)
   - **Email:** (lascia vuoto o aggiungi se ce l'hai)
   - **Categoria:** Vigodarzere
   - **In coppia:** No (deselezionato)
3. Clicca "✓ Aggiungi"
4. **Verifica:**
   - Gaia Zordan appare nella tabella
   - Ha un codice auto-generato (es. GZ47)
   - Categoria = Vigodarzere
   - Punteggio = 0

---

## 📊 Riepilogo Modifiche Database

### Tabelle Modificate
| Tabella | Modifiche |
|---------|-----------|
| `workout_sessions` | + colonna `note` |
| `game_participants` | + colonna `current_points`<br>+ colonna `email`<br>+ categoria "Vigodarzere"<br>+ 14 categorie aggiornate |

### Tabelle Create
| Tabella | Scopo |
|---------|-------|
| `game_chat_messages_v2` | Chat pubblica area game (partecipanti) |
| `game_chat_messages` | Chat admin dashboard (auth users) |
| `game_user_profiles` | Profili utenti con stato online |
| `game_chat_reactions` | Reazioni ai messaggi (feature futura) |

### Indexes Creati
- `idx_game_participants_points` - Ordinamento punteggi
- `idx_game_participants_email` - Ricerca email
- `idx_chat_v2_created_at` - Messaggi recenti chat v2
- `idx_chat_v2_participant_id` - Filtraggio partecipante
- `idx_chat_messages_created_at` - Messaggi recenti chat auth
- `idx_chat_messages_user_id` - Filtraggio utente
- `idx_user_profiles_user_id` - Lookup profili
- `idx_user_profiles_online` - Lista utenti online
- `idx_chat_reactions_message_id` - Lookup reazioni

### RLS Policies Create
- ✅ 3 policies per `game_user_profiles`
- ✅ 4 policies per `game_chat_messages`
- ✅ 3 policies per `game_chat_reactions`
- ✅ 2 policies per `game_chat_messages_v2`

### Realtime Subscriptions
- ✅ `game_chat_messages_v2`
- ✅ `game_chat_messages`
- ✅ `game_user_profiles`
- ✅ `game_chat_reactions`

---

## 🔍 Troubleshooting

### Dashboard non mostra colonna Punteggio/Email
1. Fai hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
2. Verifica che lo script SQL sia stato eseguito
3. Controlla console browser (F12) per errori

### Form "Aggiungi Partecipante" non si apre
1. Hard refresh della pagina
2. Controlla console browser per errori
3. Verifica che il server dev sia attivo: http://localhost:3000

### Modifica Inline non funziona
1. Hard refresh della pagina
2. Verifica colonna `email` creata in Supabase
3. Controlla console browser per errori Supabase

### Categoria Vigodarzere non appare
1. Verifica che lo script SQL sia stato eseguito completamente
2. Controlla constraint:
   ```sql
   SELECT constraint_name, check_clause
   FROM information_schema.check_constraints
   WHERE constraint_name = 'game_participants_category_check';
   ```
3. Dovrebbe mostrare: `... 'Vigodarzere' ...`

---

## ✅ Checklist Completa

Prima di procedere al prossimo task, verifica:

- [ ] Script SQL eseguito senza errori bloccanti
- [ ] Colonna Punteggio visibile in dashboard
- [ ] Colonna Email visibile in dashboard
- [ ] Ordinamento funziona su tutte le colonne
- [ ] Filtro categoria mostra "Vigodarzere"
- [ ] Form "Aggiungi Partecipante" si apre
- [ ] Campo Email presente nel form
- [ ] Pulsante "Modifica" funziona
- [ ] Campi modificabili in modalità edit
- [ ] Categoria Vigodarzere selezionabile
- [ ] Gaia Zordan aggiunta con successo
- [ ] Chat tables create in Supabase

---

## 📞 Supporto

Se riscontri problemi:

1. **Screenshot errore** nell'SQL Editor di Supabase
2. **Console browser** (F12 > Console tab)
3. **Descrizione problema** dettagliata

Fornisci queste informazioni per assistenza rapida.

---

**Tempo stimato:** 10-15 minuti totali
**Difficoltà:** Bassa (copia-incolla)
**Impatto:** 🚨 CRITICO - Sblocca tutte le funzionalità

---

**Creato da:** Claude Code
**Progetto:** The Game - My Hub
**Database:** Supabase (wuvuapmjclahbmngntku)
