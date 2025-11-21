# 🚀 Quick Start - Il Castello di Zara

## ⚡ Setup in 5 Minuti

### 1️⃣ Setup Database Chat (OBBLIGATORIO)

La chat non funziona senza questo step!

**Apri:** https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql

**Copia e incolla:**
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

CREATE POLICY "Anyone can view chat messages v2" ON game_chat_messages_v2 FOR SELECT USING (true);
CREATE POLICY "Anyone can send messages v2" ON game_chat_messages_v2 FOR INSERT WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE game_chat_messages_v2;

INSERT INTO game_chat_messages_v2 (participant_id, participant_name, participant_code, message, is_system_message)
SELECT 1, 'Sistema', 'SYSTEM', '🎉 Benvenuti nella chat di gruppo di Il Castello di Zara! Qui potrete comunicare con tutti i partecipanti in tempo reale.', true
WHERE NOT EXISTS (SELECT 1 FROM game_chat_messages_v2 WHERE is_system_message = true LIMIT 1);
```

**Clicca "Run"**

### 2️⃣ Avvia Server

```bash
cd /d/my-hub
npm run dev
```

Server: http://localhost:3000

### 3️⃣ Test GameArea

1. Vai su: http://localhost:3000/game?password=EVOLUZIONE
2. Clicca: "🚀 Accedi all'Area Game (Provvisorio)"
3. Inserisci codice: **VHLZX5**
4. Testa le 3 sezioni:
   - 💬 **Chat** - Real-time messaging
   - 🔍 **Indizi** - Placeholder
   - 🔒 **Privato** - Countdown verso 26/07/2026

## 📱 Cosa Puoi Testare

### Chat di Gruppo
- ✅ Invia messaggi
- ✅ Real-time (apri 2 finestre)
- ✅ Auto-scroll
- ✅ Messaggi sistema

### Countdown Privato
- ✅ Timer che si aggiorna ogni secondo
- ✅ Giorni, ore, minuti, secondi
- ✅ Data target: 26 Luglio 2026

### Login/Logout
- ✅ Login con codice partecipante
- ✅ Persistenza sessione (localStorage)
- ✅ Logout funzionante

## 📚 Documentazione Completa

- `IMPORTANTE_LEGGI_PRIMA.md` - Istruzioni setup
- `MODIFICHE_COMPLETATE.md` - Tutte le modifiche
- `GAME_CHAT_SYSTEM.md` - Documentazione tecnica

## 🐛 Troubleshooting

### Chat non invia messaggi
**Causa:** Tabella non creata
**Soluzione:** Esegui step 1️⃣ sopra

### Countdown non funziona
**Causa:** JavaScript disabilitato
**Soluzione:** Abilita JavaScript nel browser

### Codice partecipante non valido
**Causa:** Codice non esiste in database
**Soluzione:** Usa **VHLZX5** per testing

## ✅ Verifiche Rapide

```bash
# Verifica tabella chat
node scripts/check-chat-table.mjs

# Verifica server attivo
curl http://localhost:3000
```

---

**Tutto pronto!** 🎉

Dopo aver eseguito lo script SQL, la chat funzionerà perfettamente.
