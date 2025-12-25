# 🎮 WORKFLOW COMPLETO SERATA CERIMONIA - 14 Dicembre 2025

**Data verifica:** 14 Dicembre 2025
**Server:** Dev (http://localhost:3000) + Prod
**Status:** ✅ SISTEMA PRONTO PER TESTING

---

## 📊 VERIFICA DATABASE - COMPLETATA ✅

### Indizi Cerimonia (ceremony_clue_riddles)
```
✅ 10 indizi configurati correttamente:

1. ENIGMA
2. VULCANO
3. OBELISCO
4. LABIRINTO
5. UMIDIFICATORE
6. ZAFFIRO
7. IPNOSI
8. ORCHESTRA
9. NEBULOSA
10. ERMETICO

📝 Prime lettere: E-V-O-L-U-Z-I-O-N-E
✅ Formano correttamente "EVOLUZIONE"
```

### Indizi Trovati (ceremony_clues_found)
```
✅ Attualmente: 0 indizi trovati
✅ Participant code: "GLOBAL" (stato condiviso)
✅ Pronto per ricevere i primi inserimenti
```

### Game Settings
```
✅ ceremony_active: ABILITATO
✅ password_input_enabled: ABILITATO
✅ wishlist_button_enabled: ABILITATO
❌ registration_button_enabled: DISABILITATO
❌ minigame_button_enabled: DISABILITATO
❌ maintenance_mode: (non verificato)
```

---

## 🎯 WORKFLOW SERATA - 24/25 GENNAIO 2026

### FASE 1: PRE-SERATA (Prima delle 22:00)

**Admin prepara la location:**
1. Nasconde 10 indizi fisici con le parole chiave
2. Verifica WiFi/connessione
3. Accede a `/dashboard/game-management`
4. Abilita `ceremony_active = true`
5. Verifica che `password_input_enabled = true`

**Sistema automaticamente:**
- Countdown mostra 0 giorni
- Cerchio 100 (password input) diventa cliccabile
- Griglia 10x10 pronta per illuminarsi

---

### FASE 2: ARRIVO OSPITI (22:00-22:15)

**Matteo spiega le regole:**
```
"Benvenuti! Questa sera dovete trovare 10 indizi nascosti qui nella location.
Ogni indizio è una PAROLA.
Quando ne trovate uno, aprite il sito sul telefono e cliccate il cerchio in basso a destra.
Inserite la parola e premete invio.
Se è corretta, vedrete una colonna illuminarsi.
Quando avrete trovato tutti e 10 gli indizi, vi verrà chiesta una PASSWORD FINALE.
Indovinate quella e sbloccherete l'accesso al gioco!"
```

---

### FASE 3: CACCIA AGLI INDIZI (22:15-23:30)

**Ospite trova indizio fisico (es. "ENIGMA"):**

1. Apre sito → http://localhost:3000 (o dominio pubblico)
2. Vede griglia 10x10 nera
3. Click cerchio 100 (basso-destra)
4. Modale barra bianca appare
5. Scrive "ENIGMA" → Invio

**Sistema valida (LandingPage.tsx:292-359):**
```typescript
// Input convertito in MAIUSCOLO
const input = gamePassword.trim().toUpperCase()

// Cerca corrispondenza in ceremony_clue_riddles
const foundClue = ceremonyClues.find(clue => clue.word === input)

// Se trovato E non già inserito:
if (foundClue && !foundClueWords.includes(input)) {
  // Salva in ceremony_clues_found con participant_code = 'GLOBAL'
  // Aggiorna stato locale
  // Incrementa counter: cluesFound++
  // Illumina colonna corrispondente (order_number - 1)
}
```

**Risultati possibili:**

✅ **PAROLA CORRETTA:**
- Modale si chiude
- Colonna corrispondente si illumina (bg-white)
- Counter incrementa: 1/10 → 2/10 → etc.
- Tutti vedono l'aggiornamento (stato GLOBAL)

❌ **PAROLA SBAGLIATA:**
- Modale si chiude
- Nessuna colonna si illumina
- Counter non incrementa
- Ospite riprova o cerca altro indizio

🔄 **PAROLA GIÀ TROVATA:**
- Modale si chiude
- Nessun cambio (già conteggiata)
- Ospite cerca altri indizi

---

### FASE 4: TUTTI GLI INDIZI TROVATI (23:30 circa)

**Quando cluesFound raggiunge 10:**

Sistema automaticamente:
1. Tutte le 10 colonne illuminate
2. Griglia 10x10 NASCOSTA (LandingPage.tsx:366)
3. Countdown NASCOSTO
4. **BARRA FINALE APPARE** (LandingPage.tsx:488-508)

```tsx
{cluesFound >= 10 && (
  <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
    <input placeholder="PAROLA CHIAVE FINALE" />
  </div>
)}
```

**Ospiti devono indovinare: "EVOLUZIONE"**

---

### FASE 5: PASSWORD FINALE

**Ospite inserisce tentativo (es. "RIVOLUZIONE"):**

Sistema valida:
```typescript
if (input === GAME_PASSWORD) { // "EVOLUZIONE"
  router.push('/game?password=' + encodeURIComponent(input))
}
```

✅ **PASSWORD CORRETTA ("EVOLUZIONE"):**
- Redirect automatico → `/game?password=EVOLUZIONE`
- Accesso all'area di gioco sbloccato
- **CERIMONIA COMPLETATA** 🎉

❌ **PASSWORD SBAGLIATA:**
- Modale si chiude
- Barra riappare
- Ospiti riprovano

---

### FASE 6: POST-CERIMONIA (00:00-02:00)

**Accesso game area sbloccato:**
- Matteo spiega le 11 sfide mensili
- Mostra dashboard partecipante
- Annuncia prima sfida (Febbraio 2026)
- Festa continua

**Da domani (25/01):**
- Partecipanti possono loggarsi con codici
- Aspettano Sfida 2 (21-22 Febbraio)
- Gioco mensile ufficialmente iniziato

---

## 💻 COMPONENTI TECNICI

### LandingPage.tsx - Sistema Principale

**Stati chiave:**
```typescript
cluesFound: number           // 0-10 (quanti indizi trovati)
foundClueWords: string[]     // ["ENIGMA", "VULCANO", ...]
ceremonyActive: boolean      // Da game_settings
passwordInputEnabled: boolean // Abilita cerchio 100
GAME_PASSWORD = "EVOLUZIONE" // Password finale hardcoded
```

**Flusso validazione (riga 292-359):**
1. Input convertito MAIUSCOLO
2. Check se è password finale → redirect /game
3. Check se è indizio valido → salva DB + illumina colonna
4. Altrimenti → chiudi modale

**Illuminazione colonne (riga 411-425):**
```typescript
if (ceremonyActive) {
  const foundOrders = foundClueWords
    .map(word => ceremonyClues.find(c => c.word === word)?.order - 1)
    .filter(order => order >= 0)

  if (foundOrders.includes(col)) {
    circleFill = 'bg-white' // Colonna illuminata
  }
}
```

### Database Tables

**ceremony_clue_riddles:**
```sql
clue_word: TEXT (ENIGMA, VULCANO, ...)
order_number: INT (1-10)
riddle_text: TEXT (opzionale)
```

**ceremony_clues_found:**
```sql
participant_code: TEXT ("GLOBAL")
clue_word: TEXT
created_at: TIMESTAMP
UNIQUE(participant_code, clue_word)
```

**game_settings:**
```sql
setting_key: TEXT
setting_value: BOOLEAN
```

---

## 🎨 UI/UX FLOW

### Griglia 10x10 Cerchi

**Cerchi speciali:**
- Index 0 (TOP-LEFT) = Wishlist pubblica (1)
- Index 1 = Registrazione (2) - solo se non registrato
- Index 9 (TOP-RIGHT) = Admin access
- Index 94 = Minigame Saetta McQueen (95)
- Index 99 (BOTTOM-RIGHT) = Password input (100)

**Illuminazione progressiva:**
- Order 1 → Colonna 0 (prima colonna)
- Order 2 → Colonna 1
- ...
- Order 10 → Colonna 9 (ultima colonna)

**Countdown centrale (4x4):**
- Nascosto quando countdown = 0
- Nascosto quando cluesFound >= 10

---

## 🔧 TESTING CHECKLIST

### Pre-Serata (da fare entro 23/01/2026)

- [ ] Verificare 10 indizi in ceremony_clue_riddles
- [ ] Verificare ceremony_clues_found vuota
- [ ] Test inserimento indizio corretto
- [ ] Test inserimento indizio sbagliato
- [ ] Test inserimento indizio già trovato
- [ ] Verificare illuminazione colonne 1-10
- [ ] Test password finale "EVOLUZIONE"
- [ ] Test redirect /game
- [ ] Test con 10+ utenti simultanei
- [ ] Test da mobile (iPhone/Android)
- [ ] Backup database completo

### Durante la Serata (24/01/2026)

- [ ] Admin abilita ceremony_active
- [ ] Verifica cerchio 100 cliccabile
- [ ] Monitor dashboard admin
- [ ] Counter real-time funzionante
- [ ] Tutte colonne illuminate a 10/10
- [ ] Barra finale appare automaticamente
- [ ] Password "EVOLUZIONE" funziona

---

## 📱 ADMIN DASHBOARD

**Controlli necessari:**
- View counter indizi trovati (1/10, 2/10, ...)
- Lista parole già trovate
- Abilita/disabilita ceremony_active
- Reset sistema (se necessario)
- Monitor tentativi in tempo reale

---

## ⚠️ TROUBLESHOOTING

### Problema: Colonna non si illumina
**Causa:** order_number sbagliato o parola non in DB
**Fix:** Verificare ceremony_clue_riddles

### Problema: Password EVOLUZIONE non funziona
**Causa:** Typo o case sensitivity
**Fix:** Input convertito UPPERCASE automaticamente (riga 294)

### Problema: Indizio già trovato ma dice "sbagliato"
**Causa:** UNIQUE constraint duplicato
**Fix:** Sistema ignora errore 23505 (riga 330)

### Problema: Barra finale non appare
**Causa:** cluesFound < 10
**Fix:** Verificare ceremony_clues_found in DB

---

## 🚀 NEXT STEPS

### Dopo la Cerimonia
1. Disabilita ceremony_active (opzionale)
2. Verifica tutti hanno accesso /game
3. Annuncia Sfida 2 (Febbraio)
4. Monitor prime 24h

### Gioco Mensile (Feb-Dic 2026)
- **TODO:** Definire workflow rivelazione indizi
- **TODO:** Definire workflow pubblicazione sfide
- **TODO:** Sistema punti e classifica
- **TODO:** Notifiche nuovi indizi

---

**Creato:** 14 Dicembre 2025
**Ultima modifica:** 14 Dicembre 2025
**Status:** ✅ PRONTO PER TESTING
**Giorni alla cerimonia:** 41 giorni (24/01/2026)
