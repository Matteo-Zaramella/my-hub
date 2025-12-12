# 🎮 FLOWCHART COMPLETO DEL GIOCO 2026-2027
**Creato:** 9 Dicembre 2025
**Status:** In Progress

---

## 📍 STATO ATTUALE IMPLEMENTAZIONE

### ✅ COMPLETATO

#### 1. Terminal Welcome Animation (Prima Visita)
- **Trigger:** Prima apertura del sito da parte di qualsiasi utente
- **Durata:** ~15-20 secondi
- **Comportamento:**
  - 2 secondi di schermo nero
  - Messaggio 1: "Ti ho selezionato."
  - Messaggio 2: "Hai N giorni per scoprire il mio segreto." (N = giorni countdown)
  - Messaggio 3: "Le tue azioni determineranno l'esito."
  - Messaggio 4: "Non tutto ti sarà rivelato."
  - Ogni messaggio: typing carattere per carattere → pausa → backspace carattere per carattere
  - Dopo ultimo messaggio → mostra landing page con countdown
- **localStorage:** `hasSeenWelcome` = true (non mostra più al refresh)
- **TODO:** Testi da perfezionare (per ora OK)

#### 2. Database Setup
- ✅ 12 challenges con date corrette (25/01/2026 - 27/12/2026)
- ✅ 37 indizi con date corrette
- ✅ Cerimonia Apertura = 25/01/2026 (NON Sfida 1)
- ✅ Sfida 12 = 27/12/2026 (NON Serata Finale)
- ✅ RLS policies su wishlist_items corrette

#### 3. Landing Page - Componenti Base
- ✅ Countdown timer (giorni, ore, minuti, secondi)
- ✅ Griglia 10x10 cerchi
- ✅ Wishlist pubblica (cerchio 1)
- ✅ Form registrazione (cerchio 2)
- ✅ Admin access (cerchio 10, top-right)

---

## 🎯 FLOWCHART COMPLETO

### FASE 1: PRIMA VISITA (Completata ✅)
```
Utente riceve link
    ↓
Apre sito (localhost:3000)
    ↓
Schermo nero (2 sec)
    ↓
Terminal Welcome Animation (4 messaggi)
    ↓
Landing Page con countdown
```

### FASE 2: LANDING PAGE - PRE-CERIMONIA (Parzialmente implementata ⚠️)
**Periodo:** Ora → 24/01/2026 23:59

**Elementi visibili:**
- ✅ Countdown al 25/01/2026
- ✅ Cerchio 1: Wishlist pubblica
- ✅ Cerchio 2: Form registrazione
- ✅ Cerchio 10: Admin access
- ❌ **MANCA:** Altri cerchi/funzionalità?
- ❌ **MANCA:** Interazioni con l'entità AI durante la navigazione

**Domande da risolvere:**
1. Gli altri 7 cerchi (3-9) fanno qualcosa pre-cerimonia?
2. L'entità AI riappare in qualche momento?
3. Ci sono easter eggs nascosti?

### FASE 3: CERIMONIA APERTURA (✅ DEFINITA)
**Data:** 24/01/2026 ore 22:00 → 25/01/2026 ore 02:00
**Location:** [LOCATION_DA_DEFINIRE] - Evento fisico con tutti gli invitati

**Cosa succede:**
1. ✅ **Evento Fisico** - Festa di apertura con Matteo + invitati
2. ✅ **Caccia Indizi Fisica** - Gli invitati cercano 10 indizi fisici nascosti nella location
3. ✅ **Inserimento Indizi** - Ogni indizio trovato viene inserito nella **barra di inserimento** (cerchio 100, centro landing page)
4. ✅ **Validazione Real-Time** - L'Entità AI commenta ogni tentativo (corretto/sbagliato)
5. ✅ **Illuminazione Colonne** - Ogni indizio corretto illumina una colonna (da 1 a 10)
6. ✅ **Password Finale** - Quando tutti 10 indizi trovati → appare barra per parola chiave finale: "EVOLUZIONE"
7. ✅ **Sblocco Gioco** - Inserimento corretto "EVOLUZIONE" → accesso al gioco mensile

**Sistema Tecnico:**
- Barra inserimento: LandingPage.tsx:511-529 (modale centrata)
- 10 indizi da trovare fisicamente
- Ceremony_clues table (parole + order_number)
- Ceremony_clues_found table (tracking globale per tutti)
- Password finale: "EVOLUZIONE" (hardcoded LandingPage.tsx:39)
- Entità AI: commenta ogni tentativo di inserimento

### FASE 4: PERIODO GIOCO (Febbraio-Dicembre 2026) (Da definire ❌)
**Durata:** 01/02/2026 → 27/12/2026 (11 mesi)
**Sfide:** 11 (dalla Sfida 2 alla Sfida 12)
**Indizi:** 37 totali

**Flusso tipico per ogni sfida:**
```
Settimana 1: Indizio 1 pubblicato
    ↓
Settimana 2: Indizio 2 pubblicato
    ↓
Settimana 3: Indizio 3 pubblicato (alcune sfide)
    ↓
Settimana 4: Indizio 4 pubblicato (alcune sfide)
    ↓
Fine mese: SFIDA pubblicata
    ↓
Partecipanti risolvono sfida
```

**Domande da risolvere:**
1. **Dove vengono pubblicati gli indizi?** (cerchi? popup? notifiche?)
2. **Come vengono mostrate le sfide?** (cerchio specifico? modal? pagina dedicata?)
3. **Dove si inseriscono le risposte?** (form? barra centrale?)
4. **Classifica in tempo reale?** Dove si vede?
5. **Notifiche quando esce nuovo indizio/sfida?**
6. **L'entità AI commenta le azioni?** Quando?
7. **Sistema di punti/rewards?** Come funziona?

### FASE 5: SFIDA FINALE - CERIMONIA CHIUSURA (27/12/2026) (✅ DEFINITA)
**Data:** 27/12/2026
**Cosa succede:**
- ✅ **Sfida 12** - Ultima sfida mensile del gioco
- ✅ **Cerimonia di Chiusura** - Evento che conclude il gioco annuale
- ✅ Rivela informazioni sulla serata finale (se prevista)
- ✅ Classifica finale del gioco
- ❌ **TODO:** Definire se è un evento fisico o solo online
- ❌ **TODO:** Definire il formato (sfida normale o evento speciale)

### FASE 6: POST-GIOCO (28/12/2026 → ???) (Da definire ❌)
**Periodo:** Dopo la chiusura del gioco
**Cosa succede:**
- ❌ Il sito rimane accessibile come archivio?
- ❌ Viene annunciata una serata finale di premiazione?
- ❌ Quando e dove si svolge?
- ❌ Come viene comunicato?

---

## 🔄 INTERAZIONI CON L'ENTITÀ AI

### Implementato ✅
- Terminal Welcome (prima visita)

### Da Implementare ❌
1. **Quando riappare?**
   - Dopo login?
   - Quando apri una sfida?
   - Quando trovi un indizio?
   - Random durante navigazione?

2. **Come comunica?**
   - Popup terminal-style?
   - Barra in alto/basso?
   - Voce nell'angolo?
   - Tooltip sui cerchi?

3. **Cosa dice?**
   - Commenti sulle azioni utente
   - Hint criptici
   - Countdown updates
   - Conferme/congratulazioni

---

## 🎨 ELEMENTI UI DA DEFINIRE

### Cerchi 1-10: Funzionalità
1. ✅ **Cerchio 1 (top-left):** Wishlist pubblica
2. ✅ **Cerchio 2:** Form registrazione
3. ❓ **Cerchio 3:** ???
4. ❓ **Cerchio 4:** ???
5. ❓ **Cerchio 5:** ???
6. ❓ **Cerchio 6:** ???
7. ❓ **Cerchio 7:** ???
8. ❓ **Cerchio 8:** ???
9. ❓ **Cerchio 9:** ???
10. ✅ **Cerchio 10 (top-right):** Admin access

### Area Centrale (4x4 cerchi)
- ✅ **Pre-cerimonia:** Countdown
- ❓ **Durante gioco:** ??? (sfida corrente? barra inserimento? classifica?)
- ❓ **Post-gioco:** ???

### Elementi Globali
- ❓ Barra navigazione top?
- ❓ Menu laterale?
- ❓ Notifiche?
- ❓ Chat/messaggi AI?
- ❓ Progress bar sfide completate?

---

## 📋 PROSSIMI STEP PRIORITARI

### URGENTE 🔴
1. **Definire funzionalità cerchi 3-9**
2. **Sistema pubblicazione indizi** - Come e dove appaiono?
3. **Sistema pubblicazione sfide** - Formato e interazione
4. **Barra inserimento risposte** - UI e validazione
5. **Sistema punti/classifica** - Se presente

### IMPORTANTE 🟡
6. **Interazioni AI durante gioco** - Quando e come
7. **Sistema notifiche** - Push? In-app? Email?
8. **Dashboard partecipante** - Profilo, progress, storia
9. **Mobile responsive** - Touch, layout, performance

### NICE-TO-HAVE 🟢
10. **Easter eggs** nascosti
11. **Achievements/badges**
12. **Storia/lore** progressiva
13. **Colonna sonora ambientale**

---

## 🎯 DOMANDE CHIAVE DA RISOLVERE

1. **L'utente deve registrarsi per giocare o può partecipare anonimo?**
2. **Gli indizi sono uguali per tutti o personalizzati?**
3. **Le sfide sono competitive (classifica) o collaborative?**
4. **C'è una storia/narrativa che si svela progressivamente?**
5. **Il sito è accessibile da mobile o solo desktop?**
6. **Dopo la serata finale, il sito rimane accessibile (archivio)?**

---

**Ultimo aggiornamento:** 9 Dicembre 2025, ore 12:00
