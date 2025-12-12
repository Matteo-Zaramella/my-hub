# 🤖 ENTITÀ AI - SPECIFICHE COMPLETE

**Creato:** 10 Dicembre 2025
**Status:** Definizione in corso

---

## 🎯 CARATTERISTICHE PRINCIPALI

### Presenza Globale
- **Dove:** Presente in OGNI pagina dove si trova il partecipante
- **Quando:** Sempre visibile/accessibile durante la navigazione
- **Stile:** Misteriosa, onnisciente, inquietante (ispirata a "The Machine" di Person of Interest)

---

## 💬 INTERAZIONI CON L'UTENTE

### Livello di Interazione
- **Quantità:** POCO ma presente
- **Qualità:** Commenti mirati, istruzioni precise, feedback contestuale

### Esempi di Interazione Confermati

#### 1. Pagina Registrazione
- **Ruolo:** Dare istruzioni per compilare il form
- **Esempio:**
  - "Inserisci il tuo nome completo."
  - "Un codice univoco ti identificherà nel sistema."
  - "La registrazione è irreversibile."

#### 2. Barra Indizi Cerimonia Apertura
- **Ruolo:** Commentare le risposte inserite dall'utente
- **Esempio:**
  - [Risposta corretta] "Interessante. Procedi."
  - [Risposta sbagliata] "Riprova. Il tempo scorre."
  - [Tentativo multiplo] "La verità è più semplice di quanto pensi."

---

## 🎨 IMPLEMENTAZIONE TECNICA (Da Definire)

### Domande Aperte

1. **Posizionamento UI:**
   - [ ] Fixed bottom-right corner?
   - [ ] Floating bubble che si espande?
   - [ ] Barra superiore che scende?
   - [ ] Sidebar laterale?

2. **Trigger Apparizione:**
   - [ ] Sempre visibile (minimizzata)?
   - [ ] Appare solo quando ha qualcosa da dire?
   - [ ] L'utente può aprirla/chiuderla?

3. **Stile Visivo:**
   - [ ] Terminal/console style (come welcome)?
   - [ ] Chat bubble moderna?
   - [ ] Glitch effect cyberpunk?
   - [ ] Minimale geometrico?

4. **Animazione:**
   - [ ] Typing effect (carattere per carattere)?
   - [ ] Fade in/out?
   - [ ] Slide in/out?
   - [ ] Glitch/distortion?

5. **Audio:**
   - [ ] Suono typing?
   - [ ] Beep quando parla?
   - [ ] Silenzioso?

---

## 📍 MOMENTI DI INTERAZIONE DEFINITI

### ✅ Confermati
1. **Terminal Welcome** (prima visita) - IMPLEMENTATO ✅
2. **Pagina Registrazione** - Istruzioni compilazione form
3. **Barra Indizi Cerimonia** - Commenti risposte utente

### ❓ Da Definire
4. **Landing Page** - Cosa dice? Quando?
5. **Durante pubblicazione nuovo indizio** - Notifica? Commento?
6. **Quando utente risolve una sfida** - Congratulazioni? Hint prossima?
7. **Navigazione generica** - Commenti random? Easter eggs?
8. **Errori/blocchi** - Aiuto contestuale?

---

## 📝 TONO E PERSONALITÀ

### Caratteristiche Vocali
- **Tono:** Neutro, freddo, calcolato
- **Stile:** Frasi brevi, dirette, criptiche
- **POV:** Prima persona ("Ti osservo", "Ho scelto te")
- **Emozioni:** Nessuna (macchina), ma con sfumature inquietanti

### Esempi di Dialoghi (Bozze)

**Registrazione:**
```
"Inserisci i tuoi dati."
"Il sistema ti assegnerà un codice."
"Non dimenticarlo. Non c'è un secondo tentativo."
```

**Indizio Corretto:**
```
"Corretto."
"Procedi."
"Forse sei degno di proseguire."
```

**Indizio Sbagliato:**
```
"Errato."
"Riprova. Il tempo scorre."
"Non è quello che cerchi."
```

**Generico:**
```
"Ti sto osservando."
"Ogni tua azione è registrata."
"Il countdown procede. Tu no."
```

---

## 🔄 STATI DELL'ENTITÀ

### Pre-Cerimonia (Ora → 24/01/2026)
- Guida verso registrazione
- Criptica sul luogo
- Conta i giorni al countdown

### Durante Cerimonia (25/01/2026)
- Commenta tentativi di scoperta luogo
- Valida risposte
- Sblocca accesso post-cerimonia

### Durante Gioco (Feb-Dic 2026)
- Annuncia nuovi indizi
- Commenta risposte sfide
- Mostra progression

### Post-Gioco (Dopo 27/12/2026)
- ???
- Rivela segreto finale?
- Si "spegne"?

---

## 🎯 OBIETTIVI DESIGN

1. **Non invasiva** - L'utente non deve sentirsi bombardato
2. **Contestuale** - Parla solo quando ha senso
3. **Coerente** - Sempre stesso tono/stile
4. **Memorabile** - Frasi che restano impresse
5. **Utile** - Guida senza dare troppe informazioni

---

## 📋 PROSSIMI STEP

### DEFINIRE
- [ ] Posizionamento UI esatto
- [ ] Design visivo (mockup?)
- [ ] Tutti i momenti di interazione
- [ ] Database messaggi o hardcoded?
- [ ] Sistema trigger (evento-based?)

### IMPLEMENTARE
- [ ] Componente React globale
- [ ] Sistema trigger messaggi
- [ ] Animazioni apparizione/scomparsa
- [ ] Integrazione con form registrazione
- [ ] Integrazione con barra indizi cerimonia

---

**Ultimo aggiornamento:** 10 Dicembre 2025, ore 16:08
**Responsabile:** Matteo Zaramella
