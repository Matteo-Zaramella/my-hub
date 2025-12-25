# 📺 Terminal Welcome - Impostazioni

**File**: `app/components/TerminalWelcome.tsx`

---

## 📝 Messaggio Attuale (4 righe)

```typescript
const LINES = [
  'Eccoti.',
  'Sei stato invitato a una festa.',
  'Durante la serata, un gioco coinvolgente.',
  'Esplora il sito per scoprire dove e quando.'
]
```

---

## ⏱️ Ritmi e Velocità (in millisecondi)

```typescript
const TYPING_SPEED = 60          // Velocità per ogni lettera (uguale per tutte)
const PAUSE_BETWEEN_LINES = 800  // Pausa dopo ogni riga prima della successiva
const FINAL_PAUSE = 2500         // Pausa finale prima di mostrare la landing
const INITIAL_DELAY = 1500       // Schermo nero iniziale
```

### Spiegazione Ritmi:

**TYPING_SPEED** (60ms)
- Tempo tra una lettera e la successiva
- 60ms = velocità moderata, leggibile
- Più basso = più veloce | Più alto = più lento
- Range consigliato: 40-100ms

**PAUSE_BETWEEN_LINES** (800ms)
- Pausa DOPO che una riga è completata, prima di iniziare la successiva
- 800ms = meno di 1 secondo
- Permette di leggere la riga appena completata

**FINAL_PAUSE** (2500ms)
- Pausa finale con tutte e 4 le righe visibili
- Poi scompare e mostra la landing page
- 2.5 secondi per leggere il messaggio completo

**INITIAL_DELAY** (1500ms)
- Schermo nero all'inizio
- Crea suspense prima del primo carattere

---

## 🎬 Sequenza Animazione

1. **Schermo nero** → 1.5 secondi
2. **Riga 1** si scrive carattere per carattere
3. **Pausa** 0.8 secondi
4. **Riga 2** si scrive (riga 1 resta visibile)
5. **Pausa** 0.8 secondi
6. **Riga 3** si scrive (righe 1-2 restano visibili)
7. **Pausa** 0.8 secondi
8. **Riga 4** si scrive (righe 1-3 restano visibili)
9. **Pausa finale** 2.5 secondi (tutte e 4 le righe visibili)
10. **Landing page** appare

---

## ⏱️ Tempo Totale Stimato

Con i valori attuali:
- Schermo nero: 1.5s
- Riga 1 (7 caratteri): ~0.4s
- Pausa: 0.8s
- Riga 2 (31 caratteri): ~1.9s
- Pausa: 0.8s
- Riga 3 (38 caratteri): ~2.3s
- Pausa: 0.8s
- Riga 4 (43 caratteri): ~2.6s
- Pausa finale: 2.5s

**TOTALE: ~13.6 secondi**

---

## 🔧 Come Modificare

### Cambiare il Testo

Modifica l'array `LINES` (righe 11-16):

```typescript
const LINES = [
  'Prima riga qui',
  'Seconda riga qui',
  'Terza riga qui',
  'Quarta riga qui'
]
```

### Velocizzare/Rallentare le Lettere

Modifica `TYPING_SPEED`:
- Più veloce: 40ms
- Più lento: 100ms

### Cambiare Pause tra Righe

Modifica `PAUSE_BETWEEN_LINES`:
- Pausa corta: 500ms
- Pausa lunga: 1200ms

### Cambiare Pausa Finale

Modifica `FINAL_PAUSE`:
- Breve: 1500ms
- Lunga: 3500ms

---

## 🎯 Esempi Preset

### Veloce e Incisivo
```typescript
const TYPING_SPEED = 40
const PAUSE_BETWEEN_LINES = 500
const FINAL_PAUSE = 1500
const INITIAL_DELAY = 1000
```
**Tempo totale: ~9 secondi**

### Lento e Inquietante
```typescript
const TYPING_SPEED = 80
const PAUSE_BETWEEN_LINES = 1200
const FINAL_PAUSE = 3500
const INITIAL_DELAY = 2000
```
**Tempo totale: ~18 secondi**

### Bilanciato (ATTUALE)
```typescript
const TYPING_SPEED = 60
const PAUSE_BETWEEN_LINES = 800
const FINAL_PAUSE = 2500
const INITIAL_DELAY = 1500
```
**Tempo totale: ~13.6 secondi**

---

## 🎨 Caratteristiche Visive

- **Font**: Monospace (stile terminale)
- **Colore testo**: Bianco
- **Background**: Nero
- **Cursore**: Lampeggiante (500ms on/off)
- **Responsive**: Testo si adatta a mobile/tablet/desktop
- **Allineamento**: Centro schermo

---

## 🔄 Come Testare

Per vedere di nuovo il messaggio di benvenuto:

1. **Cancella localStorage**:
   - Apri DevTools (F12)
   - Console → scrivi: `localStorage.removeItem('hasSeenWelcome')`
   - Ricarica la pagina (F5)

2. **Oppure usa modalità incognito** (Ctrl+Shift+N)

---

## 📍 Posizione nel Codice

**File principale**: `app/components/TerminalWelcome.tsx`
- Righe 11-16: Testo del messaggio
- Righe 19-22: Velocità e ritmi
- Righe 112-122: Rendering HTML

**Chiamato da**: `app/LandingPage.tsx` (righe 44-58, 364)

---

**Pronto per essere personalizzato!** 🎬
