// Utility per combinare classi CSS
// Versione semplificata senza dipendenze esterne
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ')
}
