# 🧪 Test Chat - Istruzioni Rapide

**Data:** 11 Novembre 2025
**Status:** ✅ Codice implementato, pronto per test

---

## ✅ Cosa è Stato Fatto

1. ✅ **Database Schema creato** - File: `database/chat_tables.sql`
2. ✅ **Componente Chat implementato** - File: `app/game/GroupChat.tsx`
3. ✅ **Integrazione nella pagina Game** - File: `app/game/PasswordSuccess.tsx`
4. ✅ **Titolo pagina aggiornato** - "The Game - Matteo Zaramella"
5. ✅ **Data modificata temporaneamente** - Per test immediato (2025-11-11)

---

## 🎯 STEP 1: Esegui Script SQL in Supabase

**⚠️ OBBLIGATORIO PRIMA DI TESTARE**

1. Apri questo link:
   ```
   https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql/new
   ```

2. Apri il file `D:\my-hub\database\chat_tables.sql` sul tuo PC

3. Copia **TUTTO** il contenuto (dalle prime righe fino alla fine)

4. Incollalo nell'SQL Editor di Supabase

5. Clicca sul pulsante **"Run"** (o premi Ctrl+Enter)

6. Verifica che non ci siano errori in rosso

7. Dovresti vedere messaggi tipo:
   - ✅ CREATE TABLE
   - ✅ CREATE INDEX
   - ✅ CREATE POLICY
   - ✅ ALTER PUBLICATION

---

## 🧪 STEP 2: Testa la Chat

**Il server è già attivo su:** http://localhost:3000

### Test Senza Login (solo visualizzazione)

1. Apri il browser

2. Vai su: http://localhost:3000/game?password=EVOLUZIONE

3. Dovresti vedere:
   - ✅ Card "Hai indovinato!" con 100 punti
   - ✅ Card Chat ATTIVA (non più bloccata!)
   - ✅ Interfaccia chat con input messaggio

### Test Con Login (invio messaggi)

1. Vai su: http://localhost:3000/login

2. Fai login con un account esistente (o crea un nuovo account)

3. Dopo il login, vai su: http://localhost:3000/game?password=EVOLUZIONE

4. Ora dovresti poter:
   - ✅ Inviare messaggi
   - ✅ Vedere il tuo nome utente
   - ✅ Vedere i messaggi in tempo reale

### Test Real-Time (2 utenti)

1. **Finestra 1:** Login con primo utente → vai su /game?password=EVOLUZIONE

2. **Finestra 2 (Incognito):** Login con secondo utente → vai su /game?password=EVOLUZIONE

3. Scrivi un messaggio dalla Finestra 1

4. Verifica che appaia immediatamente nella Finestra 2 (senza refresh!)

---

## 📱 Come Appare la Chat

### Quando ATTIVA (data corrente):
```
┌─────────────────────────────────┐
│ 💬 Chat di Gruppo    ● 2 online│
├─────────────────────────────────┤
│                                 │
│  [nome] Ciao!          10:30   │
│                                 │
│       Ciao anche a te! 10:31   │
│                                 │
├─────────────────────────────────┤
│ [Scrivi un messaggio...] [📤]  │
└─────────────────────────────────┘
```

### Quando BLOCCATA (dopo ripristino data):
```
┌─────────────────────────────────┐
│             🔒                  │
│   Chat non ancora attiva        │
│                                 │
│      26 Gennaio 2026            │
│         ore 00:00               │
│                                 │
│   Tempo rimanente:              │
│    074g 13h 32m                 │
└─────────────────────────────────┘
```

---

## 🔧 Possibili Problemi e Soluzioni

### ❌ "Table game_chat_messages does not exist"
**Soluzione:** Non hai eseguito lo script SQL. Vai allo STEP 1.

### ❌ Chat bloccata anche se dovrebbe essere attiva
**Soluzione:** Verifica che la data in `PasswordSuccess.tsx` sia `2025-11-11` (non `2026-01-26`)

### ❌ "Cannot send message" o input disabilitato
**Soluzione:**
1. Verifica di aver fatto login
2. Controlla console browser (F12) per errori
3. Verifica politiche RLS in Supabase

### ❌ Messaggi non arrivano in real-time
**Soluzione:**
1. Vai su Supabase Dashboard > Database > Replication
2. Verifica che `game_chat_messages` sia nella lista delle tabelle replicate
3. Refresh la pagina

### ❌ "Auth error" o "User not found"
**Soluzione:**
1. Fai logout e login di nuovo
2. Prova a creare un nuovo account
3. Verifica che Supabase Auth sia attivo

---

## 🎬 Video Test - Scenario Completo

1. ✅ Apri browser → vai su localhost:3000
2. ✅ Clicca su cerchio per accesso game (angolo basso destra)
3. ✅ Inserisci password: EVOLUZIONE
4. ✅ Vedi pagina successo + chat attiva
5. ✅ Fai login se non sei loggato
6. ✅ Scrivi "Ciao!" nella chat
7. ✅ Apri finestra incognito
8. ✅ Login con altro utente
9. ✅ Vai su /game?password=EVOLUZIONE
10. ✅ Vedi il messaggio "Ciao!" apparire in tempo reale

---

## ⚠️ IMPORTANTE: Ripristina Data Prima di Committare

**Quando hai finito di testare:**

1. Apri `D:\my-hub\app\game\PasswordSuccess.tsx`

2. Cerca la riga 11:
   ```typescript
   const CHAT_ACTIVATION_DATE = new Date('2025-11-11T00:00:00')
   ```

3. Cambiala in:
   ```typescript
   const CHAT_ACTIVATION_DATE = new Date('2026-01-26T00:00:00')
   ```

4. Salva il file

5. La chat tornerà bloccata fino al 26 Gennaio 2026

**Oppure usa questo comando rapido:**
```bash
cd D:\my-hub
sed -i "11s/2025-11-11/2026-01-26/" app/game/PasswordSuccess.tsx
```

---

## 📊 Checklist Finale

### Prima di committare:
- [ ] Script SQL eseguito senza errori
- [ ] Chat testata e funzionante
- [ ] Real-time testato con 2 utenti
- [ ] Data ripristinata a 2026-01-26
- [ ] Titolo pagina verificato ("The Game - Matteo Zaramella")
- [ ] Server in esecuzione correttamente

### Da committare:
- ✅ `database/chat_tables.sql` - Script database
- ✅ `database/README_CHAT_SETUP.md` - Istruzioni setup
- ✅ `app/game/GroupChat.tsx` - Componente chat
- ✅ `app/game/PasswordSuccess.tsx` - Integrazione chat
- ✅ `app/layout.tsx` - Titolo aggiornato
- ✅ `CHAT_SETUP_COMPLETE.md` - Documentazione completa
- ✅ Questo file (opzionale)

---

## 🚀 Prossimi Passi Dopo il Test

1. **Ripristina la data** a 2026-01-26
2. **Commit delle modifiche** con messaggio descrittivo
3. **Push su GitHub**
4. **Deploy su Vercel** (opzionale, per test produzione)
5. **Pianifica contenuti** (9 indizi anagramma mancanti)

---

## 📞 Link Utili

- **Localhost:** http://localhost:3000
- **Game Page:** http://localhost:3000/game?password=EVOLUZIONE
- **Supabase SQL:** https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql
- **Supabase Tables:** https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/editor

---

**Creato il:** 11 Novembre 2025
**Server attivo:** ✅ http://localhost:3000
**Pronto per test:** ✅ SÌ (dopo script SQL)

🎉 **Buon test!** 🎉
