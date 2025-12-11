# 🎯 ONBOARDING PROGETTO - 10 DICEMBRE 2025
**Creato:** 9 Dicembre 2025
**Per sessione:** 10 Dicembre 2025

---

## 🎮 MECCANICA PRINCIPALE DEL GIOCO

### 🔑 CONCEPT CHIAVE
**L'utente deve SCOPRIRE IL LUOGO della cerimonia di apertura.**

- **Data:** Ovvia dal countdown (25 Gennaio 2026)
- **Luogo:** DA SCOPRIRE attraverso indizi e interazioni
- **Goal:** Una volta scoperto il luogo, inserirlo per sbloccare **invito ufficiale** con istruzioni

---

## 🌐 LANDING PAGE - STRUTTURA ATTUALE

### Elementi Visibili (dopo Terminal Welcome)

1. **Cerchio 1 (Top-Left):** 🎁 Wishlist Pubblica
   - Rimane attivo
   - Non è importante per il gioco (per ora)
   - Serve solo come feature accessoria

2. **Cerchio 2:** 📝 Pagina di Registrazione
   - **FOCUS PRINCIPALE**
   - Logo verde della Fenice visibile
   - Form di registrazione
   - Primo step per entrare nel gioco

3. **Cerchio 10 (Top-Right):** 🔧 Admin Access
   - Solo per admin

4. **Area Centrale (4x4):** ⏱️ Countdown
   - Giorni, ore, minuti, secondi
   - Countdown al 25/01/2026

---

## 🤖 L'ENTITÀ AI - "THE MACHINE"

### Presenza Globale
- **Presente in TUTTE le pagine**
- Parla sempre qualcosa di **diverso** in base al contesto
- Stile: Misteriosa, onnisciente, inquietante (come The Machine di Person of Interest)

### Dove appare:
- ✅ **Prima visita:** Terminal Welcome (4 messaggi)
- ❌ **Landing page:** TODO - come e cosa dice?
- ❌ **Pagina registrazione:** TODO - come guida l'utente?
- ❌ **Dopo registrazione:** TODO - prossimi step?

### Funzione:
- Guidare l'utente verso la scoperta
- Dare indizi criptici sul luogo
- Creare atmosfera misteriosa
- Non rivelare troppo, ma indirizzare

---

## 📋 FLUSSO UTENTE - VERSIONE DEFINITIVA

```
1. Utente riceve link
   ↓
2. Apre sito → Terminal Welcome (prima volta)
   ↓
3. Landing Page
   - Vede Countdown (data ovvia: 25/01/2026)
   - Vede Cerchio 1 (Wishlist - accessorio)
   - Vede Cerchio 2 (REGISTRAZIONE - focus)
   - Entità AI parla e guida
   ↓
4. Click su Cerchio 2 → Pagina Registrazione
   - Logo verde Fenice visibile
   - Form registrazione
   - Entità AI dà indizi sul luogo
   ↓
5. Registrazione completata
   - ??? cosa succede dopo?
   ↓
6. SCOPERTA LUOGO (attraverso indizi/interazioni)
   - ??? come vengono dati gli indizi?
   - ??? dove si cercano/trovano?
   ↓
7. INSERIMENTO LUOGO
   - ??? dove si inserisce? (form? barra centrale?)
   - Validazione server
   ↓
8. SBLOCCO INVITO UFFICIALE
   - PDF/pagina con:
     * Luogo confermato
     * Data confermata (25/01/2026)
     * Istruzioni per la serata
     * Dress code?
     * Altre info necessarie
```

---

## ✅ STATO IMPLEMENTAZIONE

### COMPLETATO
1. ✅ Terminal Welcome Animation
   - 2 sec schermo nero
   - 4 messaggi typing/backspace
   - Giorni dinamici dal countdown
   - localStorage per mostrare solo prima volta

2. ✅ Database
   - 12 challenges (25/01/2026 - 27/12/2026)
   - 37 indizi con date corrette
   - Cerimonia Apertura = 25/01/2026
   - RLS policies corrette

3. ✅ Landing Page Base
   - Countdown funzionante
   - Griglia 10x10 cerchi
   - Cerchio 1: Wishlist
   - Cerchio 2: Registrazione
   - Cerchio 10: Admin

4. ✅ Bug Fix
   - RLS wishlist_items
   - Server su porta 3000
   - Animazione terminal senza loop infiniti

### TODO IMMINENTE (10 Dicembre)
1. ❌ **Entità AI globale**
   - Componente che appare in tutte le pagine
   - Messaggi contestuali diversi per ogni pagina
   - Design e posizionamento

2. ❌ **Logo Fenice verde nella registrazione**
   - Dove posizionare
   - Dimensione e stile
   - Animazione?

3. ❌ **Sistema scoperta luogo**
   - Come vengono dati indizi?
   - Dove l'utente cerca/trova info?
   - Meccanica di scoperta

4. ❌ **Form inserimento luogo**
   - Dove posizionato (landing? modale?)
   - Validazione lato server
   - Feedback successo/errore

5. ❌ **Invito ufficiale**
   - Formato (PDF? Pagina web? Email?)
   - Contenuto esatto
   - Trigger dopo inserimento luogo corretto

---

## 🗂️ FILE IMPORTANTI

### Documentazione Aggiornata ✅
- `FLOWCHART_GIOCO_2026.md` - Flowchart completo del gioco
- `CALENDARIO_UFFICIALE_2026_CORRETTO.md` - Date ufficiali verificate
- `ONBOARDING_DOMANI_10_DIC_2025.md` - Questo file

### Database ✅
- `database/FIX_CORRECT_DATES.sql` - Date corrette challenges
- `database/FIX_CORRECT_EVENTS.sql` - Nomi eventi corretti
- `database/fix_wishlist_rls.sql` - Policy RLS wishlist

### Codice Aggiornato ✅
- `app/components/TerminalWelcome.tsx` - Animazione welcome
- `app/LandingPage.tsx` - Landing page con countdown
- `app/dashboard/wishlist/` - Wishlist funzionante

### DA ELIMINARE ❌ (File obsoleti/fuorvianti)
- Tutti i file con date sbagliate (già eliminati nella sessione precedente)
- File con "11 Gennaio" come data cerimonia (già eliminati)

---

## ❓ DOMANDE DA RISOLVERE DOMANI

### PRIORITÀ ALTA 🔴

1. **Entità AI - Implementazione tecnica**
   - Componente React globale? Layout wrapper?
   - Positioned fixed? Drawer? Floating box?
   - Animazione apparizione/scomparsa?
   - Database per messaggi o hardcoded?

2. **Entità AI - Contenuti messaggi**
   - Landing: "Cosa dice?"
   - Registrazione: "Quali indizi sul luogo?"
   - Post-registrazione: "Come guida verso scoperta?"

3. **Sistema scoperta luogo**
   - Gli indizi sono testuali? Visivi? Puzzle?
   - Dove sono nascosti (dentro pagine? immagini? codice sorgente?)?
   - Progressivi o tutti disponibili subito?

4. **Sblocco invito**
   - Solo il luogo o serve anche altro (password? codice?)?
   - L'invito è personalizzato per utente?
   - Include QR code per l'ingresso fisico?

### PRIORITÀ MEDIA 🟡

5. **Logo Fenice**
   - File già esistente o da creare?
   - Solo nella registrazione o anche altrove?

6. **Cerchi 3-9**
   - Fanno qualcosa prima della cerimonia?
   - O si attivano dopo?

7. **Mobile responsive**
   - Prioritario o desktop-first?

---

## 🎯 OBIETTIVI SESSIONE 10 DICEMBRE

1. ✅ Rispondere alle domande prioritarie
2. ⚡ Implementare entità AI globale
3. 🎨 Aggiungere logo Fenice alla registrazione
4. 🔐 Creare sistema scoperta/inserimento luogo
5. 🎫 Preparare invito ufficiale da sbloccare
6. 📱 Flowchart dettagliato completo

---

## 📌 NOTE TECNICHE

### Stack
- Next.js 16 (App Router)
- TypeScript
- Supabase (PostgreSQL + Auth)
- Tailwind CSS

### Porte
- Development: `localhost:3000`
- Database: Supabase Cloud

### Environment
- `.env.local` con credentials Supabase
- localStorage per tracking prima visita

---

**Preparato per:** Matteo
**Data sessione:** 10 Dicembre 2025
**Ultima modifica:** 9 Dicembre 2025, 23:59
