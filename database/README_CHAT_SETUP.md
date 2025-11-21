# 💬 Setup Chat System - Il Castello di Zara

## 📋 Prerequisiti
- Accesso a Supabase Dashboard
- Progetto: wuvuapmjclahbmngntku

## 🚀 Installazione Database

### Step 1: Esegui lo Script SQL

1. Vai a Supabase SQL Editor:
   ```
   https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql/new
   ```

2. Apri il file `chat_tables.sql`

3. Copia tutto il contenuto e incollalo nell'editor SQL

4. Clicca su **Run** (o premi `Ctrl+Enter`)

5. Verifica che tutte le operazioni siano completate senza errori

### Step 2: Verifica Tabelle Create

Esegui questa query per verificare:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'game_%'
ORDER BY table_name;
```

Dovresti vedere:
- ✅ game_chat_messages
- ✅ game_chat_reactions
- ✅ game_user_profiles
- ✅ game_challenges
- ✅ game_clues
- ✅ game_config
- ✅ game_participants
- ✅ game_user_scores
- (altre tabelle esistenti...)

### Step 3: Verifica RLS (Row Level Security)

```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('game_chat_messages', 'game_user_profiles', 'game_chat_reactions');
```

Tutte dovrebbero avere `rowsecurity = true`

### Step 4: Verifica Realtime

1. Vai su: Database > Replication
2. Assicurati che queste tabelle siano pubblicate:
   - game_chat_messages ✅
   - game_user_profiles ✅
   - game_chat_reactions ✅

## 🧪 Test del Sistema

### Test 1: Crea un User Profile

```sql
-- Sostituisci con il tuo user_id da auth.users
INSERT INTO game_user_profiles (user_id, display_name, is_original_participant)
VALUES (
  'YOUR_USER_ID_HERE',
  'Test User',
  true
);
```

### Test 2: Invia un Messaggio di Prova

```sql
INSERT INTO game_chat_messages (user_id, message)
VALUES (
  'YOUR_USER_ID_HERE',
  'Ciao! Questo è un messaggio di test.'
);
```

### Test 3: Verifica i Messaggi

```sql
SELECT
  cm.id,
  cm.message,
  cm.created_at,
  up.display_name
FROM game_chat_messages cm
LEFT JOIN game_user_profiles up ON cm.user_id = up.user_id
ORDER BY cm.created_at DESC
LIMIT 10;
```

## 📊 Struttura Tabelle

### game_user_profiles
| Colonna | Tipo | Descrizione |
|---------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Riferimento a auth.users |
| display_name | TEXT | Nome visualizzato in chat |
| joined_date | TIMESTAMP | Data iscrizione |
| is_original_participant | BOOLEAN | Partecipante originale (52 persone) |
| is_online | BOOLEAN | Stato online/offline |
| last_seen | TIMESTAMP | Ultimo accesso |

### game_chat_messages
| Colonna | Tipo | Descrizione |
|---------|------|-------------|
| id | BIGSERIAL | Primary key |
| user_id | UUID | Autore del messaggio |
| message | TEXT | Contenuto del messaggio |
| is_system_message | BOOLEAN | Messaggio di sistema (es. "Chat attivata!") |
| created_at | TIMESTAMP | Data invio |

### game_chat_reactions
| Colonna | Tipo | Descrizione |
|---------|------|-------------|
| id | BIGSERIAL | Primary key |
| message_id | BIGINT | Riferimento al messaggio |
| user_id | UUID | Utente che ha reagito |
| emoji | TEXT | Emoji della reazione |

## 🔐 Sicurezza

### Politiche RLS Attive:

**User Profiles:**
- ✅ Tutti possono leggere i profili
- ✅ Gli utenti possono aggiornare solo il proprio profilo
- ✅ Gli utenti possono creare solo il proprio profilo

**Chat Messages:**
- ✅ Tutti possono leggere i messaggi
- ✅ Gli utenti autenticati possono inviare messaggi
- ✅ Gli utenti possono modificare i propri messaggi (entro 5 minuti)
- ✅ Gli utenti possono eliminare i propri messaggi (entro 5 minuti)

**Reactions:**
- ✅ Tutti possono leggere le reazioni
- ✅ Gli utenti autenticati possono aggiungere reazioni
- ✅ Gli utenti possono rimuovere le proprie reazioni

## 🎯 Prossimi Passi

Dopo aver eseguito lo script SQL:

1. ✅ Implementare il componente React ChatInterface
2. ✅ Aggiungere realtime subscriptions
3. ✅ Implementare controllo data attivazione (26/01/2026)
4. ✅ Testare con utenti multipli
5. ✅ Aggiungere notifiche per nuovi messaggi

## 🆘 Troubleshooting

### Errore: "relation already exists"
Le tabelle esistono già. Puoi:
- Skipparle (se sono identiche)
- Eliminarle e ricrearle:
  ```sql
  DROP TABLE IF EXISTS game_chat_reactions CASCADE;
  DROP TABLE IF EXISTS game_chat_messages CASCADE;
  DROP TABLE IF EXISTS game_user_profiles CASCADE;
  ```

### Errore: "permission denied"
Assicurati di essere autenticato come owner del progetto Supabase.

### Realtime non funziona
1. Verifica che le tabelle siano in Replication
2. Riavvia la connessione Supabase nel codice
3. Controlla i log in Supabase Dashboard > Logs

---

**Creato il:** 11 Novembre 2025
**Progetto:** Il Castello di Zara - My Hub
**Database:** Supabase (wuvuapmjclahbmngntku)
