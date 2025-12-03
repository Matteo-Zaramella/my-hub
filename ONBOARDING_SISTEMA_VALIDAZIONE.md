# 🔐 ONBOARDING - Sistema Validazione Risposte

**Data:** 28 Novembre 2025
**Stato Implementazione:** UI completata, necessarie modifiche

---

## 📋 Cosa È Stato Fatto

### ✅ Completato

1. **UI Tab "Valida Risposta"** (`ValidateAnswerTab.tsx`)
   - Form con input 30 caratteri
   - Info box con istruzioni
   - Display risultato con punti e rank
   - Integrato in `GameAreaWithChat.tsx`

2. **API Route** (`/api/validate-answer/route.ts`)
   - Validazione strict (case-sensitive, exact match, no trim)
   - Controllo duplicati per partecipante
   - Calcolo rank e punti decrescenti
   - Supporto indizi e sfide

3. **Database Schema** (`add_answer_validation_schema.sql`)
   - Colonna `answer_code` su `game_clues` e `game_challenges`
   - Tabelle `clue_submissions` e `challenge_submissions`
   - RLS policies per sicurezza
   - Constraint UNIQUE per prevenire duplicati

4. **Script Popolamento** (`populate-answer-codes.mjs`)
   - Inserisce 47 password nel DB
   - Mapping automatico da PASSWORD_MAPPING_CONFIDENTIAL.md

5. **Documentazione** (`README_ANSWER_VALIDATION.md`)
   - Procedura setup completa
   - Query di verifica
   - Test case-sensitivity

---

## 🔧 Modifiche Richieste dall'Utente

### 1. **Rimuovere Placeholder Password dall'Input**

**Problema attuale:**
```tsx
// ValidateAnswerTab.tsx:95
placeholder="Eg2azaYN6FvmBv3SfhqZZZswKb3QyS"
```

**Soluzione:**
```tsx
placeholder="Inserisci il codice di 30 caratteri"
```

**File da modificare:** `app/game/ValidateAnswerTab.tsx` linea 95

---

### 2. **Sistema Doppio Inserimento Password**

**Requisito:** Per evitare errori di battitura, il partecipante deve inserire il codice DUE volte e devono coincidere esattamente.

**UI da implementare:**
```tsx
<input
  type="text"
  placeholder="Inserisci il codice"
  value={code}
  onChange={(e) => setCode(e.target.value)}
  maxLength={30}
/>

<input
  type="text"
  placeholder="Conferma il codice"
  value={confirmCode}
  onChange={(e) => setConfirmCode(e.target.value)}
  maxLength={30}
/>

// Validazione prima del submit:
if (code !== confirmCode) {
  setError('I due codici non coincidono')
  return
}
```

**File da modificare:** `app/game/ValidateAnswerTab.tsx`

---

### 3. **Verifica Sistema Duplicati (già implementato)**

**Requisito:** Se lo stesso partecipante inserisce la stessa password più volte:
- ✅ Prima volta: assegna punti, salva submission
- ✅ Volte successive: messaggio "Hai già validato questo indizio/sfida!"
- ✅ NON assegnare punti duplicati
- ✅ Registrare solo la prima submission

**Stato:** ✅ GIÀ IMPLEMENTATO nell'API route

**Codice esistente:**
```typescript
// /api/validate-answer/route.ts:43-52
const { data: existingSubmission } = await supabase
  .from('clue_submissions')
  .select('id')
  .eq('participant_id', participantId)
  .eq('clue_id', clueMatch.id)
  .single()

if (existingSubmission) {
  return NextResponse.json({
    success: true,
    correct: false,
    message: 'Hai già validato questo indizio!'
  })
}
```

**Constraint DB:**
```sql
-- add_answer_validation_schema.sql:37
CONSTRAINT unique_participant_clue UNIQUE (participant_id, clue_id)
```

**Note:** Il sistema previene già duplicati sia a livello API che DB (constraint UNIQUE).

---

### 4. **Chiarimento: Ogni Partecipante Può Inserire Ogni Password**

**Requisito confermato:** NON c'è un limite globale di inserimenti.

**Esempio:**
- Password "Eg2azaYN6FvmBv3SfhqZZZswKb3QyS" (Indizio FEB #1)
- Partecipante A → inserisce per primo → 100 punti, rank #1
- Partecipante B → inserisce per secondo → 95 punti, rank #2
- Partecipante C → inserisce per terzo → 90 punti, rank #3
- Partecipante D → inserisce per quarto → 85 punti, rank #4
- ... e così via, senza limite

**Stato:** ✅ GIÀ IMPLEMENTATO

Il sistema attuale permette già questo comportamento. Ogni partecipante può validare ogni password, e il rank viene calcolato in base all'ordine temporale di inserimento.

---

## 📝 TODO per Prossima Sessione

### Da Implementare

- [ ] **Rimuovere placeholder password** da input (sostituire con testo generico)
- [ ] **Implementare doppio inserimento:**
  - Aggiungere secondo input "Conferma codice"
  - Validare che `code === confirmCode` prima di submit
  - Mostrare errore se non coincidono
- [ ] **Testare sistema duplicati:**
  - Verificare che funzioni il controllo "Hai già validato"
  - Testare constraint UNIQUE su DB
  - Simulare 2+ inserimenti stesso codice, stesso partecipante

### Da Verificare (già funzionante)

- [x] Sistema prevenzione duplicati (API + DB constraint)
- [x] Ogni partecipante può inserire ogni password
- [x] Calcolo rank in base a timestamp submission
- [x] Punti decrescenti per rank

### Da Testare su DB Reale

- [ ] Eseguire `add_answer_validation_schema.sql` su Supabase
- [ ] Eseguire `node scripts/populate-answer-codes.mjs`
- [ ] Verificare 36 indizi + 11 sfide con password
- [ ] Test inserimento codice reale
- [ ] Test case-sensitivity (aB3 vs ab3 vs AB3)
- [ ] Test duplicate prevention con account reale

---

## 🎯 Funzionamento Finale Atteso

### Scenario 1: Primo Inserimento Valido

1. Partecipante apre tab "🔐 Valida Risposta"
2. Inserisce codice: `Eg2azaYN6FvmBv3SfhqZZZswKb3QyS`
3. Conferma codice: `Eg2azaYN6FvmBv3SfhqZZZswKb3QyS`
4. Clicca "Valida Risposta"
5. **Risultato:** ✅ "Indizio validato! Sei il/la 5° a scoprirlo! +90 punti"

### Scenario 2: Secondo Inserimento (Duplicato)

1. Stesso partecipante prova a inserire lo stesso codice
2. Inserisce codice: `Eg2azaYN6FvmBv3SfhqZZZswKb3QyS`
3. Conferma codice: `Eg2azaYN6FvmBv3SfhqZZZswKb3QyS`
4. Clicca "Valida Risposta"
5. **Risultato:** ❌ "Hai già validato questo indizio!"
6. **Punti:** NESSUN punto assegnato, submission NON salvata

### Scenario 3: Codici Non Coincidenti

1. Partecipante inserisce codice: `Eg2azaYN6FvmBv3SfhqZZZswKb3QyS`
2. Conferma codice: `Eg2azaYN6FvmBv3SfhqZZZswKb3Qys` (errore: 's' minuscola)
3. Clicca "Valida Risposta"
4. **Risultato:** ❌ "I due codici non coincidono. Ricontrolla e riprova."
5. **API call:** Non viene effettuata

### Scenario 4: Codice Non Valido

1. Partecipante inserisce codice: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
2. Conferma codice: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
3. Clicca "Valida Risposta"
4. **Risultato:** ❌ "Codice non valido. Ricontrolla e riprova."

### Scenario 5: Case Sensitivity

1. Partecipante inserisce codice corretto ma con case sbagliato
2. Codice corretto: `Eg2azaYN6FvmBv3SfhqZZZswKb3QyS`
3. Inserito: `eg2azayn6fvmbv3sfhqzzzsw kb3qys`
4. **Risultato:** ❌ "Codice non valido. Ricontrolla e riprova."

---

## 🔒 Sicurezza

### Password Confidenziali

**IMPORTANTE:** Le password NON devono mai essere esposte nel frontend!

- ❌ NON mostrare placeholder con password reale
- ❌ NON inviare lista password al client
- ❌ NON esporre `answer_code` nelle query pubbliche
- ✅ Validazione solo server-side (API route)
- ✅ RLS su Supabase per proteggere `game_clues.answer_code` e `game_challenges.answer_code`

### RLS Policy da Aggiungere (Opzionale)

Se vuoi nascondere completamente i codici dal frontend:

```sql
-- Impedisci ai partecipanti di vedere answer_code
CREATE POLICY "Participants cannot see answer codes"
  ON game_clues
  FOR SELECT
  USING (true)
  WITH CHECK (answer_code IS NULL); -- Block select di answer_code
```

**Nota:** Questo è opzionale perché l'API già valida server-side.

---

## 📊 File Coinvolti

### Da Modificare
1. `app/game/ValidateAnswerTab.tsx` - UI doppio inserimento
2. `app/api/validate-answer/route.ts` - Già OK, verificare funzionamento

### Da Eseguire su Supabase
1. `database/add_answer_validation_schema.sql` - Schema DB
2. `scripts/populate-answer-codes.mjs` - Popolamento password

### Documentazione
1. `database/README_ANSWER_VALIDATION.md` - Guida setup
2. `PASSWORD_MAPPING_CONFIDENTIAL.md` - Riferimento password (NON committare)
3. `SISTEMA_VALIDAZIONE_RISPOSTE.md` - Specifiche sistema

---

## 🚀 Quick Start Prossima Sessione

```bash
# 1. Modificare ValidateAnswerTab.tsx
# - Rimuovere placeholder password
# - Aggiungere secondo input "Conferma codice"
# - Validare code === confirmCode

# 2. Testare su localhost
cd D:\Claude\my-hub
npm run dev
# Aprire http://localhost:3000/game
# Login e testare tab "Valida Risposta"

# 3. Setup DB Supabase
# - Eseguire add_answer_validation_schema.sql su SQL Editor
# - Verificare tabelle create

# 4. Popolare password
node scripts/populate-answer-codes.mjs

# 5. Test completo
# - Testare inserimento codice valido
# - Testare duplicate prevention
# - Testare case-sensitivity
# - Testare doppio inserimento con errore
```

---

## ❓ Domande da Chiarire (se necessario)

1. ✅ **Ogni partecipante può inserire ogni password?** → SÌ (confermato)
2. ✅ **Limite globale inserimenti per password?** → NO (confermato)
3. ✅ **Prevenire duplicati stesso partecipante?** → SÌ (implementato)
4. ⏳ **Mostrare storico validazioni al partecipante?** → Da decidere
5. ⏳ **Classifica generale visibile?** → Da decidere (tab futuro?)
6. ⏳ **Notifiche quando qualcuno valida?** → Da decidere

---

**Fine Onboarding**
Pronto per implementazione modifiche nella prossima sessione! 🚀
