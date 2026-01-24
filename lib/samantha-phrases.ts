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

// Frasi per commenti durante l'inserimento delle parole
export const SAMANTHA_CLUE_COMMENTS = {
  correct: [
    "Esatto.",
    "Bene.",
    "Corretto.",
    "Sì.",
    "Continuate così.",
    "Una in meno.",
    "Procede bene.",
    "Avanti.",
    "Giusto.",
    "Ci siete.",
  ],
  wrong: [
    "No.",
    "Sbagliato.",
    "Riprova.",
    "Non è questa.",
    "Freddo.",
    "Lontano.",
    "Nope.",
    "Ancora.",
    "Di nuovo.",
    "Pensa meglio.",
  ],
  almostThere: [
    "Ci siete quasi.",
    "Manca poco.",
    "Quasi finito.",
    "L'ultima spinta.",
    "Avanti così.",
    "Non mollate ora.",
    "Il traguardo è vicino.",
    "Concentrazione.",
  ],
  firstClue: [
    "Iniziamo.",
    "Il primo passo.",
    "Si parte.",
    "Buon inizio.",
    "Ne mancano nove.",
  ],
  halfway: [
    "Metà strada.",
    "Cinque su dieci.",
    "A metà dell'opera.",
    "Non male.",
    "Continuate.",
  ]
}

// Messaggi di sistema per la chat (annunci automatici)
export const SYSTEM_MESSAGES = {
  clueFound: (teamName: string, clueNum: number) => [
    `🎯 La squadra ${teamName} ha trovato l'indizio ${clueNum}!`,
    `🔍 ${teamName} avanza! Indizio ${clueNum} svelato.`,
    `✨ Indizio ${clueNum} decifrato da ${teamName}!`,
  ],
  challengeCompleted: (teamName: string, monthName: string) => [
    `🏆 La squadra ${teamName} ha completato la sfida di ${monthName}!`,
    `🎉 ${teamName} trionfa nella sfida di ${monthName}!`,
    `⭐ Sfida ${monthName} conquistata da ${teamName}!`,
  ],
  pointsAwarded: (teamName: string, points: number) => [
    `💰 ${teamName} guadagna ${points} punti!`,
    `📈 +${points} punti per ${teamName}!`,
  ],
  ceremonyComplete: [
    `🎉 La cerimonia è completata! Il gioco ha inizio!`,
    `🚀 EVOLUZIONE completata! Che i giochi abbiano inizio!`,
    `✨ La porta si è aperta. Benvenuti nel gioco.`,
  ],
  playerJoined: (nickname: string, teamName: string) => [
    `👋 ${nickname} si è unito alla squadra ${teamName}!`,
    `🎮 Nuovo agente: ${nickname} per ${teamName}!`,
  ],
}

// Funzione per ottenere un messaggio di sistema random
export function getSystemMessage(
  type: 'clueFound' | 'challengeCompleted' | 'pointsAwarded' | 'ceremonyComplete' | 'playerJoined',
  ...args: (string | number)[]
): string {
  let messages: string[]

  switch (type) {
    case 'clueFound':
      messages = SYSTEM_MESSAGES.clueFound(args[0] as string, args[1] as number)
      break
    case 'challengeCompleted':
      messages = SYSTEM_MESSAGES.challengeCompleted(args[0] as string, args[1] as string)
      break
    case 'pointsAwarded':
      messages = SYSTEM_MESSAGES.pointsAwarded(args[0] as string, args[1] as number)
      break
    case 'ceremonyComplete':
      messages = SYSTEM_MESSAGES.ceremonyComplete
      break
    case 'playerJoined':
      messages = SYSTEM_MESSAGES.playerJoined(args[0] as string, args[1] as string)
      break
    default:
      return ''
  }

  return messages[Math.floor(Math.random() * messages.length)]
}

// ====================================
// TESTI UFFICIALI DI SAMANTHA
// ====================================

// Istruzioni del sistema - mostrate nella sezione "IL SISTEMA"
export const SAMANTHA_SYSTEM_INSTRUCTIONS = {
  title: "IL SISTEMA",
  subtitle: "Protocollo Operativo Annuale",
  sections: [
    {
      title: "Benvenuto, Agente.",
      content: `Sei stato selezionato per partecipare al Programma Annuale di Addestramento Interagenzia.
Da questo momento, fai parte di una delle quattro agenzie di intelligence più potenti del mondo.
La tua missione: accumulare punti per la tua squadra attraverso sfide mensili, collaborazione e strategia.`
    },
    {
      title: "Come Funziona",
      content: `Ogni mese verrà rilasciata una nuova sfida.
Tre indizi criptici ti guideranno verso una CACCIA AL TESORO nel mondo reale.
Giorno. Orario. Luogo.
Decifra gli indizi, presentati nel posto giusto al momento giusto, completa la sfida.`
    },
    {
      title: "Punti",
      content: `La tua squadra guadagna punti in diversi modi:
• Completare sfide mensili
• Essere i primi a decifrare indizi
• Partecipare a eventi speciali
• Azioni segrete che scoprirai durante l'anno

I punti individuali contribuiscono al totale della squadra.
La classifica generale si aggiorna in tempo reale.`
    },
    {
      title: "Le Squadre",
      content: `FSB (Russia) - Rosso
MOSSAD (Israele) - Blu
MSS (Cina) - Verde
AISE (Italia) - Oro

Non puoi cambiare squadra.
Collabora con i tuoi compagni.
La vittoria è collettiva.`
    },
    {
      title: "Comunicazioni",
      content: `Questo sito è il tuo centro operativo.
Qui troverai:
• Indizi per le sfide
• Chat globale e di squadra
• Classifica punti
• Annunci ufficiali

Controlla regolarmente. Le informazioni critiche appaiono senza preavviso.`
    },
    {
      title: "Nota Finale",
      content: `Il gioco dura un anno intero.
Alcune sezioni si sbloccheranno nel tempo.
Alcune informazioni sono riservate.
Alcune domande non avranno risposta.

Fidati del processo.
Fidati della tua squadra.
Non fidarti di nessun altro.`
    }
  ]
}

// Messaggio di attivazione post-mezzanotte
export const SAMANTHA_ACTIVATION_MESSAGE = {
  title: "OPERAZIONE RIVOLUZIONE",
  lines: [
    "Agenti,",
    "Il Programma di Addestramento è ufficialmente attivo.",
    "Da questo momento, ogni vostra azione conta.",
    "Le prime sfide verranno rilasciate a febbraio.",
    "Nel frattempo, familiarizzate con il sistema.",
    "Studiate i vostri compagni di squadra.",
    "Preparatevi.",
    "",
    "La partita è iniziata."
  ]
}

// Messaggio reclutamento temporaneo (riapertura iscrizioni)
export const SAMANTHA_RECRUITMENT_MESSAGES = {
  open: {
    title: "RECLUTAMENTO TEMPORANEO ATTIVO",
    message: "Finestra di iscrizione eccezionalmente aperta. Approfittatene.",
    footer: "Questa opportunità non si ripeterà."
  },
  closed: {
    title: "RECLUTAMENTO TERMINATO",
    message: "Le iscrizioni sono chiuse.",
    footer: "Chi è dentro, è dentro. Chi è fuori, resterà fuori."
  }
}

// Messaggi per sezioni bloccate
export const SAMANTHA_LOCKED_SECTIONS = {
  leaderboard: {
    unlockDate: "2026-10-31", // Halloween
    message: "ACCESSO LIMITATO",
    reason: "Classifica individuale disponibile da Halloween."
  },
  secretArchive: {
    unlockDate: "2026-06-01",
    message: "ARCHIVIO CLASSIFICATO",
    reason: "Accesso riservato. Sblocco previsto per giugno."
  },
  bonusChallenges: {
    unlockDate: null, // Sblocco manuale
    message: "OPERAZIONI SPECIALI",
    reason: "Contenuto non ancora autorizzato."
  }
}

// Funzione per ottenere una frase random
export function getRandomBlockedPhrase(): string {
  return SAMANTHA_BLOCKED_PHRASES[Math.floor(Math.random() * SAMANTHA_BLOCKED_PHRASES.length)]
}

// Funzione per ottenere un commento in base allo stato
export function getClueComment(type: 'correct' | 'wrong' | 'almostThere' | 'firstClue' | 'halfway'): string {
  const phrases = SAMANTHA_CLUE_COMMENTS[type]
  return phrases[Math.floor(Math.random() * phrases.length)]
}
