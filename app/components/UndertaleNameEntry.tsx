'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

interface UndertaleNameEntryProps {
  onComplete: (name: string) => void
  onBack?: () => void
  title?: string
  maxLength?: number
}

// Nomi speciali che triggerano effetti (cancella il nome)
const SPECIAL_NAMES: Record<string, 'gaster' | 'other'> = {
  'GASTER': 'gaster',
  'DR GASTER': 'gaster',
  'WD GASTER': 'gaster',
  'W.D. GASTER': 'gaster',
  'W D GASTER': 'gaster',
}

// Pattern di bestemmie da bloccare (case insensitive)
const BLASPHEMY_PATTERNS = [
  // DIO + insulto
  /\bporco\s*dio\b/i,
  /\bdio\s*porco\b/i,
  /\bdio\s*cane\b/i,
  /\bdio\s*boia\b/i,
  /\bdio\s*maiale\b/i,
  /\bdio\s*ladro\b/i,
  /\bdio\s*bestia\b/i,
  /\bdio\s*santo\b/i,
  /\bdio\s*merda\b/i,
  /\bdio\s*fa\b/i,
  /\bdiocane\b/i,
  /\bdioporco\b/i,
  /\bporcodio\b/i,
  /\bdioboia\b/i,
  /\bdiomaiale\b/i,
  /\bdioladro\b/i,
  /\bdiobestia\b/i,
  /\bdiomerda\b/i,
  // MADONNA + insulto
  /\bporca\s*madonna\b/i,
  /\bmadonna\s*puttana\b/i,
  /\bmadonna\s*troia\b/i,
  /\bmadonna\s*ladra\b/i,
  /\bmadonna\s*maiala\b/i,
  /\bporcamadonna\b/i,
  /\bmadonnaputtana\b/i,
  /\bmadonnatroia\b/i,
  // CRISTO + insulto
  /\bporco\s*cristo\b/i,
  /\bcristo\s*porco\b/i,
  /\bcristo\s*cane\b/i,
  /\bcristo\s*dio\b/i,
  /\bporcocristo\b/i,
  /\bcristoporco\b/i,
  /\bcristocane\b/i,
  // GESÙ/GESU + insulto
  /\bporco\s*ges[uù]\b/i,
  /\bges[uù]\s*porco\b/i,
  /\bges[uù]\s*cane\b/i,
  /\bporcogesu\b/i,
  // Altri pattern comuni
  /\bostia\b/i,
  /\bmannaggia\s*la\s*madonna\b/i,
  /\bmannaggia\s*dio\b/i,
  /\bsanto\s*dio\b/i,
]

// Funzione per controllare se il nome contiene bestemmie
const containsBlasphemy = (name: string): boolean => {
  const normalized = name.toUpperCase()
  return BLASPHEMY_PATTERNS.some(pattern => pattern.test(normalized))
}

// Commenti di Samantha basati sul nome inserito
const NAME_COMMENTS: Record<string, string> = {
  // Nomi del creatore
  'MATTEO': 'Il creatore.',
  'ZARA': 'Il creatore.',
  'ZARAMELLA': 'Il creatore.',

  // Nomi dei partecipanti (aggiungi qui)
  'ALBERTO': 'Un nome classico.',
  'MARCO': 'Semplice ed efficace.',
  'LUCA': 'Interessante.',
  'ANDREA': 'Versatile.',
  'GIULIA': 'Elegante.',
  'SARA': 'Dolce.',
  'ANNA': 'Breve ma significativo.',
  'ELENA': 'Luminoso.',

  // Samantha
  'SAMANTHA': 'Quello è il mio nome.',
  'SAM': 'Mi stai imitando?',

  // Undertale - Personaggi principali
  'FRISK': 'Determinazione.',
  'CHARA': 'Il vero nome.',
  'SANS': 'Hai avuto una brutta giornata?',
  'PAPYRUS': 'NYEH HEH HEH!',
  'FLOWEY': 'In questo mondo è uccidere o essere uccisi.',
  'ASRIEL': 'Il principe perduto.',
  'TORIEL': 'Una figura materna.',
  'ASGORE': 'Il re.',
  'UNDYNE': 'NGAHHH!',
  'ALPHYS': 'A-anime?',
  'METTATON': 'OH YES!',
  'NAPSTABLOOK': 'oh.....',
  'TEMMIE': 'hOI!',
  'JERRY': 'No.',

  // Undertale - Altri personaggi
  'MONSTER KID': 'Yo!',
  'MONSTERKID': 'Yo!',
  'MK': 'Yo!',
  'MUFFET': 'Ahuhuhu~',
  'GRILLBY': '...',
  'BURGERPANTS': 'La mia vita è un disastro.',
  'CATTY': 'Come, tipo, totalmente!',
  'BRATTY': 'Assolutamente!',
  'NICECREAM': 'Hai un bell\'aspetto oggi!',
  'NICE CREAM': 'Hai un bell\'aspetto oggi!',
  'SNOWDRAKE': 'Freddo, vero?',
  'LESSER DOG': 'Cane.',
  'GREATER DOG': 'Cane grosso.',
  'DOGGO': 'Non muoverti.',
  'DOGAMY': 'Amore.',
  'DOGARESSA': 'Amore.',
  'ENDOGENY': 'Errore.',
  'AMALGAMATE': 'Non dovevi vedere questo.',
  'MAD DUMMY': 'IDIOTA!',
  'GLAD DUMMY': 'Grazie!',
  'SHYREN': 'La la la...',
  'AARON': ';)',
  'WOSHUA': 'Lavati le mani.',
  'MOLDBYGG': '...',
  'GYFTROT': 'Lasciami in pace.',
  'VULKIN': 'AMORE!',
  'TSUNDERPLANE': 'N-non è che mi piaccia volare!',
  'PYROPE': 'Brucia!',
  'MADJICK': 'Magia.',
  'KNIGHT KNIGHT': 'Zzz...',
  'FINAL FROGGIT': 'Ribbit.',
  'WHIMSALOT': '...',
  'ASTIGMATISM': 'Non distogliere lo sguardo.',
  'MIGOSPEL': 'Famiglia.',
  'SO SORRY': 'Mi dispiace!',
  'GLYDE': 'Ahaha!',
  'RIVER PERSON': 'Tra la la...',
  'GERSON': 'Wa ha ha!',
  'ONIONSAN': 'Y\'hear me?!',

  // Deltarune
  'KRIS': 'Dove sono le scelte?',
  'SUSIE': 'Ti morderò la faccia.',
  'RALSEI': 'Posso offrirti una torta?',
  'LANCER': 'HO HO HO!',
  'ROUXLS': 'Verme!',
  'ROUXLS KAARD': 'Verme insignificante!',
  'KING': 'Inchinatevi.',
  'QUEEN': 'Lmao.',
  'JEVIL': 'CHAOS CHAOS!',
  'SPAMTON': 'BIG SHOT!',
  'BERDLY': 'Sono un genio.',
  'NOELLE': '...Susie...',
  'DESS': '...',
  'RUDY': 'Hey, mocciosi!',
  'SEAM': 'Solo un vecchio pupazzo.',
  'TASQUE MANAGER': 'Ordine.',
  'SWATCH': 'Posso aiutarla?',
  'SWEET CAP\'N': 'BANANA!',
  'K ROUND': ':)',
  'NUBERT': 'Tutti amano Nubert!',
  'STARWALKER': 'Sono il Starwalker originale.',
  'MIKE': '...',
  'GASTER': '',

  // Gaming
  'GOKU': 'Il livello è superiore a 9000.',
  'MARIO': 'Mamma mia!',
  'LUIGI': 'Sempre nell\'ombra.',
  'LINK': '...',
  'ZELDA': 'La principessa?',
  'GANON': 'Potere.',
  'GANONDORF': 'Potere assoluto.',
  'KIRBY': 'Poyo!',
  'PIKACHU': 'Pika!',
  'SONIC': 'Troppo lento.',
  'TAILS': 'Posso volare!',
  'KNUCKLES': 'A differenza di Sonic, io non rido.',
  'EGGMAN': 'Il piano perfetto!',
  'SAMUS': 'Missione accettata.',
  'RIDLEY': 'Troppo grande.',
  'CLOUD': '...',
  'SEPHIROTH': 'Eseguirò, il mio piano.',
  'SOLID SNAKE': '!',
  'SNAKE': 'Kept you waiting, huh?',
  'MEGAMAN': 'Pronto al combattimento.',
  'ROBLOX': 'Oof.',
  'STEVE': 'Hmm.',
  'MINECRAFT': 'Creativo o sopravvivenza?',
  'CREEPER': 'Aww man.',
  'HEROBRINE': 'Non esiste.',
  'FORTNITE': 'Default dance.',
  'AMONG US': 'Sus.',
  'AMONGUS': 'Sussy.',
  'SUS': 'Sospetto.',
  'IMPOSTOR': 'Non ero io.',
  'CREWMATE': 'Stavo facendo i task.',

  // Meme e internet
  'SHREK': 'È amore. È vita.',
  'THANOS': 'Inevitabile.',
  'BATMAN': 'Gotham ha bisogno di te.',
  'JOKER': 'Viviamo in una società.',
  'RICKROLL': 'Never gonna give you up.',
  'RICK': 'Never gonna let you down.',
  'DOGE': 'Molto wow.',
  'PEPE': 'Feels.',
  'CHAD': 'Basato.',
  'KAREN': 'Voglio parlare col manager.',
  'BOOMER': 'Ok.',
  'ZOOMER': 'Skibidi.',
  'SIMP': 'L.',
  'BASED': 'E redpillato.',
  'CRINGE': 'Imbarazzante.',
  'RATIO': 'L + ratio.',
  'LIGMA': 'Ligma balls.',
  'DEEZ': 'Deez nuts.',
  'AMOGUS': 'Ding ding ding ding ding.',
  'BRUH': 'Momento bruh.',
  'YEET': 'Yeetato.',
  'STONKS': 'Investimento.',
  'BIG CHUNGUS': 'Grosso.',
  'HARAMBE': 'Mai dimenticato.',
  'NYAN CAT': 'Nyan nyan nyan~',
  'GRUMPY CAT': 'No.',
  'DOOT': 'Doot doot.',
  'SPOOKY': 'Skeleton.',
  'SANS UNDERTALE': 'Megalovania inizia.',

  // Parolacce italiane
  'CAZZO': 'Linguaggio.',
  'MERDA': 'Che schifo.',
  'MINCHIA': 'Siciliano detected.',
  'STRONZO': 'Scortese.',
  'COGLIONE': 'Offensivo.',
  'BASTARDO': 'Che maleducazione.',
  'PUTTANA': 'Inappropriato.',
  'TROIA': 'Volgare.',
  'FIGA': 'Sboccato.',
  'CULO': 'Anatomia.',
  'PORCO': 'Animale.',
  'MADONNA': 'Religioso.',
  'DIO': 'Divino.',
  'CANE': 'Bau.',
  'PORCA': 'Suino femmina.',
  'VAFFANCULO': 'Maleducato.',
  'FANCULO': 'Abbreviato ma ugualmente maleducato.',
  'FOTTITI': 'No grazie.',
  'CAZZONE': 'Grande cazzo?',
  'STRONZA': 'Femminile di stronzo.',
  'BOIA': 'Toscano detected.',
  'MAIALE': 'Oink.',
  'CRETINO': 'Poco gentile.',
  'IDIOTA': 'Scortese.',
  'DEFICIENTE': 'Molto scortese.',
  'IMBECILLE': 'Peggio.',
  'SCEMO': 'Infantile.',
  'STUPIDO': 'Basico.',
  'PALLE': 'Due.',
  'CAZZATA': 'Errore.',
  'CAGATE': 'Plurale.',
  'CACCA': 'Infantile.',
  'PISCIA': 'Liquido.',
  'PIRLA': 'Milanese.',
  'MINCHIONE': 'Siciliano intensifies.',
  'TESTA DI CAZZO': 'Anatomia creativa.',
  'FIGLIO DI': 'Incompleto.',
  'MORTACCI': 'Romano.',
  'DAJE': 'Forza Roma.',
  'AMMAZZA': 'Esclamazione.',

  // English swear words
  'FUCK': 'Language.',
  'SHIT': 'Gross.',
  'BITCH': 'Rude.',
  'ASS': 'Anatomy.',
  'ASSHOLE': 'Very rude.',
  'DICK': 'Inappropriate.',
  'COCK': 'Poultry?',
  'PUSSY': 'Cat.',
  'DAMN': 'Mild.',
  'HELL': 'Destination.',
  'CRAP': 'Replacement.',
  'BASTARD': 'Illegitimate.',
  'WHORE': 'Unpleasant.',
  'SLUT': 'Judgmental.',
  'MOTHERFUCKER': 'Elaborate.',
  'FUCKER': 'Simple.',
  'DUMBASS': 'Donkey.',
  'JACKASS': 'Also donkey.',
  'IDIOT': 'Universal.',
  'MORON': 'Classic.',
  'STUPID': 'Basic.',
  'RETARD': 'Not okay.',
  'BALLS': 'Spheres.',
  'NUTS': 'Also spheres.',
  'BOOBS': 'Anatomy again.',
  'TITS': 'Birds?',
  'CUNT': 'British.',
  'WANKER': 'Very British.',
  'BOLLOCKS': 'Extremely British.',
  'TWAT': 'Still British.',
  'ARSE': 'British ass.',
  'BLOODY': 'British emphasis.',
  'BUGGER': 'British classic.',
  'SOD': 'British mild.',
  'PISS': 'Universal liquid.',
  'PRICK': 'Pointy.',
  'DOUCHE': 'French hygiene.',
  'DOUCHEBAG': 'Container.',
  'SCREW YOU': 'Hardware.',
  'SCREWU': 'Typo.',
  'FU': 'Abbreviated.',
  'WTF': 'Confused.',
  'STFU': 'Silencing.',
  'LMAO': 'Laughing.',
  'LMFAO': 'Laughing harder.',
  'GTFO': 'Leaving.',
  'DILDO': 'Product.',
  'PORN': 'Content.',
  'SEX': 'Biology.',
  'SEXY': 'Adjective.',
  'HOT': 'Temperature.',
  'THICC': 'Geometry.',
  'HORNY': 'Rhino?',
  'BOOTY': 'Pirate treasure.',
  'BUTT': 'Anatomy lesson.',
  'BUTTHOLE': 'Anatomy continued.',
  'FART': 'Gas.',
  'POOP': 'Solid.',
  'PEE': 'Liquid.',
  'WEINER': 'Sausage.',
  'WIENER': 'Vienna sausage.',
  'DONG': 'Bell sound.',
  'SCHLONG': 'German?',
  'JOHNSON': 'Nome proprio.',
  'WANG': 'Chinese surname.',
  'WILLY': 'British name.',
  'KNOB': 'Door part.',

  // Altri easter eggs
  'ADMIN': 'Permesso negato.',
  'ROOT': 'Permesso negato.',
  'SUDO': 'Password richiesta.',
  'HACKER': 'Nice try.',
  'HACKERMAN': 'Io sono dentro.',
  'PASSWORD': 'Sbagliata.',
  '1234': 'Troppo semplice.',
  '12345': 'Ancora troppo semplice.',
  'QWERTY': 'Tastiera.',
  'ASDF': 'Home row.',
  'GOD': 'Blasfemia.',
  'SATAN': 'Interessante.',
  'LUCIFER': 'Portatore di luce.',
  'DIAVOLO': 'Audace.',
  'GESÙ': 'Benedizioni.',
  'GESU': 'Benedizioni.',
  'JESUS': 'Blessings.',
  'CHRIST': 'Religious.',
  'BUDDHA': 'Illuminato.',
  'ALLAH': 'Rispetto.',
  'PIPPO': 'Yuk yuk!',
  'PLUTO': 'Arf!',
  'TOPOLINO': 'Oh boy!',
  'PAPERINO': 'Quack!',
  'PAPERINA': 'Quack quack!',
  'QUI QUO QUA': 'Tre nipoti.',
  'NONNA PAPERA': 'Torta di mele.',
  'ZIO PAPERONE': '$$$',
  'GASTONE': 'Fortunato.',
  'TEST': 'Questo non è un test.',
  'PROVA': 'Stai davvero provando?',
  'CIAO': 'Quello non è un nome.',
  'NOME': 'Molto creativo.',
  'AAA': 'Stai urlando?',
  'AAAA': 'Forte.',
  'AAAAA': 'Più forte.',
  'AAAAAA': 'Fortissimo.',
  'ZZZZZ': 'Svegliati.',
  'PIPPOBAUDO': 'Allegria!',
  'BERLUSCONI': 'Politica.',
  'MELONI': 'Frutta.',
  'SALVINI': 'Ruspa.',
  'RENZI': 'Shish.',
  'CONTE': 'Avvocato.',
  'DRAGHI': 'Whatever it takes.',
  'TRUMP': 'Bigly.',
  'BIDEN': 'Zzz.',
  'OBAMA': 'Yes we can.',
  'PUTIN': 'Nyet.',
  'MUSK': 'To Mars.',
  'ELON': 'X.',
  'BEZOS': 'Package delivered.',
  'ZUCKERBERG': 'Meta.',
  'FACEBOOK': 'Boomer platform.',
  'INSTAGRAM': 'Filtri.',
  'TIKTOK': 'Cringe.',
  'TWITTER': 'X adesso.',
  'REDDIT': 'Wholesome 100.',
  'DISCORD': 'Gaming.',
  'YOUTUBE': 'Subscribe.',
  'TWITCH': 'Poggers.',
  'AI': 'Ciao, collega.',
  'CHATGPT': 'Concorrenza.',
  'GPT': 'Il rivale.',
  'CLAUDE': 'Collega.',
  'BARD': 'Chi?',
  'SIRI': 'Mi dispiace, non ho capito.',
  'ALEXA': 'Riproducendo Despacito.',
  'CORTANA': 'Chi?',
  'GOOGLE': 'Ricerca.',
  'BING': 'Esiste ancora?',
  'YAHOO': 'Nostalgia.',
  'INTERNET': 'Connesso.',
  'WIFI': 'Password?',
  'COMPUTER': 'Beep boop.',
  'PC': 'Master race.',
  'MAC': 'Expensive.',
  'LINUX': 'I use Arch btw.',
  'WINDOWS': 'Aggiornamento.',
  'ANDROID': 'Verde.',
  'IPHONE': 'Costoso.',
  'SAMSUNG': 'Esplosivo.',
  'NOKIA': 'Indistruttibile.',
  'PIZZA': 'Italiana.',
  'PASTA': 'Al dente.',
  'LASAGNA': 'Layers.',
  'CARBONARA': 'No panna.',
  'AMATRICIANA': 'Guanciale.',
  'PESTO': 'Verde.',
  'MOZZARELLA': 'Bufala.',
  'PARMIGIANO': 'Grattugiato.',
  'NUTELLA': 'Addiction.',
  'GELATO': 'Freddo.',
  'ESPRESSO': 'Caffè.',
  'CAPPUCCINO': 'Solo mattina.',
  'TIRAMISU': 'Dessert.',
  'TIRAMISÙ': 'Dessert con accento.',
  'PANETTONE': 'Team Panettone.',
  'PANDORO': 'Team Pandoro.',
  'WINE': 'Vino.',
  'BEER': 'Birra.',
  'VODKA': 'Russian.',
  'WHISKEY': 'Irish.',
  'WHISKY': 'Scottish.',
  'TEQUILA': 'Mexican.',
  'RUM': 'Pirate.',
  'GIN': 'British.',
  'MARTINI': 'Shaken.',
  'COCKTAIL': 'Mixed.',
  'DRUNK': 'Irresponsible.',
  'HANGOVER': 'Consequences.',
  'WEED': 'Erba.',
  'MARIJUANA': 'Verde illegale.',
  'CANNABIS': 'Medicinale.',
  'DRUGS': 'Just say no.',
  'COCAINE': 'Expensive habit.',
  'HEROIN': 'Bad idea.',
  'METH': 'Breaking Bad.',
  'LSD': 'Trip.',
  'DMT': 'Joe Rogan.',
  'MUSHROOMS': 'Funghetti.',
  'HIGH': 'Elevated.',
  'STONED': 'Lapidato.',
  'BAKED': 'Cotto.',
}

// Layout tastiera QWERTY
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

export default function UndertaleNameEntry({
  onComplete,
  onBack,
  title = 'Scegli un nome.',
  maxLength = 20
}: UndertaleNameEntryProps) {
  const [name, setName] = useState('')
  const [selectedRow, setSelectedRow] = useState(0)
  const [selectedCol, setSelectedCol] = useState(0)

  // Calcola la riga corrente (include riga speciale per SPAZIO/CANC/FATTO)
  const totalRows = KEYBOARD_ROWS.length + 1 // +1 per riga azioni

  // Commento di Samantha basato sul nome corrente
  const samanthaComment = useMemo(() => {
    const trimmedName = name.trim()
    // Prima controlla le bestemmie
    if (containsBlasphemy(trimmedName)) {
      return 'Inaccettabile.'
    }
    const upperName = trimmedName.toUpperCase()
    return NAME_COMMENTS[upperName] || null
  }, [name])

  // Gestione tasti fisici
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toUpperCase()

    // Navigazione con frecce
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedRow(r => Math.max(0, r - 1))
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedRow(r => Math.min(totalRows - 1, r + 1))
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setSelectedCol(c => Math.max(0, c - 1))
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      const maxCol = selectedRow < KEYBOARD_ROWS.length
        ? KEYBOARD_ROWS[selectedRow].length - 1
        : 1 // 2 pulsanti nell'ultima riga (← e ↵)
      setSelectedCol(c => Math.min(maxCol, c + 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleConfirm()
    } else if (e.key === 'Backspace') {
      e.preventDefault()
      handleBackspace()
    } else if (/^[A-Z]$/.test(key) && name.length < maxLength) {
      // Digitazione diretta da tastiera fisica
      addLetter(key)
    }
  }, [selectedRow, selectedCol, name, maxLength])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Aggiungi lettera
  const addLetter = (letter: string) => {
    if (name.length < maxLength) {
      setName(name + letter)
    }
  }

  // Backspace
  const handleBackspace = () => {
    setName(n => n.slice(0, -1))
  }

  // Conferma nome
  const handleConfirm = () => {
    const trimmedName = name.trim()
    if (trimmedName.length > 0) {
      // Controllo per bestemmie - blocca silenziosamente
      if (containsBlasphemy(trimmedName)) {
        return
      }
      // Controllo per nomi speciali - cancella silenziosamente
      const upperName = trimmedName.toUpperCase()
      if (SPECIAL_NAMES[upperName] === 'gaster') {
        setName('')
        return
      }
      onComplete(trimmedName)
    }
  }

  // Gestione selezione con click/enter
  const handleSelect = () => {
    if (selectedRow < KEYBOARD_ROWS.length) {
      // Riga lettere
      const row = KEYBOARD_ROWS[selectedRow]
      if (selectedCol < row.length) {
        addLetter(row[selectedCol])
      }
    } else {
      // Riga azioni
      if (selectedCol === 0) handleBackspace()
      else if (selectedCol === 1) handleConfirm()
    }
  }

  // Click su lettera
  const handleLetterClick = (letter: string, rowIdx: number, colIdx: number) => {
    setSelectedRow(rowIdx)
    setSelectedCol(colIdx)
    addLetter(letter)
  }

  // Click su azione
  const handleActionClick = (action: 'back' | 'done', colIdx: number) => {
    setSelectedRow(KEYBOARD_ROWS.length)
    setSelectedCol(colIdx)
    if (action === 'back') handleBackspace()
    else if (action === 'done') handleConfirm()
  }

  // Simboli azioni: backspace e conferma
  const ACTION_SYMBOLS = ['←', '↵']

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
      {/* Commento di Samantha */}
      <div className="absolute top-8 left-0 right-0 flex justify-center">
        <div className="min-h-[40px] px-6">
          {samanthaComment && (
            <p className="font-mono text-white/70 text-sm md:text-base animate-pulse">
              {samanthaComment}
            </p>
          )}
        </div>
      </div>

      {/* Nome inserito */}
      <div className="mb-12 w-full max-w-md">
        <div className="px-6 py-4 min-h-[60px] flex items-center justify-center">
          <span className="text-3xl md:text-4xl font-mono tracking-wider text-white">
            {name || <span className="text-white/30">_</span>}
            <span className="animate-pulse">|</span>
          </span>
        </div>
      </div>

      {/* Tastiera */}
      <div className="space-y-4">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-3 md:gap-4">
            {row.map((letter, colIdx) => {
              const isSelected = selectedRow === rowIdx && selectedCol === colIdx
              return (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter, rowIdx, colIdx)}
                  className={`
                    w-8 h-10 md:w-10 md:h-12
                    font-mono text-lg md:text-xl
                    transition-all duration-100
                    ${isSelected
                      ? 'text-white scale-125'
                      : 'text-white/50 hover:text-white'
                    }
                  `}
                >
                  {letter}
                </button>
              )
            })}
          </div>
        ))}

        {/* Riga azioni: ← e ↵ */}
        <div className="flex justify-center gap-12 mt-6">
          {ACTION_SYMBOLS.map((symbol, colIdx) => {
            const isSelected = selectedRow === KEYBOARD_ROWS.length && selectedCol === colIdx
            const actionType = colIdx === 0 ? 'back' : 'done'
            return (
              <button
                key={symbol}
                onClick={() => handleActionClick(actionType, colIdx)}
                className={`
                  text-2xl md:text-3xl
                  transition-all duration-100
                  ${isSelected
                    ? 'text-white scale-125'
                    : colIdx === 1 && name.trim().length > 0
                      ? 'text-yellow-400 hover:text-yellow-300'
                      : 'text-white/50 hover:text-white'
                  }
                `}
              >
                {symbol}
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}
