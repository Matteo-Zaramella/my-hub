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
  subtitle: "Protocollo Operativo",
  sections: [
    {
      title: "Benvenuto, Agente.",
      content: `Sei stato selezionato per partecipare al Programma di Addestramento Interagenzia.
Da questo momento, fai parte di una delle quattro agenzie di intelligence più potenti del mondo.
La tua missione: accumulare punti per la tua squadra attraverso sfide, collaborazione e strategia.`
    },
    {
      title: "Come Funziona",
      content: `Verrai avvisato quando ci sarà un nuovo evento.
Email. Notifiche. Instagram.
Tieni d'occhio i canali ufficiali.
Quando arriverà il momento, saprai cosa fare.`
    },
    {
      title: "Punti",
      content: `La tua squadra guadagna punti in diversi modi:
• Completare sfide
• Essere i primi a decifrare indizi

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

Riceverai comunicazioni anche via email dall'indirizzo noreply@matteozaramella.com (controlla la cartella spam).
Seguici anche su Instagram per aggiornamenti: @matteozaramella_

Controlla regolarmente. Le informazioni critiche appaiono senza preavviso.`
    },
    {
      title: "Nota Finale",
      content: `Alcune sezioni del sito si sbloccheranno progressivamente, quando sarà il momento giusto.
Non tutte le informazioni sono accessibili fin da subito, e alcune domande potrebbero rimanere senza risposta.

Segui il processo e affidati alla tua squadra per affrontare le sfide che verranno.
Al di fuori del tuo team, mantieni un sano scetticismo.`
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

// ====================================
// SISTEMA SAMANTHA DINAMICO
// Frasi per pagine specifiche e eventi
// ====================================

// Tipi per il sistema Samantha (definiti qui per evitare dipendenze circolari)
export type SamanthaMessageType = 'info' | 'warning' | 'error' | 'success' | 'mystery' | 'system'
export type SamanthaMood = 'neutral' | 'mysterious' | 'sarcastic' | 'helpful' | 'creepy'

// Route dove le info di gioco possono essere mostrate
export const GAME_ALLOWED_ROUTES = ['/game/area', '/game']

// Pagine che contengono info di gioco (gameOnly = true)
export const GAME_ONLY_PAGES = ['gameArea', 'challenges', 'leaderboard']

// Eventi che contengono info di gioco
export const GAME_ONLY_EVENTS = ['newMessage', 'challengeComplete', 'registration']

// Configurazione frasi per pagina
export const SAMANTHA_PAGE_PHRASES: Record<string, {
  phrases: string[]
  type: SamanthaMessageType
  mood: SamanthaMood
  gameOnly?: boolean  // Se true, mostrare solo in /game/area
}> = {
  // Landing page - benvenuto misterioso
  landing: {
    phrases: [
      "Benvenuto.",
      "Ti aspettavo.",
      "Inserisci il tuo codice.",
      "Sei nuovo qui?",
      "Un altro visitatore...",
      "Questa porta conduce altrove.",
      "Pronto per entrare?",
    ],
    type: 'mystery',
    mood: 'mysterious'
  },

  // Pagina wishlist
  wishlist: {
    phrases: [
      "Sfoglia pure.",
      "Idee regalo.",
      "Qualcosa ti interessa?",
      "Lista desideri.",
      "Non tutto è in vendita.",
    ],
    type: 'info',
    mood: 'neutral'
  },

  // Area gioco - SOLO in /game/area
  gameArea: {
    phrases: [
      "Bentornato, agente.",
      "Centro operativo attivo.",
      "Nuove missioni in arrivo.",
      "La tua squadra ti aspetta.",
      "Il sistema è online.",
    ],
    type: 'system',
    mood: 'helpful',
    gameOnly: true
  },

  // Pagina sfide - SOLO in /game/area
  challenges: {
    phrases: [
      "Nuove sfide disponibili.",
      "Metti alla prova le tue abilità.",
      "Punti in palio.",
      "Chi sarà il più veloce?",
      "La competizione è aperta.",
    ],
    type: 'info',
    mood: 'neutral',
    gameOnly: true
  },

  // Pagina classifica - SOLO in /game/area
  leaderboard: {
    phrases: [
      "La classifica aggiornata.",
      "Chi comanda?",
      "I punti non mentono.",
      "La competizione si fa seria.",
      "Ogni punto conta.",
    ],
    type: 'info',
    mood: 'neutral',
    gameOnly: true
  },

  // Area privata
  private: {
    phrases: [
      "Area riservata.",
      "Accesso limitato.",
      "Solo per autorizzati.",
      "Identificati.",
    ],
    type: 'warning',
    mood: 'mysterious'
  },

  // Dashboard
  dashboard: {
    phrases: [
      "Dashboard personale.",
      "I tuoi dati.",
      "Tutto sotto controllo.",
      "Panoramica completa.",
    ],
    type: 'info',
    mood: 'helpful'
  },

  // Errore 404
  notFound: {
    phrases: [
      "Pagina non trovata.",
      "Hai sbagliato strada.",
      "Questo posto non esiste.",
      "Torna indietro.",
      "Niente da vedere qui.",
      "Ti sei perso?",
      "Questa pagina è stata... rimossa.",
    ],
    type: 'error',
    mood: 'sarcastic'
  }
}

// Frasi per eventi specifici
export const SAMANTHA_EVENT_PHRASES: Record<string, string[]> = {
  // Benvenuto generico
  welcome: [
    "Benvenuto.",
    "Ciao.",
    "Eccoti.",
    "Ti aspettavo.",
    "Finalmente.",
  ],

  // Errori
  error: [
    "Qualcosa è andato storto.",
    "Errore.",
    "Non ha funzionato.",
    "Riprova.",
    "Problema tecnico.",
    "Il sistema ha avuto un... inconveniente.",
  ],

  // Successo
  success: [
    "Fatto.",
    "Completato.",
    "Operazione riuscita.",
    "Perfetto.",
    "Eccellente.",
    "Ben fatto.",
  ],

  // Caricamento
  loading: [
    "Caricamento...",
    "Un momento...",
    "Elaborazione...",
    "Pazienza...",
    "Quasi pronto...",
  ],

  // Inattività
  idle: [
    "Sei ancora lì?",
    "Tutto bene?",
    "Ti sei addormentato?",
    "Il tempo passa...",
    "Aspetto.",
    "...",
  ],

  // Logout
  logout: [
    "Arrivederci.",
    "A presto.",
    "Tornerai.",
    "La porta è sempre aperta.",
    "Ci rivediamo.",
  ],

  // Login riuscito
  loginSuccess: [
    "Accesso confermato.",
    "Identità verificata.",
    "Benvenuto nel sistema.",
    "Autenticazione completata.",
  ],

  // Login fallito
  loginFailed: [
    "Accesso negato.",
    "Credenziali non valide.",
    "Chi sei veramente?",
    "Non ti riconosco.",
    "Riprova.",
  ],

  // Registrazione
  registration: [
    "Nuovo agente rilevato.",
    "Registrazione in corso.",
    "Un nuovo volto.",
    "Benvenuto nel programma.",
  ],

  // Codice corretto
  codeCorrect: [
    "Codice accettato.",
    "Accesso garantito.",
    "Benvenuto.",
    "Identità confermata.",
  ],

  // Codice errato
  codeWrong: [
    "Codice non valido.",
    "Riprova.",
    "Non è questo il codice.",
    "Sbagliato.",
  ],

  // Chat - nuovo messaggio
  newMessage: [
    "Nuovo messaggio.",
    "Qualcuno ha scritto.",
    "Comunicazione in arrivo.",
  ],

  // Sfida completata
  challengeComplete: [
    "Sfida completata!",
    "Missione compiuta.",
    "Obiettivo raggiunto.",
    "Punti guadagnati.",
  ],

  // Notte (dopo le 23:00)
  nightTime: [
    "È tardi.",
    "Dovresti dormire.",
    "Le ore piccole...",
    "Notte fonda.",
    "Il buio porta consiglio.",
  ],

  // Mattina (6:00-12:00)
  morning: [
    "Buongiorno.",
    "Una nuova giornata.",
    "Caffè?",
    "Pronto per iniziare?",
  ],

  // Pomeriggio (12:00-18:00)
  afternoon: [
    "Buon pomeriggio.",
    "La giornata procede.",
    "Ancora molto da fare.",
  ],

  // Sera (18:00-23:00)
  evening: [
    "Buonasera.",
    "La giornata volge al termine.",
    "Ancora qui?",
  ]
}

// Funzione helper per ottenere frase di pagina
export function getPagePhrase(page: keyof typeof SAMANTHA_PAGE_PHRASES): string {
  const config = SAMANTHA_PAGE_PHRASES[page]
  if (!config) return ''
  return config.phrases[Math.floor(Math.random() * config.phrases.length)]
}

// Funzione helper per ottenere frase di evento
export function getEventPhrase(event: keyof typeof SAMANTHA_EVENT_PHRASES): string {
  const phrases = SAMANTHA_EVENT_PHRASES[event]
  if (!phrases) return ''
  return phrases[Math.floor(Math.random() * phrases.length)]
}

// Funzione per ottenere saluto basato sull'ora
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()

  if (hour >= 6 && hour < 12) {
    return getEventPhrase('morning')
  } else if (hour >= 12 && hour < 18) {
    return getEventPhrase('afternoon')
  } else if (hour >= 18 && hour < 23) {
    return getEventPhrase('evening')
  } else {
    return getEventPhrase('nightTime')
  }
}
