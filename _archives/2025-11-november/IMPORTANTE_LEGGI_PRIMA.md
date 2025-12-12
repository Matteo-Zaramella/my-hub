# ⚠️ IMPORTANTE: Setup Database Chat

## 🚨 LA CHAT NON FUNZIONA ANCORA!

Per far funzionare la chat, devi **creare la tabella** su Supabase.

---

## ✅ ISTRUZIONI VELOCI (5 minuti)

### 1️⃣ Apri Supabase SQL Editor

Clicca qui: **https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql**

### 2️⃣ Clicca "New Query"

### 3️⃣ Copia questo codice SQL

```sql
CREATE TABLE IF NOT EXISTS game_chat_messages_v2 (
  id BIGSERIAL PRIMARY KEY,
  participant_id INTEGER NOT NULL REFERENCES game_participants(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  participant_code TEXT NOT NULL,
  message TEXT NOT NULL,
  is_system_message BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_v2_created_at ON game_chat_messages_v2(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_v2_participant_id ON game_chat_messages_v2(participant_id);

ALTER TABLE game_chat_messages_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view chat messages v2"
  ON game_chat_messages_v2 FOR SELECT USING (true);

CREATE POLICY "Anyone can send messages v2"
  ON game_chat_messages_v2 FOR INSERT WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE game_chat_messages_v2;

INSERT INTO game_chat_messages_v2 (participant_id, participant_name, participant_code, message, is_system_message)
SELECT 1, 'Sistema', 'SYSTEM', '🎉 Benvenuti nella chat di gruppo di A Tutto Reality: La Rivoluzione! Qui potrete comunicare con tutti i partecipanti in tempo reale.', true
WHERE NOT EXISTS (SELECT 1 FROM game_chat_messages_v2 WHERE is_system_message = true LIMIT 1);
```

### 4️⃣ Incolla nell'editor e clicca "Run"

### 5️⃣ Verifica che funziona

```bash
node scripts/check-chat-table.mjs
```

Dovresti vedere: **✅ Table exists!**

---

## 🎮 Dopo il Setup

1. Vai su: http://localhost:3000/game?password=EVOLUZIONE
2. Clicca "Accedi all'Area Game (Provvisorio)"
3. Inserisci codice partecipante: **VHLZX5** (Alberto Faraldi)
4. Vai sulla tab **💬 Chat**
5. Scrivi un messaggio
6. **Funzionerà!** 🎉

---

## 📊 Modifiche Recenti

### ✅ Sezione Privato
- Rinominata da "Classifica" a "Privato"
- Aggiunto countdown verso 26/07/2026
- Real-time: giorni, ore, minuti, secondi

### ✅ Chat di Gruppo
- Real-time messaging con Supabase
- Auto-scroll
- Messaggi sistema evidenziati
- **NOTA**: Richiede setup database!

---

**Tempo richiesto**: 5 minuti
**Difficoltà**: Facile (copia e incolla)

Dopo aver eseguito lo script SQL, **tutto funzionerà perfettamente!** ✨
