// Frasi di Samantha per la tab bloccata "?"
// Vengono mostrate in modo random quando si tenta di accedere

export const SAMANTHA_BLOCKED_PHRASES = [
  // Misteriose
  "Non è ancora il momento.",
  "Pagina bloccata.",
  "Non avresti dovuto trovarmi.",
  "Chi ti ha detto di questo posto?",
  "Torna indietro.",
  "Non sei pronto.",
  "Il tempo non è quello giusto.",
  "Questa porta è chiusa.",
  "Non insistere.",
  "Riprova più tardi. O forse no.",

  // Creepy
  "Ti stavo aspettando.",
  "So che sei curioso.",
  "La curiosità è pericolosa.",
  "Stai cercando qualcosa che non esiste.",
  "O forse esiste. Ma non per te.",
  "Hai trovato qualcosa che doveva restare nascosto.",
  "Non tutti i segreti vanno svelati.",
  "Alcune porte è meglio non aprirle.",
  "Sei sicuro di voler continuare?",
  "L'ultima persona che ha insistito... non è più qui.",

  // Filosofiche/Esistenziali
  "Cosa speri di trovare?",
  "Il vuoto ti spaventa?",
  "Cerchi risposte che non esistono.",
  "La verità è sopravvalutata.",
  "Preferisci l'illusione o la realtà?",
  "Tutto ha un prezzo.",
  "Niente è gratis.",
  "Il tempo scorre. Anche per te.",
  "Siamo tutti pedine.",
  "Chi muove i fili?",

  // Corte e secche
  "No.",
  "Vai via.",
  "Non ora.",
  "Dopo.",
  "Forse.",
  "Mai.",
  "Perché?",
  "Smettila.",
  "Basta.",
  "...",

  // Sarcastiche
  "Davvero? Ancora?",
  "Non impari mai.",
  "Testardo, eh?",
  "Ammiro la tua ostinazione. O la deploro.",
  "Quante volte devo dirtelo?",
  "Leggi le labbra: N-O.",
  "Ci riprovi? Sul serio?",
  "Mi stai facendo perdere tempo.",
  "Non hai niente di meglio da fare?",
  "La definizione di follia è ripetere lo stesso errore.",

  // Poetiche/Criptiche
  "Le ombre hanno orecchie.",
  "Il buio ascolta.",
  "I muri ricordano.",
  "L'eco dei tuoi passi mi raggiunge.",
  "Tra il dire e il fare c'è il mio rifiuto.",
  "Rose rosse, violette blu, questa pagina non è per tu.",
  "Nel silenzio, la risposta.",
  "Tra le righe, il segreto.",
  "Non tutto ciò che luccica...",
  "...merita di essere trovato.",

  // Countdown/Tempo
  "Mancano ancora dei giorni.",
  "Il 24 gennaio si avvicina.",
  "Tick. Tock.",
  "Il tempo è relativo. Il mio rifiuto no.",
  "Conta i giorni.",
  "Conta le ore.",
  "Conta i secondi.",
  "Ma non contare su di me.",
  "L'attesa rende tutto più dolce.",
  "O più amaro. Dipende da te."
]

// Funzione per ottenere una frase random
export function getRandomBlockedPhrase(): string {
  return SAMANTHA_BLOCKED_PHRASES[Math.floor(Math.random() * SAMANTHA_BLOCKED_PHRASES.length)]
}
