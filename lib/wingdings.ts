// ═══════════════════════════════════════════════════════════════════════════
// ALFABETO WINGDINGS - L'ENTITÀ
// ═══════════════════════════════════════════════════════════════════════════
// Mappatura caratteri → simboli Unicode (stile W.D. Gaster / Undertale)
// L'Entità comunica SEMPRE con testo glitchato usando questi simboli
// ═══════════════════════════════════════════════════════════════════════════

export const WINGDINGS_MAP: Record<string, string> = {
  // ─────────────────────────────────────────────────────────────────────────
  // LETTERE MAIUSCOLE (A-Z)
  // ─────────────────────────────────────────────────────────────────────────
  'A': '✌', // Victory hand
  'B': '👌', // OK hand
  'C': '👍', // Thumbs up
  'D': '👎', // Thumbs down
  'E': '☜', // Left pointing index
  'F': '☞', // Right pointing index
  'G': '☝', // Up pointing index
  'H': '☟', // Down pointing index
  'I': '✋', // Raised hand
  'J': '☺', // Smiling face
  'K': '😐', // Neutral face
  'L': '☹', // Frowning face
  'M': '💣', // Bomb
  'N': '☠', // Skull and crossbones
  'O': '🏳', // White flag
  'P': '🏱', // White pennant
  'Q': '✈', // Airplane
  'R': '☼', // Sun
  'S': '💧', // Droplet
  'T': '❄', // Snowflake
  'U': '✞', // Latin cross
  'V': '✝', // Cross
  'W': '☩', // Cross of Jerusalem
  'X': '✠', // Maltese cross
  'Y': '✡', // Star of David
  'Z': '☪', // Star and crescent

  // ─────────────────────────────────────────────────────────────────────────
  // LETTERE MINUSCOLE (a-z)
  // ─────────────────────────────────────────────────────────────────────────
  'a': '♋', // Cancer
  'b': '♌', // Leo
  'c': '♍', // Virgo
  'd': '♎', // Libra
  'e': '♏', // Scorpio
  'f': '♐', // Sagittarius
  'g': '♑', // Capricorn
  'h': '♒', // Aquarius
  'i': '♓', // Pisces
  'j': '🙰', // Script ligature
  'k': '🙵', // Swash ampersand
  'l': '●', // Black circle
  'm': '❍', // Shadowed circle
  'n': '■', // Black square
  'o': '□', // White square
  'p': '◻', // White medium square
  'q': '❑', // Shadowed square
  'r': '❒', // Upper shadowed square
  's': '⬧', // Black lozenge
  't': '⧫', // Black lozenge
  'u': '◆', // Black diamond
  'v': '❖', // Diamond with X
  'w': '⬥', // Medium diamond
  'x': '⌧', // X in rectangle
  'y': '⌘', // Place of interest
  'z': '⍟', // APL circle star

  // ─────────────────────────────────────────────────────────────────────────
  // NUMERI (0-9)
  // ─────────────────────────────────────────────────────────────────────────
  '0': '📁', // File folder
  '1': '📂', // Open folder
  '2': '📄', // Page
  '3': '🗏', // Page
  '4': '🗐', // Pages
  '5': '🗄', // File cabinet
  '6': '⌛', // Hourglass
  '7': '🖮', // Keyboard
  '8': '🖰', // Mouse
  '9': '🖲', // Trackball
}

// Converti testo completo in Wingdings (stile Gaster)
export function toWingdings(text: string): string {
  return text
    .split('')
    .map(char => WINGDINGS_MAP[char] || char)
    .join('')
}

// Converti singolo carattere in Wingdings
export function charToWingdings(char: string): string {
  return WINGDINGS_MAP[char] || char
}

// Ottieni simbolo Wingdings casuale
export function getRandomWingdings(): string {
  const symbols = Object.values(WINGDINGS_MAP)
  return symbols[Math.floor(Math.random() * symbols.length)]
}

// Array di tutti i simboli Wingdings (per glitch casuale)
export const WINGDINGS_SYMBOLS = Object.values(WINGDINGS_MAP)
