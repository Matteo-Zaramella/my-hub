# 🤖 ENTITÀ AI - SPECIFICHE COMPLETE

**Creato:** 10 Dicembre 2025
**Status:** Alfabeto Wingdings implementato, glitch effect attivo

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
   - [x] Glitch effect cyberpunk? ✅ IMPLEMENTATO
   - [ ] Minimale geometrico?

4. **Animazione:**
   - [x] Typing effect (carattere per carattere)? ✅ IMPLEMENTATO
   - [ ] Fade in/out?
   - [ ] Slide in/out?
   - [x] Glitch/distortion? ✅ IMPLEMENTATO (Wingdings)

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

## 🔤 ALFABETO WINGDINGS - COMUNICAZIONE ENTITÀ

> **REGOLA FONDAMENTALE:** L'Entità comunica SEMPRE con testo glitchato.
> I caratteri si trasformano casualmente in simboli Wingdings durante la visualizzazione.

### File Sorgente
`lib/wingdings.ts` - Contiene la mappatura completa e le funzioni di conversione.

### Componente React
`app/components/EntityText.tsx` - Wrapper per applicare effetto glitch al testo.

```tsx
// Uso base (simboli casuali)
<EntityText>Messaggio dell'Entità</EntityText>

// Mappatura esatta Gaster-style
<EntityText useExactMapping>Messaggio</EntityText>
```

### Alfabeto Completo

#### LETTERE MAIUSCOLE (A-Z)
```
A → ✌  (Victory hand)
B → 👌  (OK hand)
C → 👍  (Thumbs up)
D → 👎  (Thumbs down)
E → ☜  (Left pointing index)
F → ☞  (Right pointing index)
G → ☝  (Up pointing index)
H → ☟  (Down pointing index)
I → ✋  (Raised hand)
J → ☺  (Smiling face)
K → 😐  (Neutral face)
L → ☹  (Frowning face)
M → 💣  (Bomb)
N → ☠  (Skull and crossbones)
O → 🏳  (White flag)
P → 🏱  (White pennant)
Q → ✈  (Airplane)
R → ☼  (Sun)
S → 💧  (Droplet)
T → ❄  (Snowflake)
U → ✞  (Latin cross)
V → ✝  (Cross)
W → ☩  (Cross of Jerusalem)
X → ✠  (Maltese cross)
Y → ✡  (Star of David)
Z → ☪  (Star and crescent)
```

#### LETTERE MINUSCOLE (a-z)
```
a → ♋  (Cancer)
b → ♌  (Leo)
c → ♍  (Virgo)
d → ♎  (Libra)
e → ♏  (Scorpio)
f → ♐  (Sagittarius)
g → ♑  (Capricorn)
h → ♒  (Aquarius)
i → ♓  (Pisces)
j → 🙰  (Script ligature)
k → 🙵  (Swash ampersand)
l → ●  (Black circle)
m → ❍  (Shadowed circle)
n → ■  (Black square)
o → □  (White square)
p → ◻  (White medium square)
q → ❑  (Shadowed square)
r → ❒  (Upper shadowed square)
s → ⬧  (Black lozenge)
t → ⧫  (Black lozenge)
u → ◆  (Black diamond)
v → ❖  (Diamond with X)
w → ⬥  (Medium diamond)
x → ⌧  (X in rectangle)
y → ⌘  (Place of interest)
z → ⍟  (APL circle star)
```

#### NUMERI (0-9)
```
0 → 📁  (File folder)
1 → 📂  (Open folder)
2 → 📄  (Page)
3 → 🗏  (Page)
4 → 🗐  (Pages)
5 → 🗄  (File cabinet)
6 → ⌛  (Hourglass)
7 → 🖮  (Keyboard)
8 → 🖰  (Mouse)
9 → 🖲  (Trackball)
```

### Impostazioni Glitch

| Parametro | Valore | Descrizione |
|-----------|--------|-------------|
| Frequenza | 0.5-1.5s | Tempo tra un glitch e l'altro |
| Durata | 100-200ms | Quanto dura ogni glitch |
| Caratteri | 1-4 | Quanti caratteri glitchano insieme |
| Primo glitch | 0.3-1s | Delay prima del primo glitch |

### Effetti CSS
- **Colore glitch:** Bianco con ombre rosse/cyan/viola
- **Animazione:** Tremolante con skew
- **Text-shadow:** Chromatic aberration effect

### Esempio Conversione
```
Testo originale: "Il gioco inizia ora"
Con glitch:      "Il ☝i□✝□ ♓■♓⍟♓♋ □❒♋"
```

### Ispirazione
Basato su W.D. Gaster di Undertale - personaggio che comunica in Wingdings.

---

## 📝 TONO E PERSONALITÀ

### Caratteristiche Vocali
- **Tono:** Neutro, freddo, calcolato
- **Stile:** Frasi brevi, dirette, criptiche
- **POV:** Prima persona ("Ti osservo", "Ho scelto te")
- **Emozioni:** Nessuna (macchina), ma con sfumature inquietanti
- **Visualizzazione:** SEMPRE con effetto glitch Wingdings

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

**Ultimo aggiornamento:** 25 Dicembre 2025
**Responsabile:** Matteo Zaramella
