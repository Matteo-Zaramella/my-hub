# Aspetti Tecnici

## File Principali

| File | Descrizione |
|------|-------------|
| `app/components/TerminalWelcome.tsx` | Componente principale dell'animazione |
| `lib/wingdings.ts` | Conversione caratteri → Wingdings |

## Componente TerminalWelcome

### Props

```typescript
interface TerminalWelcomeProps {
  onComplete: () => void    // Callback quando animazione finisce
  daysRemaining: number     // (non utilizzato attualmente)
}
```

### Stati Interni

```typescript
currentText: string           // Testo attualmente visualizzato
showCursor: boolean           // Visibilità cursore lampeggiante
animationStarted: boolean     // Se l'animazione è iniziata
isLastLine: boolean           // Se siamo sull'ultima riga
glitchPhase: 'none' | 'rgb' | 'wingdings'  // Fase dell'effetto finale
```

### Costanti di Timing

```typescript
const TYPING_SPEED = 60              // ms per carattere
const PAUSE_BETWEEN_LINES = 800      // ms tra le frasi
const INITIAL_DELAY = 1500           // ms prima di iniziare
const RGB_GLITCH_DURATION = 1000     // ms effetto RGB
const WINGDINGS_DURATION = 500       // ms effetto Wingdings
```

### Array dei Messaggi

```typescript
const LINES = [
  'Salve.',
  'Sono Samantha, l\'entità creata da Matteo per questo evento.',
  'Ti prego di proseguire seguendo le indicazioni.',
  'Dovrai prima selezionare il nome del tuo personaggio e poi verificare l\'accesso tramite il tuo indirizzo email.',
  'Riceverai il codice OTP di conferma per l\'email ed un personale codice identificativo segreto.',
  'Non perdere il codice e non condividerlo.',
  'Il luogo, la data e l\'orario della festa saranno disponibili all\'interno del sito una volta effettuata la registrazione.',
  'Buon divertimento!'
]

const GLITCH_LINE_INDEX = LINES.length - 1  // Solo ultima riga ha glitch
```

## Persistenza

```typescript
// Controllo se mostrare l'animazione
localStorage.getItem('terminal_welcome_shown')

// Dopo completamento
localStorage.setItem('terminal_welcome_shown', 'true')
```

## CSS/Animazioni

### Glitch RGB
```css
.rgb-glitch-text {
  animation: screen-shake 0.1s infinite;
}

.glitch-char {
  text-shadow: -3px 0 #ff0040, 3px 0 #00ffff;
  animation: char-glitch 0.1s infinite;
}
```

### Wingdings
```css
.wingdings-text {
  color: #a855f7;
  text-shadow: 0 0 10px #a855f7, 0 0 20px #a855f7;
  animation: wingdings-pulse 0.2s infinite;
}
```

## Integrazione nel Flusso

```
LandingPage.tsx
  └── Controlla localStorage
      ├── Se NON mostrato → <TerminalWelcome onComplete={...} />
      └── Se mostrato → Mostra selezione nome direttamente
```
