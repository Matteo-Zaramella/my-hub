# 🔐 Security Audit & Controllo Estetica Pre-Lancio

**Data creazione:** 28 Novembre 2025
**Priorità:** MASSIMA (Security) / ALTA (Estetica)
**Deadline:** 18-20 Gennaio 2026

---

## 🎨 Task 1: Controllo Estetica Finale Sito Pubblico

**Scadenza:** 18/01/2026 (prima invio inviti finali)
**Tempo stimato:** 3-4 ore
**Status:** ❌ NON INIZIATO

### Obiettivo
Assicurare che tutte le pagine pubbliche siano perfette esteticamente prima del lancio ufficiale con inviti ai partecipanti.

### Azioni da completare

**1. Review completa homepage pubblica**
- [ ] Controllo countdown funzionante
- [ ] Verifica sezione benvenuto
- [ ] Controllo logo e branding
- [ ] Verifica animazioni e transizioni
- [ ] Test scroll smooth

**2. Review wishlist pubblica (/wishlist-public)**
- [ ] Controllo grid responsive
- [ ] Verifica card items
- [ ] Test filtri/ricerca (se presenti)
- [ ] Controllo immagini caricate

**3. Review form registrazione**
- [ ] Step 1: verifica identità
- [ ] Step 2: dati contatto
- [ ] Timer 10 secondi funzionante
- [ ] Messaggi errore chiari
- [ ] Success state dopo registrazione

**4. Test Responsive**
- [ ] Mobile (375px - iPhone SE)
- [ ] Mobile (390px - iPhone 12/13/14)
- [ ] Tablet portrait (768px - iPad)
- [ ] Tablet landscape (1024px)
- [ ] Desktop (1280px+)
- [ ] Desktop large (1920px+)

**5. Verifica Design Consistency**
- [ ] Font consistency (titoli, body, buttons)
- [ ] Colori brand (nero, verde, accenti)
- [ ] Spaziature uniformi
- [ ] Buttons hover states
- [ ] Links underline/colore

**6. User Flow Test**
- [ ] Visitatore → Homepage
- [ ] Homepage → Registrazione → Conferma
- [ ] Visitatore → Wishlist pubblica
- [ ] Navigation completa

**7. Controllo Contenuti**
- [ ] Typo e grammatica italiana
- [ ] Nomi corretti (A Tutto Reality: La Rivoluzione)
- [ ] Date corrette (24 Gennaio 2026)
- [ ] Contact info aggiornati

**8. Documentazione Finale**
- [ ] Screenshot homepage desktop
- [ ] Screenshot homepage mobile
- [ ] Screenshot form registrazione
- [ ] Screenshot wishlist pubblica

---

## 🔐 Task 2: Security Audit Pre-Lancio (CRITICO)

**Scadenza:** 20/01/2026
**Tempo stimato:** 4-5 ore
**Status:** ❌ NON INIZIATO

### ⚠️ OBIETTIVO CRITICO
**Nessun dato sensibile deve essere accessibile tramite:**
- F12 Developer Tools
- Ispeziona Elemento
- Network Tab
- Console JavaScript
- View Page Source
- API calls dirette

---

### 1. Protezione Dati Sensibili Frontend

**Indizi Cerimonia:**
- [ ] Testo indizi NON presente in file .js/.tsx pubblici
- [ ] Risposte indizi NON hardcoded nel frontend
- [ ] Indizi caricati SOLO da API backend con validazione
- [ ] API `/api/ceremony-clues` protetta con RLS

**Sfide Mensili:**
- [ ] Risposte sfide NON visibili nel codice frontend
- [ ] Soluzioni NON presenti in file pubblici
- [ ] Indizi sfide caricati SOLO dopo data rivelazione
- [ ] API `/api/challenges` protetta con RLS + date check

**Password Cerimonia "EVOLUZIONE":**
- [ ] Password NON hardcoded nel client
- [ ] Verifica password SOLO server-side
- [ ] API `/api/verify-ceremony-password` con rate limiting
- [ ] Risposta API generica (no hint sulla password corretta)

**Environment Variables:**
- [ ] `.env.local` NON committato su GitHub
- [ ] Vercel env variables configurate
- [ ] No secrets in `/public` folder
- [ ] Grep codebase: `grep -r "SUPABASE_SERVICE_ROLE_KEY" src/`

---

### 2. Controllo Accessi (Authorization)

**Dashboard Admin (/dashboard):**
- [ ] Accessibile SOLO con autenticazione admin
- [ ] Redirect a `/` se non autenticato
- [ ] Test: aprire `/dashboard` in incognito → deve bloccare
- [ ] Test: manipolare cookie auth → deve invalidare sessione

**Area Game (/game):**
- [ ] Accessibile SOLO con codice partecipante valido
- [ ] Redirect a `/` se codice non valido
- [ ] Test: accedere senza codice → deve bloccare
- [ ] Test: codice invalido → messaggio errore

**Chat di Gruppo:**
- [ ] Visibile SOLO dopo fase 1 (post-cerimonia 26/01/2026)
- [ ] Controllo fase attuale lato server
- [ ] Test: accedere chat prima del 26/01 → deve essere nascosta
- [ ] Messaggio "Chat disponibile dal 26 Gennaio"

**Indizi Futuri:**
- [ ] Indizi visibili SOLO dopo `reveal_date`
- [ ] Query Supabase filtrata per data
- [ ] Test: modificare data sistema → indizi futuri NON visibili
- [ ] API response NON contiene indizi futuri

**Classifica:**
- [ ] Visibile SOLO dopo fase 3 (26/07/2026)
- [ ] Nascosta durante fasi 0,1,2
- [ ] Test: accedere classifica prima del 26/07 → nascosta
- [ ] Messaggio "Classifica disponibile dal 26 Luglio"

---

### 3. Test Penetrazione Manuale

**Test Accessi Non Autorizzati:**
```bash
# Test 1: Dashboard senza auth
Aprire browser incognito → https://tuosito.com/dashboard
Risultato atteso: Redirect a homepage o errore 401

# Test 2: Game area senza codice
Aprire browser incognito → https://tuosito.com/game
Risultato atteso: Redirect a homepage o richiesta codice

# Test 3: API indizi diretta
curl https://tuosito.com/api/ceremony-clues
Risultato atteso: 401 Unauthorized o dati filtrati per data
```

**Test SQL Injection:**
- [ ] Form registrazione: inserire `'; DROP TABLE users; --`
- [ ] Chat: inserire `<script>alert('XSS')</script>`
- [ ] Codice partecipante: inserire `' OR '1'='1`
- Risultato atteso: Input sanitizzato, nessun errore database

**Test XSS (Cross-Site Scripting):**
- [ ] Chat: `<img src=x onerror=alert('XSS')>`
- [ ] Nome partecipante: `<script>document.location='http://evil.com'</script>`
- [ ] Descrizione wishlist: `<iframe src="http://evil.com"></iframe>`
- Risultato atteso: HTML escapato, script non eseguito

**Test CSRF (Cross-Site Request Forgery):**
- [ ] Verifica CSRF tokens su form critici
- [ ] Test: submit form da dominio esterno → deve bloccare

---

### 4. Verifica Row Level Security (RLS) Supabase

**Tabelle da controllare:**

```sql
-- ceremony_clue_riddles
SELECT * FROM ceremony_clue_riddles WHERE id = 1;
-- Deve restituire SOLO indizi con reveal_date <= NOW()

-- game_challenges
SELECT * FROM game_challenges;
-- Deve restituire SOLO sfide pubbliche o per utente autenticato

-- game_clues
SELECT * FROM game_clues;
-- Deve restituire SOLO indizi dopo reveal_date

-- participants
SELECT * FROM participants;
-- Deve restituire SOLO dati utente autenticato (no altri partecipanti)

-- chat_messages
SELECT * FROM chat_messages;
-- Deve restituire SOLO dopo fase 1 (26/01/2026)

-- leaderboard (se esiste)
SELECT * FROM leaderboard;
-- Deve restituire SOLO dopo fase 3 (26/07/2026)
```

**Azioni:**
- [ ] Test ogni query da Supabase SQL Editor
- [ ] Test ogni query da API route
- [ ] Test ogni query da client React
- [ ] Verificare politiche RLS per INSERT/UPDATE/DELETE

---

### 5. Verifica Codice Pubblico

**File da controllare:**

```bash
# Cerca password hardcoded
grep -ri "EVOLUZIONE" src/
grep -ri "password" src/ | grep -v "hashedPassword"

# Cerca secrets
grep -ri "secret" src/
grep -ri "api_key" src/
grep -ri "SUPABASE_SERVICE_ROLE_KEY" src/

# Cerca risposte/soluzioni
grep -ri "answer" src/
grep -ri "solution" src/
grep -ri "correct" src/

# Verifica /public
ls -la public/
# Non devono esserci file .env, credentials, keys
```

**Checklist File:**
- [ ] `/public` non contiene secrets
- [ ] Componenti React no props sensibili hardcoded
- [ ] API routes hanno auth check all'inizio
- [ ] Database queries usano RLS (no `serviceRole`)
- [ ] No console.log con dati sensibili in produzione

---

### 6. Security Features Aggiuntive

**Rate Limiting:**
```typescript
// /api/verify-ceremony-password
- [ ] Max 5 tentativi / 10 minuti per IP
- [ ] Blocco temporaneo dopo 10 tentativi falliti
- [ ] Log tentativi sospetti

// /api/send-confirmation
- [ ] Max 3 email / ora per email address
- [ ] Prevenzione spam

// /api/chat/send-message
- [ ] Max 20 messaggi / minuto per utente
- [ ] Flood protection
```

**Input Sanitization:**
- [ ] Chat: sanitize con libreria `DOMPurify` o `xss`
- [ ] Form: validazione Zod/Yup
- [ ] SQL: prepared statements (automatico con Supabase)

**HTTPS & CORS:**
- [ ] Vercel deployment forza HTTPS
- [ ] CORS configurato per dominio specifico (no wildcard `*`)
- [ ] Headers security: `X-Frame-Options`, `X-Content-Type-Options`

**Backup Database:**
- [ ] Backup automatici Supabase configurati (daily)
- [ ] Test restore backup
- [ ] Backup export manuale pre-evento

---

### 7. Checklist Finale Pre-Lancio

**16 Gennaio 2026 (1 settimana prima):**
- [ ] ✅ Tutti i controlli security completati
- [ ] ✅ Tutti i test penetrazione passati
- [ ] ✅ RLS verificato su tutte le tabelle
- [ ] ✅ Estetica sito pubblico approvata
- [ ] ✅ Responsive testato su tutti i device
- [ ] ✅ Backup database configurato

**18 Gennaio 2026 (invio inviti):**
- [ ] ✅ Screenshot finale homepage
- [ ] ✅ Test flow registrazione end-to-end
- [ ] ✅ Monitoring errori attivo (Sentry - opzionale)

**20 Gennaio 2026 (4 giorni prima):**
- [ ] ✅ Final security audit
- [ ] ✅ Performance check (Lighthouse score >90)
- [ ] ✅ Vercel deployment stabile

**23 Gennaio 2026 (1 giorno prima):**
- [ ] ✅ Test completo con 5 partecipanti reali
- [ ] ✅ Tutti i sistemi operativi
- [ ] ✅ Piano B se sito down (comunicazione alternative)

---

## 🚨 RED FLAGS - Bloccare lancio se:

1. ❌ Password "EVOLUZIONE" visibile nel codice frontend
2. ❌ Risposte sfide accessibili tramite F12
3. ❌ Dashboard admin accessibile senza autenticazione
4. ❌ Indizi futuri visibili prima della data rivelazione
5. ❌ SQL injection possibile nei form
6. ❌ XSS possibile nella chat
7. ❌ RLS Supabase non configurato correttamente
8. ❌ Secrets committati su GitHub
9. ❌ Sito non responsive su mobile
10. ❌ Form registrazione non funzionante

---

## ✅ Criteri di Successo

**Security:**
- ✅ Zero dati sensibili accessibili da F12
- ✅ Tutti i test penetrazione falliti (accessi bloccati)
- ✅ RLS funzionante su tutte le tabelle
- ✅ Rate limiting attivo su API critiche
- ✅ Input sanitizzato (no XSS/SQL injection)

**Estetica:**
- ✅ Homepage responsive su tutti i device
- ✅ Form registrazione user-friendly
- ✅ Zero typo in italiano
- ✅ Branding consistente
- ✅ User flow fluido

---

**Responsabile:** Matteo Zaramella
**Review finale:** 20 Gennaio 2026
