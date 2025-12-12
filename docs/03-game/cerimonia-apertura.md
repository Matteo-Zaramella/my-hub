# 🎉 FLOWCHART DETTAGLIATO - CERIMONIA APERTURA 24-25 GENNAIO 2026

**Data:** 24 Gennaio 2026 (22:00) → 25 Gennaio 2026 (02:00)
**Location:** [LOCATION_DA_DEFINIRE]
**Tipo:** Evento fisico + gioco digitale
**Partecipanti:** Matteo + Invitati registrati

---

## ⏱️ TIMELINE DELLA SERATA

### PRE-EVENTO (Fino al 24/01 22:00)
```
Countdown sul sito → 0 giorni, 0 ore, 0 minuti, 0 secondi
    ↓
Admin abilita "Cerimonia Attiva" da dashboard
    ↓
Sito cambia stato:
  - Countdown sparisce
  - Barra inserimento indizi appare (cerchio 100)
  - Colonne centrali (10) pronte per illuminarsi
  - Entità AI cambia messaggio
```

### ORE 22:00 - ARRIVO OSPITI
```
Ospiti arrivano alla location
    ↓
Matteo accoglie e spiega il gioco:
  - "Dovete trovare 10 indizi nascosti qui"
  - "Ogni indizio è una PAROLA"
  - "Inseritele sul sito nella barra centrale"
  - "Quando trovate tutte e 10, vi verrà chiesta una PASSWORD FINALE"
```

### ORE 22:15 - INIZIO CACCIA
```
Ospiti iniziano a cercare indizi fisici nella location
    ↓
Indizi nascosti potrebbero essere:
  - Post-it sotto tavoli
  - Scritte su oggetti
  - QR code che rivelano parole
  - Messaggi in bottiglie
  - Puzzle fisici
  - Enigmi visivi
  - (Matteo decide formato e nascondigli)
```

### DURANTE LA SERATA - INSERIMENTO INDIZI

#### Trovato Indizio Fisico
```
Ospite trova indizio (es. "RINASCITA")
    ↓
Apre sito su smartphone → http://localhost:3000 (o dominio pubblico)
    ↓
Click su cerchio 100 (centro) → Barra inserimento appare
    ↓
Scrive "RINASCITA" → Preme invio
    ↓
Sistema valida contro ceremony_clues table
```

#### Scenario A: Indizio CORRETTO ✅
```
Indizio "RINASCITA" trovato nel database
    ↓
Sistema:
  1. Salva in ceremony_clues_found (globale per tutti)
  2. Incrementa counter cluesFound (1/10)
  3. Illumina colonna corrispondente all'order_number dell'indizio
    ↓
Entità AI risponde:
  - "Corretto. Procedi."
  - "Interessante scelta."
  - "Forse sei degno."
    ↓
Visual feedback:
  - Colonna si illumina (bg-white)
  - Barra si chiude
  - Counter 1/10 aggiornato (visibile da admin dashboard)
    ↓
Ospite continua a cercare altri indizi
```

#### Scenario B: Indizio SBAGLIATO ❌
```
Indizio NON trovato nel database
    ↓
Sistema:
  - NON salva nulla
  - NON incrementa counter
    ↓
Entità AI risponde:
  - "Errato. Riprova."
  - "Non è quello che cerchi."
  - "Il tempo scorre. Tu no."
    ↓
Visual feedback:
  - Barra rimane aperta
  - Nessuna colonna si illumina
  - Ospite riprova o continua a cercare
```

#### Scenario C: Indizio GIÀ TROVATO 🔄
```
Indizio già presente in ceremony_clues_found
    ↓
Sistema:
  - NON incrementa counter (già contato)
    ↓
Entità AI risponde:
  - "Già trovato."
  - "Cerca altrove."
  - "Non ripeterti."
    ↓
Ospite cerca altri indizi
```

### ORE 23:30 - TUTTI GLI INDIZI TROVATI (10/10)

```
Counter raggiunge 10/10
    ↓
Sistema automaticamente:
  1. Tutte e 10 le colonne illuminate
  2. Barra indizi normale SPARISCE
  3. Nuova barra appare: "PAROLA CHIAVE FINALE"
    ↓
Ospiti devono indovinare la password finale
```

### PASSWORD FINALE - "EVOLUZIONE"

#### Tentativo Password
```
Ospite inserisce tentativo (es. "RIVOLUZIONE")
    ↓
Sistema valida contro GAME_PASSWORD = "EVOLUZIONE" (LandingPage.tsx:39)
```

#### Password CORRETTA ✅
```
"EVOLUZIONE" inserita
    ↓
Sistema:
  1. Valida correttezza
  2. Redirect automatico → /game/area
    ↓
Ospiti accedono alla GAME AREA
  - Dashboard personale
  - Sfide mensili (dal Feb 2026)
  - Chat
  - Altro...
    ↓
CERIMONIA APERTURA COMPLETATA ✅
```

#### Password SBAGLIATA ❌
```
Password errata
    ↓
Entità AI:
  - "Riprova."
  - "Non ancora."
  - "Sei vicino?"
    ↓
Ospiti riprovano
```

### ORE 00:00 - POST-SBLOCCO
```
Accesso game area sbloccato
    ↓
Matteo può:
  - Spiegare le regole delle 11 sfide mensili
  - Mostrare dashboard
  - Fare annunci
  - Festeggiare
    ↓
Festa continua fino alle 02:00
```

### ORE 02:00 - FINE SERATA
```
Ospiti tornano a casa
    ↓
Da domani (25/01 in poi):
  - Possono loggarsi con i loro codici partecipante
  - Aspettano Sfida 2 (Febbraio 2026)
  - Il gioco mensile è ufficialmente iniziato
```

---

## 🎮 ELEMENTI TECNICI

### Database Tables
| Tabella | Uso |
|---------|-----|
| `ceremony_clues` | Contiene le 10 parole chiave + order_number (1-10) |
| `ceremony_clues_found` | Traccia quali indizi sono stati trovati (globale) |
| `game_settings` | `ceremony_active` = true (abilitato da admin) |
| `participants` | Lista invitati registrati |

### UI Components
| Elemento | Stato | Descrizione |
|----------|-------|-------------|
| Countdown | NASCOSTO | Quando cerimonia attiva |
| Cerchio 100 | ATTIVO | Click → modale inserimento |
| 10 Colonne | ILLUMINANO | Una per indizio trovato (order 1-10) |
| Barra Password | APPARE | Solo quando 10/10 trovati |
| Entità AI | COMMENTA | Ogni tentativo di inserimento |

### Admin Dashboard
Durante la serata, Matteo può:
- ✅ Vedere counter indizi trovati (1/10, 2/10, etc.)
- ✅ Vedere quali parole sono state trovate
- ✅ Vedere chi ha fatto tentativi
- ✅ Resettare se necessario
- ✅ Abilitare/disabilitare barra inserimento

---

## 🤖 MESSAGGI ENTITÀ AI

### Quando cerimonia si attiva
```
"La cerimonia è iniziata."
"10 indizi ti attendono."
"Il tempo è limitato."
```

### Durante inserimento indizi

**Primo indizio corretto:**
```
"Inizia bene."
"Continua così."
```

**Indizi intermedi corretti:**
```
"Corretto. Procedi."
"Interessante."
"Forse sei degno."
```

**Ultimo indizio (10/10):**
```
"Completo."
"Ora dimmi: qual è la parola finale?"
"Cosa rappresenta tutto questo?"
```

**Indizio sbagliato:**
```
"Errato."
"Non è quello che cerchi."
"Riprova."
"Il tempo scorre. Tu no."
```

**Password finale corretta:**
```
"EVOLUZIONE."
"Accesso concesso."
"Il gioco è appena iniziato."
```

**Password finale sbagliata:**
```
"Non ancora."
"Rifletti."
"Sei vicino?"
```

---

## 📋 CHECKLIST PREPARAZIONE SERATA

### Prima dell'evento (entro 23/01)
- [ ] Decidere location definitiva
- [ ] Creare 10 indizi fisici (parole + nascondigli)
- [ ] Inserire 10 parole in `ceremony_clues` table con order 1-10
- [ ] Testare barra inserimento
- [ ] Testare illuminazione colonne
- [ ] Preparare messaggi Entità AI
- [ ] Verificare password finale "EVOLUZIONE"
- [ ] Testare redirect a /game/area

### Il giorno prima (23/01)
- [ ] Nascondere indizi fisici nella location
- [ ] Verificare WiFi/connessione mobile ospiti
- [ ] Fare backup database
- [ ] Testare tutto il flusso end-to-end

### Il giorno stesso (24/01 pomeriggio)
- [ ] Ricontrollare tutti gli indizi fisici
- [ ] Abilita `ceremony_active = true` da dashboard
- [ ] Verifica countdown = 0
- [ ] Verifica barra inserimento funzionante

### Durante la serata (24/01 22:00-02:00)
- [ ] Accogliere ospiti
- [ ] Spiegare regole caccia indizi
- [ ] Monitorare progress da admin dashboard
- [ ] Assistere se necessario
- [ ] Celebrare quando password finale trovata

### Post-serata (25/01)
- [ ] Disabilitare `ceremony_active = false` (opzionale)
- [ ] Verificare che tutti hanno accesso a /game/area
- [ ] Annunciare prossima sfida (Febbraio 2026)

---

## ❓ DOMANDE DA RISOLVERE

### LOCATION
1. ❌ Quale location? (Fenice non disponibile)
2. ❌ Capienza? Quanti invitati?
3. ❌ Budget location?
4. ❌ Servizi (cibo, bevande, musica)?

### INDIZI FISICI
1. ❌ Quali sono le 10 parole chiave?
2. ❌ Come sono nascosti fisicamente?
3. ❌ Difficoltà: facili o complessi?
4. ❌ Tempo stimato per trovarli tutti?

### PASSWORD FINALE
1. ✅ "EVOLUZIONE" - confermata
2. ❌ C'è un hint visibile da qualche parte?
3. ❌ O devono indovinarla logicamente dalle 10 parole?

### POST-CERIMONIA
1. ❌ Cosa vedono quando accedono a /game/area?
2. ❌ Ci sono sorprese/animazioni speciali?
3. ❌ Viene spiegato il gioco mensile?

---

**Creato:** 10 Dicembre 2025
**Responsabile:** Matteo Zaramella
**Ultimo aggiornamento:** 10 Dicembre 2025, ore 16:30
