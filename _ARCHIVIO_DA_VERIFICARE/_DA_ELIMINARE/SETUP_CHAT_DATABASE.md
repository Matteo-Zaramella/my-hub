# Setup Database per Chat di Gruppo

## ⚠️ IMPORTANTE: La tabella game_chat_messages_v2 non esiste ancora!

Per far funzionare la chat, devi creare la tabella su Supabase.

## 🚀 Istruzioni Rapide

### Metodo 1: Supabase Dashboard (Consigliato)

1. **Apri Supabase Dashboard**
   - Vai su: https://supabase.com/dashboard/project/wuvuapmjclahbmngntku

2. **Apri SQL Editor**
   - Clicca su "SQL Editor" nella sidebar sinistra
   - Oppure vai direttamente a: https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql

3. **Crea nuova Query**
   - Clicca "New Query"

4. **Copia e incolla il codice SQL**
   - Apri il file: `database/chat_messages_v2.sql`
   - Copia TUTTO il contenuto
   - Incollalo nell'editor SQL

5. **Esegui lo script**
   - Clicca "Run" o premi `Ctrl+Enter` / `Cmd+Enter`
   - Attendi il messaggio di successo

6. **Verifica**
   - Vai su "Table Editor" nella sidebar
   - Dovresti vedere la tabella `game_chat_messages_v2`

### Metodo 2: Copia veloce

Ecco il codice SQL completo da copiare:

```sql
-- ============================================
-- CHAT MESSAGES V2 - Simplified for Participants
-- ============================================

CREATE TABLE IF NOT EXISTS game_chat_messages_v2 (
  id BIGSERIAL PRIMARY KEY,
  participant_id INTEGER NOT NULL REFERENCES game_participants(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  participant_code TEXT NOT NULL,
  message TEXT NOT NULL,
  is_system_message BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chat_v2_created_at ON game_chat_messages_v2(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_v2_participant_id ON game_chat_messages_v2(participant_id);

-- RLS
ALTER TABLE game_chat_messages_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view chat messages v2"
  ON game_chat_messages_v2 FOR SELECT
  USING (true);

CREATE POLICY "Anyone can send messages v2"
  ON game_chat_messages_v2 FOR INSERT
  WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE game_chat_messages_v2;

-- Welcome message
INSERT INTO game_chat_messages_v2 (participant_id, participant_name, participant_code, message, is_system_message)
SELECT 1, 'Sistema', 'SYSTEM', '🎉 Benvenuti nella chat di gruppo di A Tutto Reality: La Rivoluzione! Qui potrete comunicare con tutti i partecipanti in tempo reale.', true
WHERE NOT EXISTS (SELECT 1 FROM game_chat_messages_v2 WHERE is_system_message = true LIMIT 1);
```

## ✅ Verifica Setup

Dopo aver eseguito lo script SQL, verifica con:

```bash
cd /d/my-hub
node scripts/check-chat-table.mjs
```

Dovresti vedere: `✅ Table exists!`

## 🧪 Test Chat

1. Ricarica la pagina: http://localhost:3000/game/area
2. Accedi con un codice partecipante valido
3. Vai sulla tab "💬 Chat"
4. Prova a inviare un messaggio
5. Apri una seconda finestra per testare il real-time

## 🐛 Troubleshooting

### Errore "Could not find the table"
- La tabella non esiste ancora, esegui lo script SQL su Supabase Dashboard

### Errore "Errore durante l'invio del messaggio"
- Verifica che le RLS policies siano attive
- Controlla console browser per dettagli errore
- Verifica che il participant_id sia valido

### Messaggio non appare in tempo reale
- Verifica che Realtime sia abilitato su Supabase Dashboard
- Controlla che la tabella sia nella pubblicazione realtime
- Ricarica la pagina

### Errore "violates foreign key constraint"
- Il participant_id non esiste nella tabella game_participants
- Verifica che il partecipante sia loggato correttamente
- Controlla localStorage: `game_participant`

## 📊 Monitoraggio

### Vedere tutti i messaggi

```sql
SELECT * FROM game_chat_messages_v2
ORDER BY created_at DESC
LIMIT 50;
```

### Contare messaggi per partecipante

```sql
SELECT
  participant_name,
  COUNT(*) as total_messages
FROM game_chat_messages_v2
WHERE is_system_message = false
GROUP BY participant_name
ORDER BY total_messages DESC;
```

### Cancellare tutti i messaggi (testing)

```sql
DELETE FROM game_chat_messages_v2 WHERE is_system_message = false;
```

---

**Dopo aver creato la tabella, la chat funzionerà perfettamente!** 🎉
