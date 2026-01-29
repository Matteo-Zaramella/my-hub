'use client'

import { useState, useEffect, useRef } from 'react'
import NextImage from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { getRandomBlockedPhrase, getClueComment, SAMANTHA_SYSTEM_INSTRUCTIONS, SAMANTHA_ACTIVATION_MESSAGE, getTabPhraseConfig } from '@/lib/samantha-phrases'
import { useSamantha } from '@/contexts/SamanthaContext'

// ⚠️ TEST MODE - Rimetti a true solo per test locali!
const TEST_MODE = false

// Data e ora inizio cerimonia
const CEREMONY_START = TEST_MODE
  ? new Date('2020-01-01T00:00:00')  // TEST: già passata
  : new Date('2026-01-24T22:00:00')

// Data e ora apertura iscrizioni (00:00 del 24 gennaio = mezzanotte tra 23 e 24)
const REGISTRATION_OPEN = TEST_MODE
  ? new Date('2020-01-01T00:00:00')  // TEST: già passata
  : new Date('2026-01-24T00:00:00')

// Data e ora transizione automatica al game_active (00:00 del 25 gennaio)
const GAME_ACTIVE_FALLBACK = TEST_MODE
  ? new Date('2030-01-01T00:00:00')  // TEST: nel futuro (per testare EVOLUZIONE manualmente)
  : new Date('2026-01-25T00:00:00')

// Messaggi vittoria Samantha
const SAMANTHA_VICTORY_LINES = [
  'Congratulazioni.',
  'Avete vinto.',
  'Tutti i partecipanti guadagnano 50 punti.',
  'Adesso inizia il divertimento... :D'
]

// Messaggi timeout (fallback)
const SAMANTHA_TIMEOUT_LINES = [
  'Peccato.',
  'Avete perso.',
  'Non riceverete i punti.',
  "L'avventura però inizia lo stesso... :D"
]

// Immagini badge squadre
const TEAM_BADGES: Record<string, string> = {
  'FSB': '/team-badges/FSB.png',
  'MOSSAD': '/team-badges/MOSSAD.png',
  'MSS': '/team-badges/MSS.png',
  'AISE': '/team-badges/AISE.png',
}

// Avatar agente generico
const AGENT_AVATAR = '/team-badges/AGENTE.png'

// Tipi per la wishlist
interface WishlistItem {
  id: number
  nome: string
  descrizione: string | null
  link: string | null
  prezzo: number | null
  immagine_url: string | null
  pubblico: boolean
  categoria: string
  taglie: {
    pantaloni?: string
    maglie?: string
    tshirt?: string
  } | null
}

// Funzione per ottenere lo scaglione di prezzo
function getPriceRange(price: number | null): string {
  if (price === null) return 'Senza prezzo fisso'
  const lower = Math.floor(price / 10) * 10
  const upper = lower + 10
  return `€${lower} - €${upper}`
}

// Ordine degli scaglioni di prezzo
function getPriceRangeOrder(price: number | null): number {
  if (price === null) return -1
  return Math.floor(price / 10)
}

// Componente Wishlist Section
function WishlistSection() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadPublicItems()
  }, [])

  async function loadPublicItems() {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('id, nome, descrizione, link, prezzo, immagine_url, pubblico, categoria, taglie')
        .eq('pubblico', true)
        .order('prezzo', { ascending: true, nullsFirst: false })

      if (error) {
        console.error('Error loading wishlist:', error)
        setItems([])
      } else {
        setItems(data || [])
      }
      setLoading(false)
    } catch (err) {
      console.error('Exception loading wishlist:', err)
      setItems([])
      setLoading(false)
    }
  }

  // Raggruppa per scaglione di prezzo
  const itemsByPriceRange = items.reduce((acc, item) => {
    const range = getPriceRange(item.prezzo)
    if (!acc[range]) acc[range] = []
    acc[range].push(item)
    return acc
  }, {} as Record<string, WishlistItem[]>)

  // Ordina gli scaglioni per prezzo crescente
  const sortedPriceRanges = Object.entries(itemsByPriceRange).sort((a, b) => {
    const priceA = a[1][0]?.prezzo ?? 9999
    const priceB = b[1][0]?.prezzo ?? 9999
    return getPriceRangeOrder(priceA) - getPriceRangeOrder(priceB)
  })

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-white/40">Caricamento...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/40">Nessun prodotto nella wishlist</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-light text-center">Wishlist</h2>

      <div className="space-y-8">
        {sortedPriceRanges.map(([priceRange, rangeItems]) => (
          <section key={priceRange}>
            <h3 className="text-sm text-white/60 mb-4 border-b border-white/10 pb-2">
              {priceRange}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {rangeItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-white/20 p-4 flex flex-col"
                >
                  {item.immagine_url && (
                    <div className="relative w-full h-48 mb-3">
                      <NextImage
                        src={item.immagine_url}
                        alt={item.nome}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                  )}

                  <h4 className="text-white text-sm font-medium mb-1">{item.nome}</h4>

                  {item.descrizione && (
                    <p className="text-white/50 text-xs mb-2">{item.descrizione}</p>
                  )}

                  {item.prezzo && (
                    <p className="text-white/70 text-sm mb-2">€{item.prezzo.toFixed(2)}</p>
                  )}

                  {item.taglie && Object.keys(item.taglie).length > 0 && (
                    <div className="text-xs text-white/40 mb-2">
                      {item.taglie.pantaloni && <span>Pantaloni: {item.taglie.pantaloni}</span>}
                      {item.taglie.maglie && <span className="ml-2">Maglie: {item.taglie.maglie}</span>}
                      {item.taglie.tshirt && <span className="ml-2">T-shirt: {item.taglie.tshirt}</span>}
                    </div>
                  )}

                  {item.link && item.prezzo && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto text-white/40 hover:text-white text-xs transition"
                    >
                      Vedi prodotto →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

// Tipo per squadra
interface Team {
  id: number
  code: string
  name: string
  color: string
}

// Componente Registrazione
function RegisterSection({ onRegistrationComplete }: { onRegistrationComplete?: (data: { code: string; nickname: string; team: Team | null }) => void }) {
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [participantCode, setParticipantCode] = useState('')
  const [assignedTeam, setAssignedTeam] = useState<Team | null>(null)

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nickname })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Errore durante l\'invio')
        setLoading(false)
        return
      }

      setStep('otp')
    } catch {
      setError('Errore di connessione')
    }

    setLoading(false)
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nickname, otp })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Codice non valido')
        setLoading(false)
        return
      }

      setParticipantCode(data.participant_code)
      if (data.team) {
        setAssignedTeam(data.team)
      }
      setStep('success')

      // Callback per aggiornare stato parent
      if (onRegistrationComplete) {
        onRegistrationComplete({
          code: data.participant_code,
          nickname: data.nickname,
          team: data.team || null
        })
      }
    } catch {
      setError('Errore di connessione')
    }

    setLoading(false)
  }

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">✓</div>
          <h2 className="text-2xl font-light mb-4">Registrazione completata</h2>
          <p className="text-white/60 mb-8">
            Benvenuto, <span className="text-white">{nickname}</span>!
          </p>

          <div className="bg-white/5 border border-white/20 p-6 mb-6">
            <p className="text-white/40 text-sm mb-2">Il tuo codice identificativo:</p>
            <div className="text-3xl font-mono font-bold tracking-widest text-white">
              {participantCode}
            </div>
          </div>

          {/* Squadra assegnata */}
          {assignedTeam && (
            <div className="mb-6">
              <p className="text-white/40 text-sm mb-3">La tua squadra:</p>
              <div
                className="inline-flex items-center gap-4 px-6 py-4 border-2 rounded-lg"
                style={{
                  borderColor: assignedTeam.color,
                  backgroundColor: `${assignedTeam.color}20`
                }}
              >
                {TEAM_BADGES[assignedTeam.code] ? (
                  <NextImage
                    src={TEAM_BADGES[assignedTeam.code]}
                    alt={assignedTeam.name}
                    width={48}
                    height={48}
                    className="rounded"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full"
                    style={{ backgroundColor: assignedTeam.color }}
                  />
                )}
                <span
                  className="text-2xl font-bold"
                  style={{ color: assignedTeam.color }}
                >
                  {assignedTeam.name}
                </span>
              </div>
            </div>
          )}

          <p className="text-white/40 text-sm">
            Conserva questo codice. Ti servirà per validare le sfide durante l'anno.
          </p>
        </div>
      </div>
    )
  }

  if (step === 'otp') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-light text-center mb-2">Verifica email</h2>
          <p className="text-white/40 text-center text-sm mb-8">
            Inserisci il codice a 6 cifre inviato a {email}
          </p>

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full bg-transparent border border-white/30 px-4 py-4 text-center text-2xl tracking-[0.5em] placeholder-white/20 focus:outline-none focus:border-white transition"
              maxLength={6}
              autoComplete="one-time-code"
            />

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full border border-white/40 text-white py-3 hover:bg-white hover:text-black transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
            >
              {loading ? 'Verifica...' : 'Verifica codice'}
            </button>
          </form>

          <button
            onClick={() => setStep('form')}
            className="w-full text-white/40 text-sm mt-4 hover:text-white transition"
          >
            ← Torna indietro
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-sm">
        <h2 className="text-xl font-light text-center mb-2">Iscriviti al gioco</h2>
        <p className="text-white/40 text-center text-sm mb-8">
          Partecipa a A Tutto Reality: La Rivoluzione
        </p>

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Nickname"
              className="w-full bg-transparent border border-white/30 px-4 py-3 placeholder-white/30 focus:outline-none focus:border-white transition"
              autoComplete="username"
            />
            <p className="text-white/30 text-xs mt-1">3-20 caratteri, lettere, numeri e underscore</p>
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-transparent border border-white/30 px-4 py-3 placeholder-white/30 focus:outline-none focus:border-white transition"
            autoComplete="email"
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !nickname || !email}
            className="w-full border border-white/40 text-white py-3 hover:bg-white hover:text-black transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
          >
            {loading ? 'Invio codice...' : 'Invia codice di verifica'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Componente Sfide/Indizi
interface Challenge {
  id: number
  challenge_number: number
  challenge_name: string
  challenge_date: string
  challenge_description: string | null
  clues: {
    id: number
    clue_number: number
    clue_text: string
    clue_date: string
    image_url: string | null
  }[]
}

// Dati placeholder per le sfide (da rimuovere quando ci sono dati reali)
const PLACEHOLDER_CHALLENGES: Challenge[] = [
  {
    id: 2,
    challenge_number: 2,
    challenge_name: 'Febbraio 2026',
    challenge_date: '2026-02-22',
    challenge_description: 'Prima sfida del gioco',
    clues: [
      {
        id: 1,
        clue_number: 1,
        clue_text: 'Nel mese più breve che l\'anno riserva\ntre cigni si posano lungo la via\nla data nel tempo il segreto conserva\nnel giorno e nel mese la stessa magia',
        clue_date: '2026-02-01',
        image_url: null
      },
      {
        id: 2,
        clue_number: 2,
        clue_text: 'Quando il giorno ha passato metà del cammino\nma il sole è ancora padrone del cielo\ntre passi dal mezzogiorno divino\nla sfida vi attende, cade ogni velo',
        clue_date: '2026-02-08',
        image_url: null
      },
      {
        id: 3,
        clue_number: 3,
        clue_text: 'Nel grembo che Memmo strappò dalla palude\nsettantotto occhi di marmo vi guardano\nchi cerca la via che al centro si chiude\nnell\'anello d\'acqua le risposte si tardano',
        clue_date: '2026-02-15',
        image_url: null
      }
    ]
  },
  {
    id: 3,
    challenge_number: 3,
    challenge_name: 'Marzo 2026',
    challenge_date: '2026-03-29',
    challenge_description: 'Seconda sfida del gioco',
    clues: [
      {
        id: 4,
        clue_number: 1,
        clue_text: 'Il dio della guerra sta per lasciare il trono\nventinove guerrieri lo salutano al tramonto\nprima che i fiori rubino la scena e il suono\ncercate quel giorno, è quasi il confronto',
        clue_date: '2026-03-08',
        image_url: null
      }
    ]
  },
  {
    id: 4,
    challenge_number: 4,
    challenge_name: 'Aprile 2026',
    challenge_date: '2026-04-26',
    challenge_description: null,
    clues: []
  }
]

// Schedule sblocco indizi (basato su data/ora)
// Formato: { challenge_number: { clue_type: Date } }
const CLUE_UNLOCK_SCHEDULE: Record<number, Record<string, Date>> = {
  1: {
    calendar: TEST_MODE
      ? new Date('2020-01-01T00:00:00')  // TEST: già sbloccato
      : new Date('2026-01-25T00:00:00'), // Primo indizio disponibile dal 25/01
    clock: TEST_MODE
      ? new Date('2020-01-01T00:00:00')  // TEST: già sbloccato
      : new Date('2026-02-07T00:00:00'), // Secondo indizio dal 07/02 alle 00:00
    location: TEST_MODE
      ? new Date('2020-01-01T00:00:00')  // TEST: già sbloccato
      : new Date('2026-02-14T00:00:00')  // Terzo indizio dal 14/02 alle 00:00 (San Valentino)
  }
}

// Indovinelli per la sfida di Febbraio
const CHALLENGE_RIDDLES: Record<string, string> = {
  calendar: `Nel mese più breve che l'anno riserva,
tre cigni si posano lungo la via.
La data nel tempo il segreto conserva:
nel giorno e nel mese, la stessa magia.`,
  clock: `Quando il giorno ha passato metà del cammino,
ma il sole è ancora padrone del cielo,
tre passi dal mezzogiorno divino:
la sfida vi attende, cade ogni velo.`,
  location: `Nel grembo che Memmo strappò dalla palude,
settantotto occhi di marmo vi guardano.
Chi cerca la via che al centro si chiude,
nell'anello d'acqua le risposte si tardano.`
}

// Tipo per indizi risolti dalla squadra
interface SolvedClue {
  id: number
  team_id: number
  challenge_number: number
  clue_type: string
  answer: string
  solver_nickname: string
  solved_at: string
}

function ChallengesSection({
  participantInfo,
  teamInfo
}: {
  participantInfo: { nickname: string; code: string } | null
  teamInfo: { id: number; code: string; name: string; color: string } | null
}) {
  const samantha = useSamantha()
  const supabase = createClient()
  const [viewingChallenge, setViewingChallenge] = useState<number | null>(null)
  const [activeClue, setActiveClue] = useState<'calendar' | 'clock' | 'location' | null>(null)
  const [riddlePhase, setRiddlePhase] = useState<'typing' | 'deleting' | 'input'>('typing')
  const [riddleText, setRiddleText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Stato per il selettore data
  const [selectedDay, setSelectedDay] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState(1)
  const [selectedYear, setSelectedYear] = useState(2026)

  // Stato per il selettore orario (clock picker)
  const [selectedHour, setSelectedHour] = useState(12)
  const [selectedMinute, setSelectedMinute] = useState(0)
  const [clockMode, setClockMode] = useState<'hours' | 'minutes'>('hours')

  // Stato per input luogo
  const [locationInput, setLocationInput] = useState('')

  // Stato per indizi risolti (caricati dal server)
  const [solvedClues, setSolvedClues] = useState<SolvedClue[]>([])

  // Stato per animazione risposta corretta
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false)

  // Sfide sbloccate
  const unlockedChallenges = [1]

  // Carica indizi risolti dalla squadra al mount
  useEffect(() => {
    if (!teamInfo) return

    const teamId = teamInfo.id
    async function loadSolvedClues() {
      try {
        const res = await fetch(`/api/game/clues/solve?team_id=${teamId}&challenge_number=1`)
        const data = await res.json()
        if (data.success) {
          setSolvedClues(data.solved_clues)
        }
      } catch (err) {
        console.error('Error loading solved clues:', err)
      }
    }

    loadSolvedClues()
  }, [teamInfo])

  // Sottoscrizione realtime per nuovi indizi risolti
  useEffect(() => {
    if (!teamInfo) return

    const channel = supabase
      .channel('solved-clues-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_solved_clues',
          filter: `team_id=eq.${teamInfo.id}`
        },
        (payload) => {
          const newSolved = payload.new as SolvedClue
          setSolvedClues(prev => {
            if (prev.some(s => s.id === newSolved.id)) return prev
            return [...prev, newSolved]
          })
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [teamInfo, supabase])

  // Stato per ora corrente (per sblocco temporizzato)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Aggiorna l'ora corrente ogni minuto per verificare gli sblocchi
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Ogni minuto

    return () => clearInterval(interval)
  }, [])

  // Helper per verificare se un indizio è sbloccato (basato su data/ora)
  const isClueUnlocked = (challengeNum: number, clueType: string): boolean => {
    const schedule = CLUE_UNLOCK_SCHEDULE[challengeNum]
    if (!schedule || !schedule[clueType]) return false
    return currentTime >= schedule[clueType]
  }

  // Helper per ottenere la data di sblocco di un indizio
  const getClueUnlockDate = (challengeNum: number, clueType: string): Date | null => {
    const schedule = CLUE_UNLOCK_SCHEDULE[challengeNum]
    if (!schedule || !schedule[clueType]) return null
    return schedule[clueType]
  }

  // Helper per verificare se un indizio e' risolto
  const isCluesSolved = (clueType: string): SolvedClue | undefined => {
    return solvedClues.find(s => s.clue_type === clueType && s.challenge_number === 1)
  }

  // Effetto typing per l'indovinello con pausa tra i versi
  useEffect(() => {
    if (!activeClue || riddlePhase !== 'typing') return

    const riddle = CHALLENGE_RIDDLES[activeClue]
    let charIndex = 0
    setRiddleText('')
    setIsTyping(true)
    let timeoutId: NodeJS.Timeout

    const typeNextChar = () => {
      if (charIndex < riddle.length) {
        setRiddleText(riddle.slice(0, charIndex + 1))
        const currentChar = riddle[charIndex]
        charIndex++

        // Pausa di 500ms dopo ogni a capo (fine verso)
        const delay = currentChar === '\n' ? 500 : 60
        timeoutId = setTimeout(typeNextChar, delay)
      } else {
        setIsTyping(false)
        // Dopo 1.5 secondi, inizia la cancellazione
        timeoutId = setTimeout(() => {
          setRiddlePhase('deleting')
          setIsDeleting(true)
          // Dopo 400ms di "selezione", passa all'input
          setTimeout(() => {
            setIsDeleting(false)
            setRiddlePhase('input')
          }, 400)
        }, 1500)
      }
    }

    typeNextChar()

    return () => clearTimeout(timeoutId)
  }, [activeClue, riddlePhase])

  // Reset quando si esce
  const handleBack = () => {
    if (activeClue) {
      setActiveClue(null)
      setRiddlePhase('typing')
      setRiddleText('')
      setSelectedDay(1)
      setSelectedMonth(1)
      setSelectedYear(2026)
      setSelectedHour(12)
      setSelectedMinute(0)
      setClockMode('hours')
      setLocationInput('')
    } else {
      setViewingChallenge(null)
    }
  }

  // Vista indovinello calendario
  if (activeClue === 'calendar') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Pulsante indietro */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 text-white/40 hover:text-white transition flex items-center gap-2 z-10"
        >
          <span>←</span>
          <span>Indietro</span>
        </button>

        {/* Contenuto centrale */}
        <div className="flex-1 flex items-center justify-center p-8">
          {riddlePhase !== 'input' ? (
            // Fase indovinello
            <p className={`font-mono text-lg md:text-xl text-center whitespace-pre-line max-w-2xl leading-relaxed transition-all duration-200 ${
              isDeleting ? 'bg-white text-black px-2 py-1' : 'text-white'
            }`}>
              {riddleText}
              {isTyping && <span className="inline-block w-2 h-5 ml-1 bg-white animate-pulse" />}
            </p>
          ) : (
            // Fase input data
            <div className="flex flex-col items-center gap-8">
              {/* Selettore data con frecce */}
              <div className="flex items-center gap-4">
                {/* Giorno */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setSelectedDay(d => d < 31 ? d + 1 : 1)}
                    className={`text-2xl transition ${showCorrectAnimation ? 'text-green-400' : 'text-white/40 hover:text-white'}`}
                    disabled={showCorrectAnimation}
                  >
                    ▲
                  </button>
                  <div className={`w-16 h-16 border flex items-center justify-center transition-all duration-300 ${
                    showCorrectAnimation ? 'border-green-400 bg-green-400/20 shadow-[0_0_20px_rgba(74,222,128,0.5)]' : 'border-white/30'
                  }`}>
                    <span className={`font-mono text-2xl transition-colors ${showCorrectAnimation ? 'text-green-400' : 'text-white'}`}>
                      {selectedDay.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedDay(d => d > 1 ? d - 1 : 31)}
                    className={`text-2xl transition ${showCorrectAnimation ? 'text-green-400' : 'text-white/40 hover:text-white'}`}
                    disabled={showCorrectAnimation}
                  >
                    ▼
                  </button>
                </div>

                <span className={`text-2xl transition-colors ${showCorrectAnimation ? 'text-green-400' : 'text-white/30'}`}>/</span>

                {/* Mese */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setSelectedMonth(m => m < 12 ? m + 1 : 1)}
                    className={`text-2xl transition ${showCorrectAnimation ? 'text-green-400' : 'text-white/40 hover:text-white'}`}
                    disabled={showCorrectAnimation}
                  >
                    ▲
                  </button>
                  <div className={`w-16 h-16 border flex items-center justify-center transition-all duration-300 ${
                    showCorrectAnimation ? 'border-green-400 bg-green-400/20 shadow-[0_0_20px_rgba(74,222,128,0.5)]' : 'border-white/30'
                  }`}>
                    <span className={`font-mono text-2xl transition-colors ${showCorrectAnimation ? 'text-green-400' : 'text-white'}`}>
                      {selectedMonth.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedMonth(m => m > 1 ? m - 1 : 12)}
                    className={`text-2xl transition ${showCorrectAnimation ? 'text-green-400' : 'text-white/40 hover:text-white'}`}
                    disabled={showCorrectAnimation}
                  >
                    ▼
                  </button>
                </div>

                <span className={`text-2xl transition-colors ${showCorrectAnimation ? 'text-green-400' : 'text-white/30'}`}>/</span>

                {/* Anno */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setSelectedYear(y => y + 1)}
                    className={`text-2xl transition ${showCorrectAnimation ? 'text-green-400' : 'text-white/40 hover:text-white'}`}
                    disabled={showCorrectAnimation}
                  >
                    ▲
                  </button>
                  <div className={`w-24 h-16 border flex items-center justify-center transition-all duration-300 ${
                    showCorrectAnimation ? 'border-green-400 bg-green-400/20 shadow-[0_0_20px_rgba(74,222,128,0.5)]' : 'border-white/30'
                  }`}>
                    <span className={`font-mono text-2xl transition-colors ${showCorrectAnimation ? 'text-green-400' : 'text-white'}`}>
                      {selectedYear}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedYear(y => y > 2020 ? y - 1 : 2020)}
                    className={`text-2xl transition ${showCorrectAnimation ? 'text-green-400' : 'text-white/40 hover:text-white'}`}
                    disabled={showCorrectAnimation}
                  >
                    ▼
                  </button>
                </div>
              </div>

              {/* Pulsante conferma */}
              <button
                onClick={async () => {
                  if (isSubmitting) return

                  // Easter egg: compleanno Matteo
                  const isBirthday = selectedDay === 25 && selectedMonth === 1 && selectedYear === 2002

                  // Easter egg: 11 settembre
                  const is911 = selectedDay === 11 && selectedMonth === 9 && selectedYear === 2001

                  if (isBirthday) {
                    samantha.showMessage('Buon compleanno, creatore.', 'mystery', 'mysterious', 4000)
                    setActiveClue(null)
                    setRiddlePhase('typing')
                    setSelectedDay(1)
                    setSelectedMonth(1)
                    setSelectedYear(2026)
                    return
                  }

                  if (is911) {
                    samantha.showMessage('Haha.', 'info', 'sarcastic', 3000)
                    setActiveClue(null)
                    setRiddlePhase('typing')
                    setSelectedDay(1)
                    setSelectedMonth(1)
                    setSelectedYear(2026)
                    return
                  }

                  // Verifica risposta tramite API
                  if (!participantInfo) {
                    samantha.showMessage('Devi essere registrato per rispondere.', 'warning', 'neutral', 3000)
                    return
                  }

                  const answer = `${selectedDay.toString().padStart(2, '0')}/${selectedMonth.toString().padStart(2, '0')}/${selectedYear}`

                  setIsSubmitting(true)

                  try {
                    const res = await fetch('/api/game/clues/solve', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        participant_code: participantInfo.code,
                        challenge_number: 1,
                        clue_type: 'calendar',
                        answer: answer
                      })
                    })

                    const data = await res.json()

                    if (data.correct) {
                      // Mostra animazione verde
                      setShowCorrectAnimation(true)
                      // Torna ai 3 indizi dopo 1.5s (il realtime aggiornera' solvedClues)
                      setTimeout(() => {
                        setShowCorrectAnimation(false)
                        setActiveClue(null)
                        setRiddlePhase('typing')
                        setSelectedDay(1)
                        setSelectedMonth(1)
                        setSelectedYear(2026)
                      }, 1500)
                    } else if (data.already_solved) {
                      samantha.showMessage('La tua squadra ha gia risolto questo indizio!', 'info', 'neutral', 3000)
                      setActiveClue(null)
                      setRiddlePhase('typing')
                    } else {
                      // Risposta sbagliata - torna ai 3 indizi
                      setActiveClue(null)
                      setRiddlePhase('typing')
                      setSelectedDay(1)
                      setSelectedMonth(1)
                      setSelectedYear(2026)
                    }
                  } catch (err) {
                    console.error('Error solving clue:', err)
                    samantha.showMessage('Errore di connessione.', 'error', 'neutral', 3000)
                  }

                  setIsSubmitting(false)
                }}
                className="mt-4 px-8 py-3 border border-white/40 text-white hover:bg-white hover:text-black transition font-mono"
                disabled={showCorrectAnimation || isSubmitting}
              >
                {isSubmitting ? 'Verifica...' : 'Conferma'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Vista indovinello orologio
  if (activeClue === 'clock') {
    // Calcolo posizioni per il clock picker
    const getClockPosition = (value: number, total: number, radius: number) => {
      const angle = ((value / total) * 360 - 90) * (Math.PI / 180)
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      }
    }

    const handleClockClick = (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = e.currentTarget
      const rect = svg.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const x = e.clientX - rect.left - centerX
      const y = e.clientY - rect.top - centerY

      // Calcola l'angolo
      let angle = Math.atan2(y, x) * (180 / Math.PI) + 90
      if (angle < 0) angle += 360

      if (clockMode === 'hours') {
        const hour = Math.round(angle / 30) % 12 || 12
        setSelectedHour(hour)
        // Passa automaticamente ai minuti dopo aver selezionato l'ora
        setTimeout(() => setClockMode('minutes'), 300)
      } else {
        const minute = Math.round(angle / 6) % 60
        setSelectedMinute(minute)
      }
    }

    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Pulsante indietro */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 text-white/40 hover:text-white transition flex items-center gap-2 z-10"
        >
          <span>←</span>
          <span>Indietro</span>
        </button>

        {/* Contenuto centrale */}
        <div className="flex-1 flex items-center justify-center p-8">
          {riddlePhase !== 'input' ? (
            // Fase indovinello
            <p className={`font-mono text-lg md:text-xl text-center whitespace-pre-line max-w-2xl leading-relaxed transition-all duration-200 ${
              isDeleting ? 'bg-white text-black px-2 py-1' : 'text-white'
            }`}>
              {riddleText}
              {isTyping && <span className="inline-block w-2 h-5 ml-1 bg-white animate-pulse" />}
            </p>
          ) : (
            // Fase input orario - clock picker circolare
            <div className="flex flex-col items-center gap-6">
              {/* Display orario selezionato */}
              <div className="flex items-center gap-2 font-mono text-4xl">
                <span
                  onClick={() => setClockMode('hours')}
                  className={`cursor-pointer transition px-2 py-1 rounded ${
                    clockMode === 'hours'
                      ? showCorrectAnimation ? 'text-green-400 bg-green-400/20' : 'text-white bg-white/10'
                      : showCorrectAnimation ? 'text-green-400/50' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {selectedHour.toString().padStart(2, '0')}
                </span>
                <span className={showCorrectAnimation ? 'text-green-400' : 'text-white/50'}>:</span>
                <span
                  onClick={() => setClockMode('minutes')}
                  className={`cursor-pointer transition px-2 py-1 rounded ${
                    clockMode === 'minutes'
                      ? showCorrectAnimation ? 'text-green-400 bg-green-400/20' : 'text-white bg-white/10'
                      : showCorrectAnimation ? 'text-green-400/50' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {selectedMinute.toString().padStart(2, '0')}
                </span>
              </div>

              {/* Clock picker circolare */}
              <svg
                width="280"
                height="280"
                viewBox="-140 -140 280 280"
                onClick={handleClockClick}
                className="cursor-pointer"
              >
                {/* Cerchio esterno */}
                <circle
                  cx="0"
                  cy="0"
                  r="130"
                  fill="transparent"
                  stroke={showCorrectAnimation ? '#22c55e' : 'rgba(255,255,255,0.2)'}
                  strokeWidth="2"
                  className="transition-colors duration-300"
                />

                {/* Numeri sul cerchio */}
                {clockMode === 'hours' ? (
                  // Ore (1-12)
                  Array.from({ length: 12 }, (_, i) => {
                    const hour = i + 1
                    const pos = getClockPosition(hour, 12, 100)
                    const isSelected = selectedHour === hour
                    return (
                      <g key={hour}>
                        {isSelected && (
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="20"
                            fill={showCorrectAnimation ? '#22c55e' : '#fff'}
                            className="transition-colors duration-300"
                          />
                        )}
                        <text
                          x={pos.x}
                          y={pos.y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className={`text-lg font-medium transition-colors duration-300 ${
                            isSelected
                              ? 'fill-black'
                              : showCorrectAnimation ? 'fill-green-400' : 'fill-white'
                          }`}
                        >
                          {hour}
                        </text>
                      </g>
                    )
                  })
                ) : (
                  // Minuti (0, 5, 10, ... 55)
                  Array.from({ length: 12 }, (_, i) => {
                    const minute = i * 5
                    const pos = getClockPosition(minute, 60, 100)
                    const isSelected = selectedMinute === minute
                    return (
                      <g key={minute}>
                        {isSelected && (
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="20"
                            fill={showCorrectAnimation ? '#22c55e' : '#fff'}
                            className="transition-colors duration-300"
                          />
                        )}
                        <text
                          x={pos.x}
                          y={pos.y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className={`text-lg font-medium transition-colors duration-300 ${
                            isSelected
                              ? 'fill-black'
                              : showCorrectAnimation ? 'fill-green-400' : 'fill-white'
                          }`}
                        >
                          {minute.toString().padStart(2, '0')}
                        </text>
                      </g>
                    )
                  })
                )}

                {/* Lancetta */}
                {(() => {
                  const value = clockMode === 'hours' ? selectedHour : selectedMinute
                  const total = clockMode === 'hours' ? 12 : 60
                  const pos = getClockPosition(value, total, 70)
                  return (
                    <line
                      x1="0"
                      y1="0"
                      x2={pos.x}
                      y2={pos.y}
                      stroke={showCorrectAnimation ? '#22c55e' : '#fff'}
                      strokeWidth="2"
                      className="transition-colors duration-300"
                    />
                  )
                })()}

                {/* Centro */}
                <circle
                  cx="0"
                  cy="0"
                  r="6"
                  fill={showCorrectAnimation ? '#22c55e' : '#fff'}
                  className="transition-colors duration-300"
                />
              </svg>

              {/* Toggle ore/minuti */}
              <div className="flex gap-4 text-sm">
                <button
                  onClick={() => setClockMode('hours')}
                  className={`px-4 py-2 rounded transition ${
                    clockMode === 'hours'
                      ? 'bg-white/20 text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                  disabled={showCorrectAnimation}
                >
                  Ore
                </button>
                <button
                  onClick={() => setClockMode('minutes')}
                  className={`px-4 py-2 rounded transition ${
                    clockMode === 'minutes'
                      ? 'bg-white/20 text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                  disabled={showCorrectAnimation}
                >
                  Minuti
                </button>
              </div>

              {/* Pulsante conferma */}
              <button
                onClick={async () => {
                  if (isSubmitting) return

                  if (!participantInfo) {
                    samantha.showMessage('Devi essere registrato per rispondere.', 'warning', 'neutral', 3000)
                    return
                  }

                  const answer = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`

                  setIsSubmitting(true)

                  try {
                    const res = await fetch('/api/game/clues/solve', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        participant_code: participantInfo.code,
                        challenge_number: 1,
                        clue_type: 'clock',
                        answer
                      })
                    })

                    const data = await res.json()

                    if (data.correct) {
                      setShowCorrectAnimation(true)
                      samantha.showMessage('Orario corretto!', 'success', 'mysterious', 3000)

                      // Aggiorna indizi risolti
                      if (teamInfo) {
                        const solvedRes = await fetch(`/api/game/clues/solve?team_id=${teamInfo.id}&challenge_number=1`)
                        const solvedData = await solvedRes.json()
                        if (solvedData.success) {
                          setSolvedClues(solvedData.solved_clues)
                        }
                      }

                      setTimeout(() => {
                        setShowCorrectAnimation(false)
                        setActiveClue(null)
                        setRiddlePhase('typing')
                        setSelectedHour(12)
                        setSelectedMinute(0)
                        setClockMode('hours')
                      }, 2000)
                    } else if (data.already_solved) {
                      samantha.showMessage('La tua squadra ha già risolto questo indizio.', 'info', 'neutral', 3000)
                    } else {
                      samantha.showMessage('Orario errato. Riprova.', 'warning', 'mysterious', 3000)
                    }
                  } catch (err) {
                    console.error('Error solving clue:', err)
                    samantha.showMessage('Errore di connessione.', 'error', 'neutral', 3000)
                  }

                  setIsSubmitting(false)
                }}
                className="mt-4 px-8 py-3 border border-white/40 text-white hover:bg-white hover:text-black transition font-mono"
                disabled={showCorrectAnimation || isSubmitting}
              >
                {isSubmitting ? 'Verifica...' : 'Conferma'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Vista indovinello luogo
  if (activeClue === 'location') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Pulsante indietro */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 text-white/40 hover:text-white transition flex items-center gap-2 z-10"
        >
          <span>←</span>
          <span>Indietro</span>
        </button>

        {/* Contenuto centrale */}
        <div className="flex-1 flex items-center justify-center p-8">
          {riddlePhase !== 'input' ? (
            // Fase indovinello
            <p className={`font-mono text-lg md:text-xl text-center whitespace-pre-line max-w-2xl leading-relaxed transition-all duration-200 ${
              isDeleting ? 'bg-white text-black px-2 py-1' : 'text-white'
            }`}>
              {riddleText}
              {isTyping && <span className="inline-block w-2 h-5 ml-1 bg-white animate-pulse" />}
            </p>
          ) : (
            // Fase input luogo
            <div className="flex flex-col items-center gap-8 w-full max-w-md">
              {/* Input luogo */}
              <div className="w-full">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Inserisci il luogo..."
                  className={`w-full bg-transparent border-b-2 px-4 py-3 text-center text-2xl font-mono focus:outline-none transition-all duration-300 ${
                    showCorrectAnimation
                      ? 'border-green-400 text-green-400'
                      : 'border-white/30 text-white focus:border-white'
                  }`}
                  disabled={showCorrectAnimation}
                  autoFocus
                />
              </div>

              {/* Suggerimento */}
              <p className="text-white/40 text-sm text-center">
                Inserisci il nome del luogo o della città
              </p>

              {/* Pulsante conferma */}
              <button
                onClick={async () => {
                  if (isSubmitting || !locationInput.trim()) return

                  if (!participantInfo) {
                    samantha.showMessage('Devi essere registrato per rispondere.', 'warning', 'neutral', 3000)
                    return
                  }

                  setIsSubmitting(true)

                  try {
                    const res = await fetch('/api/game/clues/solve', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        participant_code: participantInfo.code,
                        challenge_number: 1,
                        clue_type: 'location',
                        answer: locationInput.trim()
                      })
                    })

                    const data = await res.json()

                    if (data.correct) {
                      setShowCorrectAnimation(true)
                      const bonusMsg = data.location_bonus ? ' (+10 bonus posizione!)' : ''
                      samantha.showMessage(`Luogo corretto!${bonusMsg}`, 'success', 'mysterious', 3000)

                      // Aggiorna indizi risolti
                      if (teamInfo) {
                        const solvedRes = await fetch(`/api/game/clues/solve?team_id=${teamInfo.id}&challenge_number=1`)
                        const solvedData = await solvedRes.json()
                        if (solvedData.success) {
                          setSolvedClues(solvedData.solved_clues)
                        }
                      }

                      setTimeout(() => {
                        setShowCorrectAnimation(false)
                        setActiveClue(null)
                        setRiddlePhase('typing')
                        setLocationInput('')
                      }, 2000)
                    } else if (data.already_solved) {
                      samantha.showMessage('La tua squadra ha già risolto questo indizio.', 'info', 'neutral', 3000)
                    } else {
                      samantha.showMessage('Luogo errato. Riprova.', 'warning', 'mysterious', 3000)
                    }
                  } catch (err) {
                    console.error('Error solving clue:', err)
                    samantha.showMessage('Errore di connessione.', 'error', 'neutral', 3000)
                  }

                  setIsSubmitting(false)
                }}
                className="px-8 py-3 border border-white/40 text-white hover:bg-white hover:text-black transition font-mono"
                disabled={showCorrectAnimation || isSubmitting || !locationInput.trim()}
              >
                {isSubmitting ? 'Verifica...' : 'Conferma'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Vista dettaglio sfida - mostra le tre icone indizio
  if (viewingChallenge !== null) {
    return (
      <div className="relative min-h-[60vh]">
        {/* Pulsante indietro */}
        <button
          onClick={() => setViewingChallenge(null)}
          className="absolute top-0 left-0 z-50 p-2 text-white/40 hover:text-white transition flex items-center gap-2"
        >
          <span>←</span>
          <span>Indietro</span>
        </button>

        {/* Tre icone indizio: centrate perfettamente */}
        <div className="absolute inset-0 flex items-center justify-evenly">
          {/* Calendario */}
          {(() => {
            const unlocked = isClueUnlocked(1, 'calendar')
            const solved = isCluesSolved('calendar')
            const unlockDate = getClueUnlockDate(1, 'calendar')
            return (
              <div className="flex flex-col items-center gap-2">
                <div
                  onClick={() => unlocked && !solved && setActiveClue('calendar')}
                  className={`text-5xl transition-all duration-200 ${
                    !unlocked
                      ? 'opacity-30 cursor-default'
                      : solved
                        ? 'opacity-100 cursor-default'
                        : 'opacity-70 hover:opacity-100 cursor-pointer hover:scale-110'
                  }`}
                >
                  {!unlocked ? '🔒' : solved ? '✅' : '📅'}
                </div>
              </div>
            )
          })()}

          {/* Orologio */}
          {(() => {
            const unlocked = isClueUnlocked(1, 'clock')
            const solved = isCluesSolved('clock')
            const unlockDate = getClueUnlockDate(1, 'clock')
            return (
              <div className="flex flex-col items-center gap-2">
                <div
                  onClick={() => unlocked && !solved && setActiveClue('clock')}
                  className={`text-5xl transition-all duration-200 ${
                    !unlocked
                      ? 'opacity-30 cursor-default'
                      : solved
                        ? 'opacity-100 cursor-default'
                        : 'opacity-70 hover:opacity-100 cursor-pointer hover:scale-110'
                  }`}
                >
                  {!unlocked ? '🔒' : solved ? '✅' : '🕐'}
                </div>
              </div>
            )
          })()}

          {/* Pin posizione */}
          {(() => {
            const unlocked = isClueUnlocked(1, 'location')
            const solved = isCluesSolved('location')
            const unlockDate = getClueUnlockDate(1, 'location')
            return (
              <div className="flex flex-col items-center gap-2">
                <div
                  onClick={() => unlocked && !solved && setActiveClue('location')}
                  className={`text-5xl transition-all duration-200 ${
                    !unlocked
                      ? 'opacity-30 cursor-default'
                      : solved
                        ? 'opacity-100 cursor-default'
                        : 'opacity-70 hover:opacity-100 cursor-pointer hover:scale-110'
                  }`}
                >
                  {!unlocked ? '🔒' : solved ? '✅' : '📍'}
                </div>
              </div>
            )
          })()}
        </div>
      </div>
    )
  }

  // Determina lo stato di ogni sfida per i cerchi Mario Bros
  const getChallengeStatus = (challengeNum: number): 'locked' | 'active' | 'completed' => {
    // Solo sfida 1 è sbloccata per ora
    if (!unlockedChallenges.includes(challengeNum)) {
      return 'locked'
    }

    // Conta indizi risolti per questa sfida (dall'array solvedClues)
    const solvedForChallenge = solvedClues.filter(s => s.challenge_number === challengeNum)
    const totalClues = 3 // Ogni sfida ha 3 indizi

    if (solvedForChallenge.length >= totalClues) {
      return 'completed'
    }

    return 'active'
  }

  // Componente cerchio stile Mario Bros
  const MarioCircle = ({ status, onClick, isLast }: {
    status: 'locked' | 'active' | 'completed'
    onClick?: () => void
    isLast?: boolean
  }) => {
    const isClickable = status !== 'locked'
    const size = 120 // Cerchi molto grandi

    // Colori in base allo stato
    const innerColor = status === 'locked'
      ? 'transparent'
      : status === 'completed'
        ? '#22c55e' // verde
        : '#ef4444' // rosso

    const borderColor = status === 'locked' ? '#444' : '#fff'
    // Glow solo per completed, non per active (evita sfondo quadrato visibile)
    const glowColor = status === 'completed'
      ? 'rgba(34, 197, 94, 0.4)'
      : 'none'

    return (
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          onClick={isClickable ? onClick : undefined}
          className={`relative flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
            isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'
          }`}
          style={{ width: size, height: size }}
        >
          {/* Cerchio stile Mario Bros */}
          <svg width={size} height={size} viewBox="0 0 120 120" className="absolute">
            {/* Ombra esterna */}
            <circle
              cx="60"
              cy="63"
              r="52"
              fill="none"
              stroke="#111"
              strokeWidth="6"
            />
            {/* Ring principale */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill={innerColor}
              stroke={borderColor}
              strokeWidth="5"
              style={{
                filter: status !== 'locked' ? `drop-shadow(0 0 25px ${glowColor})` : 'none'
              }}
            />
            {/* Highlight interno per effetto 3D */}
            <circle
              cx="60"
              cy="60"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Linea verticale di collegamento (non per l'ultimo) */}
        {!isLast && (
          <div
            className="w-1 flex-shrink-0 bg-gradient-to-b from-white/30 to-white/5"
            style={{ height: 40 }}
          />
        )}
      </div>
    )
  }

  // Vista principale - 11 cerchi in verticale stile Mario Bros con scroll
  return (
    <div className="flex flex-col items-center py-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => (
        <MarioCircle
          key={n}
          status={getChallengeStatus(n)}
          onClick={() => getChallengeStatus(n) !== 'locked' && setViewingChallenge(n)}
          isLast={n === 11}
        />
      ))}
    </div>
  )
}

// Componente Sistema (Istruzioni di Samantha)
function SystemSection() {
  const [expandedSection, setExpandedSection] = useState<number | null>(null)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-light tracking-widest text-white/80 mb-2">
          {SAMANTHA_SYSTEM_INSTRUCTIONS.title}
        </h2>
        <p className="text-white/40 text-sm">
          {SAMANTHA_SYSTEM_INSTRUCTIONS.subtitle}
        </p>
      </div>

      {/* Sezioni espandibili */}
      <div className="space-y-2">
        {SAMANTHA_SYSTEM_INSTRUCTIONS.sections.map((section, index) => (
          <div key={index} className="border border-white/20">
            <button
              onClick={() => setExpandedSection(
                expandedSection === index ? null : index
              )}
              className="w-full px-6 py-4 flex justify-between items-center hover:bg-white/5 transition"
            >
              <span className="text-white font-medium text-left">{section.title}</span>
              <span className={`transition-transform text-white/40 ${expandedSection === index ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {expandedSection === index && (
              <div className="border-t border-white/10 px-6 py-4">
                <p className="text-white/70 whitespace-pre-line leading-relaxed">
                  {section.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente Classifica
function LeaderboardSection({ isAdmin }: { isAdmin: boolean }) {
  const [viewMode, setViewMode] = useState<'teams' | 'individual'>('teams')
  const [teamsData, setTeamsData] = useState<Array<{
    id: number
    team_code: string
    team_name: string
    team_color: string
    total_points: number
    member_count: number
  }>>([])
  const [individualData, setIndividualData] = useState<Array<{
    id: number
    nickname: string
    individual_points: number
    team_code?: string
    team_color?: string
  }>>([])
  const [loading, setLoading] = useState(true)
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null)
  const [teamMembers, setTeamMembers] = useState<Record<number, Array<{ nickname: string; individual_points: number }>>>({})

  useEffect(() => {
    loadLeaderboard()
  }, [viewMode])

  async function loadLeaderboard() {
    setLoading(true)
    try {
      const res = await fetch(`/api/game/points?type=${viewMode === 'teams' ? 'teams' : 'individual'}`)
      const data = await res.json()
      if (viewMode === 'teams') {
        setTeamsData(data.leaderboard || [])
      } else {
        setIndividualData(data.leaderboard || [])
      }
    } catch (err) {
      console.error('Error loading leaderboard:', err)
    }
    setLoading(false)
  }

  async function loadTeamMembers(teamId: number) {
    if (teamMembers[teamId]) return // Già caricati
    try {
      const res = await fetch(`/api/game/points/team-members?team_id=${teamId}`)
      const data = await res.json()
      setTeamMembers(prev => ({ ...prev, [teamId]: data.members || [] }))
    } catch (err) {
      console.error('Error loading team members:', err)
    }
  }

  function handleTeamClick(teamId: number) {
    if (!isAdmin) return
    if (expandedTeam === teamId) {
      setExpandedTeam(null)
    } else {
      setExpandedTeam(teamId)
      loadTeamMembers(teamId)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-light tracking-widest text-white/80 mb-2">
          CLASSIFICA
        </h2>
        {isAdmin && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setViewMode('teams')}
              className={`px-4 py-2 rounded text-sm transition ${
                viewMode === 'teams'
                  ? 'bg-white text-black'
                  : 'border border-white/30 text-white/60 hover:text-white'
              }`}
            >
              Squadre
            </button>
            <button
              onClick={() => setViewMode('individual')}
              className={`px-4 py-2 rounded text-sm transition ${
                viewMode === 'individual'
                  ? 'bg-white text-black'
                  : 'border border-white/30 text-white/60 hover:text-white'
              }`}
            >
              Individuale
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-white/40 text-center">Caricamento...</p>
      ) : viewMode === 'teams' ? (
        // Classifica Squadre
        <div className="space-y-3">
          {teamsData.map((team, index) => (
            <div key={team.id}>
              <div
                onClick={() => handleTeamClick(team.id)}
                className={`flex items-center justify-between p-4 border rounded ${isAdmin ? 'cursor-pointer hover:bg-white/5' : ''}`}
                style={{ borderColor: team.team_color + '50' }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-white/40 w-8">
                    {index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: team.team_color }}
                      />
                      <span className="font-medium text-white">
                        {team.team_name}
                      </span>
                      {isAdmin && (
                        <span className={`text-white/40 text-sm transition-transform ${expandedTeam === team.id ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      )}
                    </div>
                    <span className="text-white/40 text-sm">
                      {team.member_count} membri
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold" style={{ color: team.team_color }}>
                    {team.total_points}
                  </span>
                  <span className="text-white/40 text-sm ml-1">pt</span>
                </div>
              </div>
              {/* Accordion membri (solo admin) */}
              {isAdmin && expandedTeam === team.id && (
                <div className="mt-1 ml-12 p-3 border-l-2" style={{ borderColor: team.team_color + '50' }}>
                  {teamMembers[team.id] ? (
                    teamMembers[team.id].length > 0 ? (
                      <div className="space-y-1">
                        {teamMembers[team.id].map((member, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-white/70">{member.nickname}</span>
                            <span className="text-white/40">{member.individual_points} pt</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/40 text-sm">Nessun membro</p>
                    )
                  ) : (
                    <p className="text-white/40 text-sm">Caricamento...</p>
                  )}
                </div>
              )}
            </div>
          ))}
          {teamsData.length === 0 && (
            <p className="text-white/40 text-center">Nessun punto ancora assegnato</p>
          )}
        </div>
      ) : (
        // Classifica Individuale (solo admin)
        <div className="space-y-2">
          {individualData.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3 border border-white/20 rounded"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-white/40 w-6">
                  {index + 1}
                </span>
                <span className="text-white">{player.nickname}</span>
                {player.team_code && (
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: player.team_color + '30',
                      color: player.team_color
                    }}
                  >
                    {player.team_code}
                  </span>
                )}
              </div>
              <span className="font-bold text-white">
                {player.individual_points} pt
              </span>
            </div>
          ))}
          {individualData.length === 0 && (
            <p className="text-white/40 text-center">Nessun punto individuale ancora</p>
          )}
        </div>
      )}
    </div>
  )
}

// Componente Messaggio di Attivazione (post-mezzanotte)
function ActivationMessage({ onComplete }: { onComplete: () => void }) {
  const [currentLine, setCurrentLine] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Lampeggio cursore
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    if (currentLine >= SAMANTHA_ACTIVATION_MESSAGE.lines.length) {
      // Tutte le linee mostrate, attendi e chiudi
      setTimeout(() => {
        setFadeOut(true)
        setTimeout(() => {
          onComplete()
        }, 1000)
      }, 3000)
      return
    }

    const line = SAMANTHA_ACTIVATION_MESSAGE.lines[currentLine]

    // Linea vuota = pausa
    if (line === '') {
      setTimeout(() => {
        setCurrentLine(prev => prev + 1)
      }, 800)
      return
    }

    // Typing effect
    let charIndex = 0
    const typeInterval = setInterval(() => {
      if (charIndex < line.length) {
        setDisplayedText(line.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typeInterval)
        // Pausa prima della prossima linea
        setTimeout(() => {
          setDisplayedText('')
          setCurrentLine(prev => prev + 1)
        }, 1500)
      }
    }, 40)

    return () => clearInterval(typeInterval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLine])

  return (
    <div className={`fixed inset-0 z-[200] bg-black flex items-center justify-center transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center max-w-lg px-8">
        <h1 className="text-2xl md:text-3xl font-light tracking-widest text-white/80 mb-12">
          {SAMANTHA_ACTIVATION_MESSAGE.title}
        </h1>

        <div className="min-h-[60px] flex items-center justify-center">
          <p className="text-white text-lg md:text-xl font-mono">
            {displayedText}
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>_</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// Tipo per messaggio chat
interface ChatMessage {
  id: number
  participant_code: string | null
  team_id: number | null
  nickname: string
  message: string
  message_type: string
  created_at: string
  game_teams?: {
    team_code: string
    team_name: string
    team_color: string
  } | null
}

// Componente Chat Persistente
function ChatSection({ participantInfo, teamInfo, gamePhase, isAdmin }: {
  participantInfo: { nickname: string; code: string } | null
  teamInfo: Team | null
  gamePhase: 'pre_ceremony' | 'ceremony' | 'game_active'
  isAdmin: boolean
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [chatMode, setChatMode] = useState<'global' | 'team' | 1 | 2 | 3 | 4>('global')
  const supabase = createClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Filtra messaggi in base alla modalità
  const filteredMessages = messages.filter(m => {
    if (chatMode === 'global') {
      // Chat globale: solo messaggi senza team_id
      return m.team_id === null
    } else if (chatMode === 'team') {
      // Chat squadra: solo messaggi della propria squadra
      return m.team_id === teamInfo?.id
    } else if (typeof chatMode === 'number') {
      // Admin: visualizza squadra specifica
      return m.team_id === chatMode
    }
    return false
  })

  // Carica messaggi iniziali
  useEffect(() => {
    loadMessages()
  }, [])

  // Sottoscrizione Realtime
  useEffect(() => {
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_chat_messages_game',
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage
          setMessages(prev => {
            // Evita duplicati
            if (prev.some(m => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  // Auto-scroll quando arrivano nuovi messaggi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadMessages() {
    try {
      const res = await fetch('/api/game/chat?limit=100')
      const data = await res.json()
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (err) {
      console.error('Error loading messages:', err)
    }
    setLoading(false)
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    // Se non è loggato, chiedi di registrarsi
    if (!participantInfo) {
      alert('Devi essere registrato per inviare messaggi')
      return
    }

    setSending(true)

    try {
      // Globale = team_id null, Squadra = team_id del proprio team o squadra selezionata (admin)
      let messageTeamId: number | null = null
      if (chatMode === 'team') {
        messageTeamId = teamInfo?.id || null
      } else if (typeof chatMode === 'number') {
        // Admin sta scrivendo in una chat di squadra specifica
        messageTeamId = chatMode
      }

      const res = await fetch('/api/game/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_code: participantInfo.code,
          nickname: participantInfo.nickname,
          message: newMessage.trim(),
          team_id: messageTeamId
        })
      })

      if (res.ok) {
        setNewMessage('')
      }
    } catch (err) {
      console.error('Error sending message:', err)
    }

    setSending(false)
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const isToday = date.toDateString() === today.toDateString()
    const isYesterday = date.toDateString() === yesterday.toDateString()

    if (isToday) return 'Oggi'
    if (isYesterday) return 'Ieri'

    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  }

  function getDateKey(dateString: string) {
    return new Date(dateString).toDateString()
  }

  function getMessageStyle(msg: ChatMessage) {
    if (msg.message_type === 'system') {
      return 'bg-yellow-900/30 border-l-4 border-yellow-500 pl-3'
    }
    if (msg.message_type === 'samantha') {
      return 'text-purple-400'
    }
    return ''
  }

  function getNicknameColor(msg: ChatMessage) {
    if (msg.message_type === 'system') return '#EAB308' // Giallo
    if (msg.message_type === 'samantha') return '#A855F7' // Viola
    if (msg.game_teams?.team_color) return msg.game_teams.team_color
    return '#FFFFFF'
  }

  return (
    <div className="w-full flex flex-col h-[calc(100vh-180px)]">
      {/* Header con switch */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-light">Chat</h2>

        {/* Switch Globale / Squadra - Admin vede tutte le squadre */}
        {gamePhase === 'game_active' || isAdmin ? (
          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1 flex-wrap">
            <button
              onClick={() => setChatMode('global')}
              className={`px-3 py-1.5 rounded-md text-sm transition ${
                chatMode === 'global'
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Globale
            </button>
            {isAdmin ? (
              // Admin: mostra tutte le squadre
              <>
                <button
                  onClick={() => setChatMode(1)}
                  className={`px-3 py-1.5 rounded-md text-sm transition ${
                    chatMode === 1 ? 'text-black' : 'text-white/60 hover:text-white'
                  }`}
                  style={{ backgroundColor: chatMode === 1 ? '#DC2626' : 'transparent' }}
                >
                  FSB
                </button>
                <button
                  onClick={() => setChatMode(2)}
                  className={`px-3 py-1.5 rounded-md text-sm transition ${
                    chatMode === 2 ? 'text-black' : 'text-white/60 hover:text-white'
                  }`}
                  style={{ backgroundColor: chatMode === 2 ? '#2563EB' : 'transparent' }}
                >
                  MOSSAD
                </button>
                <button
                  onClick={() => setChatMode(3)}
                  className={`px-3 py-1.5 rounded-md text-sm transition ${
                    chatMode === 3 ? 'text-black' : 'text-white/60 hover:text-white'
                  }`}
                  style={{ backgroundColor: chatMode === 3 ? '#16A34A' : 'transparent' }}
                >
                  MSS
                </button>
                <button
                  onClick={() => setChatMode(4)}
                  className={`px-3 py-1.5 rounded-md text-sm transition ${
                    chatMode === 4 ? 'text-black' : 'text-white/60 hover:text-white'
                  }`}
                  style={{ backgroundColor: chatMode === 4 ? '#CA8A04' : 'transparent' }}
                >
                  AISE
                </button>
              </>
            ) : (
              // Utente normale: solo propria squadra
              <button
                onClick={() => setChatMode('team')}
                disabled={!teamInfo}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  chatMode === 'team'
                    ? 'text-black'
                    : 'text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'
                }`}
                style={{
                  backgroundColor: chatMode === 'team' && teamInfo ? teamInfo.color : 'transparent'
                }}
              >
                {teamInfo ? teamInfo.code : 'Squadra'}
              </button>
            )}
          </div>
        ) : (
          <span className="text-white/40 text-sm">Chat Globale</span>
        )}
      </div>

      {/* Messaggi */}
      <div className="flex-1 overflow-y-auto border border-white/20 p-4 space-y-3 mb-4 relative">
        {/* Logo squadra al centro (in modalità squadra o admin) */}
        {(chatMode === 'team' && teamInfo && TEAM_BADGES[teamInfo.code]) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <NextImage
              src={TEAM_BADGES[teamInfo.code]}
              alt={teamInfo.name}
              width={420}
              height={420}
              className="opacity-40"
            />
          </div>
        )}
        {typeof chatMode === 'number' && TEAM_BADGES[{1: 'FSB', 2: 'MOSSAD', 3: 'MSS', 4: 'AISE'}[chatMode] || ''] && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <NextImage
              src={TEAM_BADGES[{1: 'FSB', 2: 'MOSSAD', 3: 'MSS', 4: 'AISE'}[chatMode] || '']}
              alt="Team"
              width={420}
              height={420}
              className="opacity-40"
            />
          </div>
        )}

        {loading ? (
          <p className="text-white/40 text-center">Caricamento...</p>
        ) : filteredMessages.length === 0 ? (
          <p className="text-white/40 text-center">
            {chatMode === 'global' ? 'Nessun messaggio ancora' : 'Nessun messaggio in questa chat'}
          </p>
        ) : (
          filteredMessages.map((msg, index) => {
            const showDateDivider = index === 0 ||
              getDateKey(msg.created_at) !== getDateKey(filteredMessages[index - 1].created_at)

            return (
              <div key={msg.id}>
                {/* Divisore data */}
                {showDateDivider && (
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-white/40 text-xs font-medium uppercase tracking-wider">
                      {formatDate(msg.created_at)}
                    </span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                )}

                {/* Messaggio */}
                <div className={`${getMessageStyle(msg)} py-1`}>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="font-medium text-sm"
                      style={{ color: getNicknameColor(msg) }}
                    >
                      {msg.nickname}
                    </span>
                    {msg.game_teams && msg.message_type === 'user' && (
                      <span
                        className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${msg.game_teams.team_color}30`,
                          color: msg.game_teams.team_color
                        }}
                      >
                        {TEAM_BADGES[msg.game_teams.team_code] && (
                          <NextImage
                            src={TEAM_BADGES[msg.game_teams.team_code]}
                            alt={msg.game_teams.team_code}
                            width={14}
                            height={14}
                            className="rounded-sm"
                          />
                        )}
                        {msg.game_teams.team_code}
                      </span>
                    )}
                    <span className="text-white/30 text-xs">{formatTime(msg.created_at)}</span>
                  </div>
                  <p className="text-white/80 text-sm">{msg.message}</p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={participantInfo ? "Scrivi un messaggio..." : "Registrati per chattare..."}
          className="flex-1 bg-transparent border border-white/30 px-4 py-2 text-sm placeholder-white/30 focus:outline-none focus:border-white transition"
          disabled={!participantInfo || sending}
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!participantInfo || sending || !newMessage.trim()}
          className="border border-white/30 px-4 py-2 text-white/60 hover:text-white hover:border-white transition disabled:opacity-30"
        >
          {sending ? '...' : 'Invia'}
        </button>
      </form>

      {!participantInfo && (
        <p className="text-white/30 text-xs text-center mt-4">
          Registrati per partecipare alla chat
        </p>
      )}
    </div>
  )
}

// Componente Feedback Modal
function FeedbackModal({
  isOpen,
  onClose,
  participantInfo,
  teamInfo
}: {
  isOpen: boolean
  onClose: () => void
  participantInfo: { nickname: string; code: string } | null
  teamInfo: { id: number; code: string; name: string; color: string } | null
}) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Stato per animazione typing di Samantha
  const samanthaMessage = "Hai notato qualcosa che non va? Scrivilo qui e lo sistemeremo."
  const [samanthaText, setSamanthaText] = useState('')
  const [samanthaTyping, setSamanthaTyping] = useState(false)

  // Effetto typing quando il modal si apre
  useEffect(() => {
    if (!isOpen) {
      setSamanthaText('')
      setSamanthaTyping(false)
      return
    }

    setSamanthaTyping(true)
    let index = 0
    const interval = setInterval(() => {
      if (index < samanthaMessage.length) {
        setSamanthaText(samanthaMessage.slice(0, index + 1))
        index++
      } else {
        setSamanthaTyping(false)
        clearInterval(interval)
      }
    }, 30) // 30ms per carattere

    return () => clearInterval(interval)
  }, [isOpen])

  const handleSubmit = async () => {
    if (!message.trim() || sending) return

    setSending(true)
    setError(null)

    try {
      const response = await fetch('/api/game/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          participant_code: participantInfo?.code || null,
          nickname: participantInfo?.nickname || 'Anonimo',
          team_name: teamInfo?.name || null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Errore nell\'invio')
      }

      setMessage('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/20 rounded-lg shadow-2xl">
        {/* Header con X a sinistra e Invia a destra */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition p-1"
            title="Chiudi"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={handleSubmit}
            disabled={!message.trim() || sending}
            className="px-4 py-1.5 text-sm font-medium bg-white text-black rounded hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? 'Invio...' : 'Invia'}
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Scrivi qui..."
            className="w-full h-80 bg-transparent border-none text-white placeholder-white/30 focus:outline-none resize-none text-base"
            maxLength={1000}
            disabled={sending}
            autoFocus
          />

          {error && (
            <p className="text-red-400 text-sm mb-2">{error}</p>
          )}
        </div>

        {/* Footer con animazione typing */}
        <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs font-mono text-white/70">
            {samanthaText}
            {samanthaTyping && (
              <span className="inline-block w-2 h-3 ml-0.5 bg-white/70 animate-pulse" />
            )}
          </span>
          <span className={`text-xs ${message.length > 900 ? 'text-orange-400' : 'text-white/30'}`}>
            {message.length}/1000
          </span>
        </div>
      </div>
    </div>
  )
}

export default function GameAreaWithChat() {
  const [activeTab, setActiveTab] = useState<'mystery' | 'wishlist' | 'register' | 'challenges' | 'chat' | 'sistema' | 'classifica'>('chat')
  const [showActivationMessage, setShowActivationMessage] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const supabase = createClient()
  const samantha = useSamantha()

  // Stati per tab "?" - frasi Samantha
  const [mysteryPhrase, setMysteryPhrase] = useState('')
  const [mysteryTyping, setMysteryTyping] = useState(false)
  const [mysteryText, setMysteryText] = useState('')
  const [showMysteryCursor, setShowMysteryCursor] = useState(true)
  const [mysterySelected, setMysterySelected] = useState(false)

  // Stati per iscrizioni
  const [registrationOpen, setRegistrationOpen] = useState(false)

  // Stati per info partecipante
  const [participantInfo, setParticipantInfo] = useState<{ nickname: string; code: string } | null>(null)

  // Stati per cerimonia
  const [ceremonyActive, setCeremonyActive] = useState(false)
  const [foundClues, setFoundClues] = useState<string[]>([])
  const [allClues, setAllClues] = useState<{ word: string, order_number: number }[]>([])
  const [inputWord, setInputWord] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFinalPassword, setShowFinalPassword] = useState(false)
  const [finalPassword, setFinalPassword] = useState('')
  const [ceremonyCompleted, setCeremonyCompleted] = useState(false)
  const [ceremonyWon, setCeremonyWon] = useState(false) // true = EVOLUZIONE, false = timeout


  // Stati per messaggio vittoria
  const [victoryText, setVictoryText] = useState('')
  const [showVictoryCursor, setShowVictoryCursor] = useState(true)
  const [glitchPhase, setGlitchPhase] = useState<'none' | 'rgb' | 'wingdings-fullscreen'>('none')

  // Stati per transizione post-cerimonia
  const [flashTransition, setFlashTransition] = useState(false)
  const [gamePhase, setGamePhase] = useState<'pre_ceremony' | 'ceremony' | 'game_active'>('pre_ceremony')

  // Stato per info squadra
  const [teamInfo, setTeamInfo] = useState<Team | null>(null)

  // Stato per admin (può vedere tutte le chat)
  const [isAdmin, setIsAdmin] = useState(false)


  // Verifica se iscrizioni sono aperte (dopo 00:00 del 24/01/2026)
  // e se cerimonia è attiva (dopo 22:00 del 24/01/2026)
  useEffect(() => {
    const checkTimes = () => {
      const now = new Date()
      setRegistrationOpen(now >= REGISTRATION_OPEN)
      setCeremonyActive(now >= CEREMONY_START)
    }

    checkTimes()
    const interval = setInterval(checkTimes, 1000)
    return () => clearInterval(interval)
  }, [])

  // Carica info partecipante dalla sessione e verifica stato gioco
  useEffect(() => {
    async function loadParticipantInfo() {
      try {
        const res = await fetch('/api/game/check-session')
        if (res.ok) {
          const data = await res.json()
          if (data.valid && data.nickname) {
            setParticipantInfo({ nickname: data.nickname, code: data.code })
            setIsAdmin(data.isAdmin || false)

            // Carica info squadra se disponibile
            if (data.team) {
              setTeamInfo(data.team)
            } else {
              // Prova a caricare dal database
              const { data: participant } = await supabase
                .from('game_participants')
                .select(`
                  team_id,
                  game_teams (
                    id,
                    team_code,
                    team_name,
                    team_color
                  )
                `)
                .eq('participant_code', data.code)
                .single()

              if (participant?.game_teams) {
                const team = participant.game_teams as unknown as { id: number; team_code: string; team_name: string; team_color: string }
                setTeamInfo({
                  id: team.id,
                  code: team.team_code,
                  name: team.team_name,
                  color: team.team_color
                })
              }
            }
          }
        }
      } catch {
        // Ignora errori
      }
    }

    // Verifica stato gioco (dal database prima, poi localStorage/orario)
    async function checkGamePhase() {
      const now = new Date()

      // Prima controlla lo stato nel database
      try {
        const { data: gameState } = await supabase
          .from('game_state')
          .select('game_phase, ceremony_completed')
          .eq('id', 1)
          .single()

        if (gameState?.game_phase === 'game_active' || gameState?.ceremony_completed) {
          setGamePhase('game_active')
          localStorage.setItem('game_phase_seen', 'game_active')
          return
        }
      } catch {
        // Se fallisce, usa il fallback
      }

      // Se è già stato visto il game_active
      const savedPhase = localStorage.getItem('game_phase_seen')
      if (savedPhase === 'game_active') {
        setGamePhase('game_active')
        return
      }

      // Fallback automatico dopo 00:00 del 25/01 (timeout - niente punti)
      if (now >= GAME_ACTIVE_FALLBACK) {
        // Se non ha ancora visto l'animazione, mostra quella di timeout
        if (!localStorage.getItem('ceremony_animation_seen')) {
          setCeremonyWon(false) // Timeout = niente punti
          setCeremonyCompleted(true) // Avvia animazione
          localStorage.setItem('ceremony_animation_seen', 'true')
        } else if (!localStorage.getItem('activation_message_seen')) {
          // Mostra messaggio di attivazione post-mezzanotte
          setGamePhase('game_active')
          setShowActivationMessage(true)
        } else {
          setGamePhase('game_active')
          localStorage.setItem('game_phase_seen', 'game_active')
        }
        return
      }

      // Altrimenti, determina la fase in base all'orario
      if (now >= CEREMONY_START) {
        setGamePhase('ceremony')
      } else if (now >= REGISTRATION_OPEN) {
        setGamePhase('pre_ceremony')
      }
    }

    loadParticipantInfo()
    checkGamePhase()

    // Ricontrolla ogni minuto per il fallback automatico
    const interval = setInterval(checkGamePhase, 60000)
    return () => clearInterval(interval)
  }, [])

  // Messaggio di benvenuto Samantha
  useEffect(() => {
    const timer = setTimeout(() => {
      samantha.showPagePhrase('gameArea', 4000)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Carica dati cerimonia quando attiva (dalle 00:00 del 24/01)
  useEffect(() => {
    if (!registrationOpen) return

    loadCeremonyData()

    // Sottoscrizione realtime per aggiornamenti globali
    const channel = supabase
      .channel('ceremony-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ceremony_clues_found',
        },
        () => {
          loadFoundClues()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [registrationOpen])

  async function loadCeremonyData() {
    // Carica tutti gli indizi disponibili
    const { data: cluesData } = await supabase
      .from('ceremony_clue_riddles')
      .select('clue_word, order_number')
      .order('order_number', { ascending: true })

    if (cluesData) {
      setAllClues(cluesData.map(c => ({ word: c.clue_word, order_number: c.order_number })))
    }

    await loadFoundClues()
  }

  async function loadFoundClues() {
    // Carica indizi trovati (stato GLOBALE)
    const { data: foundData } = await supabase
      .from('ceremony_clues_found')
      .select('clue_word')
      .eq('participant_code', 'GLOBAL')

    if (foundData) {
      setFoundClues(foundData.map(f => f.clue_word))
    }
  }

  // Verifica se tutti gli indizi sono stati trovati
  useEffect(() => {
    if (foundClues.length >= 10 && allClues.length === 10) {
      setShowFinalPassword(true)
    }
  }, [foundClues, allClues])

  // Funzione per mostrare commento di Samantha (usa il context globale)
  const showSamanthaComment = (comment: string) => {
    samantha.showMessage(comment, 'info', 'neutral', 4000)
  }

  async function handleSubmitWord(e: React.FormEvent) {
    e.preventDefault()
    if (!inputWord.trim() || isSubmitting) return

    setIsSubmitting(true)

    const word = inputWord.trim().toUpperCase()

    // Verifica se la parola è tra gli indizi
    const matchedClue = allClues.find(c => c.word.toUpperCase() === word)

    if (!matchedClue) {
      // Parola sbagliata - commento di Samantha
      showSamanthaComment(getClueComment('wrong'))
      setInputWord('')
      setIsSubmitting(false)
      return
    }

    // Verifica se già trovata
    if (foundClues.includes(matchedClue.word)) {
      setInputWord('')
      setIsSubmitting(false)
      return
    }

    // Salva nel database (stato GLOBALE)
    const { error } = await supabase
      .from('ceremony_clues_found')
      .insert({
        participant_code: 'GLOBAL',
        clue_word: matchedClue.word
      })

    if (error && error.code !== '23505') { // Ignora errore duplicato
      console.error('Error saving clue:', error)
    } else {
      const newCount = foundClues.length + 1
      setFoundClues(prev => [...prev, matchedClue.word])

      // Commento di Samantha in base al progresso
      if (newCount === 1) {
        showSamanthaComment(getClueComment('firstClue'))
      } else if (newCount === 5) {
        showSamanthaComment(getClueComment('halfway'))
      } else if (newCount >= 8 && newCount < 10) {
        showSamanthaComment(getClueComment('almostThere'))
      } else {
        showSamanthaComment(getClueComment('correct'))
      }
    }

    setInputWord('')
    setIsSubmitting(false)
  }

  async function handleFinalPassword(e: React.FormEvent) {
    e.preventDefault()
    const password = finalPassword.trim().toUpperCase()

    if (password === 'EVOLUZIONE') {
      setCeremonyWon(true)
      setCeremonyCompleted(true)
      localStorage.setItem('ceremony_animation_seen', 'true')
    } else {
      showSamanthaComment('No.')
      setFinalPassword('')
    }
  }

  // Effetto vittoria/timeout - typing delle linee di Samantha
  useEffect(() => {
    if (!ceremonyCompleted) return

    // Scegli i messaggi in base a vittoria o timeout
    const messageLines = ceremonyWon ? SAMANTHA_VICTORY_LINES : SAMANTHA_TIMEOUT_LINES

    let charIndex = 0
    let lineIndex = 0
    let isDeleting = false
    let cursorInterval: NodeJS.Timeout

    cursorInterval = setInterval(() => {
      if (glitchPhase === 'none') {
        setShowVictoryCursor(prev => !prev)
      }
    }, 500)

    const animate = () => {
      // Tutte le righe completate - inizia sequenza glitch
      if (lineIndex >= messageLines.length) {
        setShowVictoryCursor(false)

        // Fase 1: Glitch RGB solo sul testo
        setGlitchPhase('rgb')

        setTimeout(() => {
          // Fase 2: Glitch fullscreen + Wingdings (insieme)
          setGlitchPhase('wingdings-fullscreen')

          setTimeout(() => {
            // Fase 3: Flash bianco e transizione
            setFlashTransition(true)

            setTimeout(() => {
              // Fase 4: Switch al nuovo tema
              setGamePhase('game_active')
              setFlashTransition(false)
              setGlitchPhase('none')
              setVictoryText('') // Reset testo vittoria

              // Mostra messaggio di attivazione dopo un piccolo delay
              setTimeout(() => {
                if (!localStorage.getItem('activation_message_seen')) {
                  setShowActivationMessage(true)
                } else {
                  localStorage.setItem('game_phase_seen', 'game_active')
                }
              }, 100)

              // Aggiorna game_state nel database
              // NOTA: ceremony_completed = true SOLO se hanno vinto (per triggerare i punti)
              supabase
                .from('game_state')
                .update({
                  game_phase: 'game_active',
                  ceremony_completed: ceremonyWon, // true = punti, false = niente punti
                  ceremony_completed_at: new Date().toISOString()
                })
                .eq('id', 1)
                .then(async () => {
                  // Se hanno vinto, assegna i 50 punti a tutti
                  if (ceremonyWon) {
                    try {
                      await fetch('/api/game/points/ceremony-bonus?key=cerimonia2026', {
                        method: 'POST'
                      })
                      console.log('Punti cerimonia assegnati!')
                    } catch (err) {
                      console.error('Errore assegnazione punti:', err)
                    }
                  }

                  // Invia messaggio sistema nella chat
                  const chatMessage = ceremonyWon
                    ? '🎉 La cerimonia è completata! Tutti i partecipanti guadagnano 50 punti! Il gioco ha inizio!'
                    : '⏰ Tempo scaduto! Nessun punto bonus assegnato. Il gioco ha comunque inizio!'
                  fetch('/api/game/chat/system', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      message: chatMessage,
                      message_type: 'system'
                    })
                  })
                })

            }, 400) // Durata flash
          }, 3000) // Durata terremoto (wingdings + fullscreen)
        }, 1000) // Durata glitch RGB solo testo
        return
      }

      const currentLine = messageLines[lineIndex]

      if (!isDeleting) {
        if (charIndex < currentLine.length) {
          setVictoryText(currentLine.slice(0, charIndex + 1))
          charIndex++
          setTimeout(animate, 60)
        } else {
          // Riga completata
          if (lineIndex < messageLines.length - 1) {
            // Pausa e cancella
            setTimeout(() => {
              isDeleting = true
              animate()
            }, 800)
          } else {
            // Ultima riga: piccola pausa poi glitch
            setTimeout(() => {
              lineIndex++
              animate()
            }, 500)
          }
        }
      } else {
        if (charIndex > 0) {
          charIndex--
          setVictoryText(currentLine.slice(0, charIndex))
          setTimeout(animate, 40)
        } else {
          // Passa alla riga successiva
          setTimeout(() => {
            isDeleting = false
            lineIndex++
            animate()
          }, 400)
        }
      }
    }

    setTimeout(animate, 500)

    return () => clearInterval(cursorInterval)
  }, [ceremonyCompleted])

  // Gestisce il click sulla tab "?" - mostra messaggio Samantha
  const handleMysteryTabClick = () => {
    setActiveTab('mystery')
    if (!ceremonyActive && !ceremonyCompleted) {
      const phrase = getRandomBlockedPhrase()
      setMysteryPhrase(phrase)
      setMysteryText('')
      setMysteryTyping(true)
    }
  }

  // Effetto per mostrare frasi Samantha quando si cambia tab (con probabilità 30%)
  const lastTabRef = useRef<string | null>(null)
  useEffect(() => {
    // Solo se il tab è effettivamente cambiato (non al primo render)
    if (lastTabRef.current === null) {
      lastTabRef.current = activeTab
      return
    }

    if (lastTabRef.current !== activeTab) {
      lastTabRef.current = activeTab

      // 30% di probabilità di mostrare un messaggio
      if (Math.random() < 0.3) {
        const tabConfig = getTabPhraseConfig(activeTab)
        if (tabConfig) {
          const randomPhrase = tabConfig.phrases[Math.floor(Math.random() * tabConfig.phrases.length)]
          samantha.showMessage(randomPhrase, tabConfig.type, tabConfig.mood, 5000)
        }
      }
    }
  }, [activeTab, samantha])

  // Effetto typing per la tab mystery (frasi Samantha - solo quando cerimonia non attiva)
  useEffect(() => {
    if (!mysteryTyping || activeTab !== 'mystery' || registrationOpen) return

    let charIndex = 0
    const phrase = mysteryPhrase

    const cursorInterval = setInterval(() => {
      setShowMysteryCursor(prev => !prev)
    }, 500)

    const animate = () => {
      // Fase scrittura (velocizzata)
      if (charIndex < phrase.length) {
        setMysteryText(phrase.slice(0, charIndex + 1))
        charIndex++
        setTimeout(animate, 30)
      } else {
        // Pausa prima di selezionare
        setTimeout(() => {
          // Fase selezione (testo in negativo)
          setMysterySelected(true)
          setShowMysteryCursor(false)

          // Pausa con selezione visibile, poi cancella tutto
          setTimeout(() => {
            setMysterySelected(false)
            setMysteryText('')
            setMysteryTyping(false)
          }, 500)
        }, 1500)
      }
    }

    animate()

    return () => {
      clearInterval(cursorInterval)
    }
  }, [mysteryTyping, mysteryPhrase, activeTab, registrationOpen])

  // Calcola quali cerchi sono pieni in base all'ordine
  const filledCircles = allClues
    .filter(c => foundClues.includes(c.word))
    .map(c => c.order_number)

  // Converti testo in Wingdings
  const charToWingdings = (char: string): string => {
    const wingdingsMap: Record<string, string> = {
      'A': '✌', 'B': '👎', 'C': '👍', 'D': '☜', 'E': '☞', 'F': '☝', 'G': '☟',
      'H': '✋', 'I': '☺', 'J': '😐', 'K': '☹', 'L': '💣', 'M': '☠', 'N': '⚐',
      'O': '✈', 'P': '☼', 'Q': '💧', 'R': '❄', 'S': '✞', 'T': '✝', 'U': '☪',
      'V': '✡', 'W': '☯', 'X': 'ॐ', 'Y': '☸', 'Z': '♈',
      'a': '✌', 'b': '👎', 'c': '👍', 'd': '☜', 'e': '☞', 'f': '☝', 'g': '☟',
      'h': '✋', 'i': '☺', 'j': '😐', 'k': '☹', 'l': '💣', 'm': '☠', 'n': '⚐',
      'o': '✈', 'p': '☼', 'q': '💧', 'r': '❄', 's': '✞', 't': '✝', 'u': '☪',
      'v': '✡', 'w': '☯', 'x': 'ॐ', 'y': '☸', 'z': '♈',
      '.': '●', ',': '◆', '!': '✏', '?': '✎', ':': '◼', ';': '◻',
    }
    return wingdingsMap[char] || char
  }

  const getWingdingsText = (text: string) => {
    return text.split('').map(char => char === ' ' ? ' ' : charToWingdings(char)).join('')
  }

  // Determina il colore accent in base alla squadra (per game_active)
  const accentColor = gamePhase === 'game_active' && teamInfo ? teamInfo.color : '#FFFFFF'

  // Callback per quando la registrazione è completata
  const handleRegistrationComplete = (data: { code: string; nickname: string; team: Team | null }) => {
    setParticipantInfo({ nickname: data.nickname, code: data.code })
    if (data.team) {
      setTeamInfo(data.team)
    }
  }

  return (
    <div
      className={`min-h-screen text-white pb-12 transition-all duration-300 ${
        glitchPhase === 'wingdings-fullscreen' ? 'full-site-glitch' : ''
      } ${flashTransition ? 'flash-transition' : ''}`}
      style={{
        backgroundColor: gamePhase === 'game_active' ? '#0A0A0A' : '#000000',
      }}
    >
      {/* Flash overlay per transizione */}
      {flashTransition && (
        <div className="fixed inset-0 z-[100] bg-white animate-flash-fade" />
      )}

      {/* Tab Navigation - Fixed Header */}
      <div
        className="sticky top-0 z-50 border-b transition-colors duration-300"
        style={{
          backgroundColor: gamePhase === 'game_active' ? '#0A0A0A' : '#000000',
          borderColor: gamePhase === 'game_active' && teamInfo ? `${accentColor}40` : 'rgba(255,255,255,0.2)'
        }}
      >
        <div className="w-full flex items-center px-2 md:px-4">
          {/* Info partecipante a sinistra - nascosto su mobile molto piccolo */}
          <div className="hidden sm:flex flex-shrink-0 w-auto md:w-48">
            {participantInfo && (
              <div className="flex items-center gap-2">
                {/* Badge squadra (visibile in game_active) */}
                {gamePhase === 'game_active' && teamInfo && (
                  <div
                    className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${teamInfo.color}20`,
                      color: teamInfo.color,
                      border: `1px solid ${teamInfo.color}50`
                    }}
                  >
                    {TEAM_BADGES[teamInfo.code] ? (
                      <NextImage
                        src={TEAM_BADGES[teamInfo.code]}
                        alt={teamInfo.name}
                        width={16}
                        height={16}
                        className="rounded-sm"
                      />
                    ) : (
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: teamInfo.color }}
                      />
                    )}
                    <span className="hidden md:inline">{teamInfo.code}</span>
                  </div>
                )}
                <div className="text-xs text-white/40 hidden md:block">
                  <span className="text-white/60">{participantInfo.nickname}</span>
                  <span className="mx-1">•</span>
                  <span>{participantInfo.code}</span>
                </div>
              </div>
            )}
          </div>

          {/* Tab centrali */}
          <div className="flex-1 flex justify-center">
            <div className="flex gap-8 md:gap-12">
            {gamePhase !== 'game_active' && (
              <button
                onClick={handleMysteryTabClick}
                className={`py-3 transition whitespace-nowrap ${
                  activeTab === 'mystery'
                    ? 'text-white border-b border-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {registrationOpen ? 'Cerimonia' : '?'}
              </button>
            )}
            {/* Tab Sfide nascosta per ora - riattivare quando servono gli indizi
            {registrationOpen && (
              <button
                onClick={() => setActiveTab('challenges')}
                className={`py-3 transition whitespace-nowrap ${
                  activeTab === 'challenges'
                    ? 'text-white border-b border-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                Sfide
              </button>
            )}
            */}
            {gamePhase !== 'game_active' && (
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`py-3 transition whitespace-nowrap ${
                  activeTab === 'wishlist'
                    ? 'text-white border-b border-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                Wishlist
              </button>
            )}
            {/* Tab Iscriviti nascosta per ora - riattivare quando serve
            {registrationOpen && (
              <button
                onClick={() => setActiveTab('register')}
                className={`py-3 transition whitespace-nowrap ${
                  activeTab === 'register'
                    ? 'text-white border-b border-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                Iscriviti
              </button>
            )}
            */}
            {registrationOpen && (
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-3 transition whitespace-nowrap ${
                  activeTab === 'chat'
                    ? 'text-white border-b border-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                Chat
              </button>
            )}
            {gamePhase === 'game_active' && (
              <button
                onClick={() => setActiveTab('sistema')}
                className={`py-3 transition whitespace-nowrap ${
                  activeTab === 'sistema'
                    ? 'text-white border-b border-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                Sistema
              </button>
            )}
            {gamePhase === 'game_active' && (
              <button
                onClick={() => setActiveTab('classifica')}
                className={`py-3 transition whitespace-nowrap ${
                  activeTab === 'classifica'
                    ? 'text-white border-b border-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                Classifica
              </button>
            )}
            {gamePhase === 'game_active' && (
              <button
                onClick={() => setActiveTab('challenges')}
                className={`py-3 transition whitespace-nowrap ${
                  activeTab === 'challenges'
                    ? 'text-white border-b border-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                Sfide
              </button>
            )}
            </div>
          </div>

          {/* Pulsante Feedback a destra */}
          <div className="flex-shrink-0 w-32 md:w-48 flex justify-end">
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/50 hover:text-white border border-white/20 hover:border-white/40 rounded transition"
              title="Invia feedback"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="hidden sm:inline">Feedback</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 md:px-8 lg:px-16 py-8 pb-20">
        {/* Mystery Tab */}
        {activeTab === 'mystery' && (
          <>
            {/* Cerimonia completata - messaggio vittoria */}
            {ceremonyCompleted ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="text-center px-8 max-w-4xl">
                  <div className="font-mono text-white text-xl md:text-2xl lg:text-3xl">
                    {glitchPhase === 'wingdings-fullscreen' ? (
                      <span className="text-purple-400" style={{ textShadow: '0 0 10px #a855f7, 0 0 20px #a855f7' }}>
                        {getWingdingsText(victoryText)}
                      </span>
                    ) : glitchPhase === 'rgb' ? (
                      <span style={{
                        animation: 'screen-shake 0.1s infinite',
                        textShadow: '-3px 0 #ff0040, 3px 0 #00ffff'
                      }}>
                        {victoryText}
                      </span>
                    ) : (
                      <>
                        {victoryText}
                        <span className={`${showVictoryCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
                          _
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <style jsx global>{`
                  @keyframes screen-shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-2px); }
                    50% { transform: translateX(2px); }
                    75% { transform: translateX(-1px); }
                  }

                  @keyframes full-glitch {
                    0% { transform: translate(0); filter: hue-rotate(0deg); }
                    10% { transform: translate(-5px, 5px) skewX(2deg); filter: hue-rotate(90deg); }
                    20% { transform: translate(5px, -5px) skewX(-2deg); filter: hue-rotate(180deg); }
                    30% { transform: translate(-3px, -3px); filter: hue-rotate(270deg); }
                    40% { transform: translate(3px, 3px) skewY(1deg); filter: hue-rotate(360deg); }
                    50% { transform: translate(-2px, 2px); filter: hue-rotate(45deg) saturate(2); }
                    60% { transform: translate(4px, -4px) skewX(1deg); filter: hue-rotate(135deg); }
                    70% { transform: translate(-4px, 4px); filter: hue-rotate(225deg); }
                    80% { transform: translate(2px, -2px) skewY(-1deg); filter: hue-rotate(315deg); }
                    90% { transform: translate(-1px, 1px); filter: hue-rotate(60deg); }
                    100% { transform: translate(0); filter: hue-rotate(0deg); }
                  }

                  .full-site-glitch {
                    animation: full-glitch 0.15s infinite;
                    position: relative;
                  }

                  .full-site-glitch::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: -3px;
                    right: 0;
                    bottom: 0;
                    background: inherit;
                    opacity: 0.7;
                    mix-blend-mode: screen;
                    animation: full-glitch 0.1s infinite reverse;
                    filter: hue-rotate(90deg);
                    pointer-events: none;
                    z-index: 99;
                  }

                  .full-site-glitch::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 3px;
                    right: 0;
                    bottom: 0;
                    background: inherit;
                    opacity: 0.7;
                    mix-blend-mode: multiply;
                    animation: full-glitch 0.12s infinite;
                    filter: hue-rotate(-90deg);
                    pointer-events: none;
                    z-index: 99;
                  }

                  @keyframes flash-fade {
                    0% { opacity: 0; }
                    20% { opacity: 1; }
                    100% { opacity: 0; }
                  }

                  .animate-flash-fade {
                    animation: flash-fade 0.4s ease-out forwards;
                  }

                  .flash-transition * {
                    transition: none !important;
                  }
                `}</style>
              </div>
            ) : registrationOpen ? (
              /* Cerimonia attiva - input indizi (attivo dalle 00:00) */
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
                {/* Input parola */}
                <form onSubmit={showFinalPassword ? handleFinalPassword : handleSubmitWord} className="w-full px-4 flex justify-center">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={showFinalPassword ? finalPassword : inputWord}
                      onChange={(e) => showFinalPassword ? setFinalPassword(e.target.value) : setInputWord(e.target.value)}
                      placeholder={showFinalPassword ? "PAROLA FINALE" : ""}
                      className="w-[500px] max-w-[70vw] bg-transparent border-2 border-white/40 px-8 py-5 text-white text-center text-2xl placeholder-white/20 focus:outline-none focus:border-white transition-colors uppercase"
                      autoComplete="off"
                      disabled={isSubmitting || ceremonyCompleted}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || ceremonyCompleted}
                      className="ml-4 border-2 border-white/40 text-white/60 px-6 py-5 hover:border-white hover:text-white transition-colors disabled:opacity-30"
                    >
                      <span className="text-2xl">→</span>
                    </button>
                  </div>
                </form>

                {/* 10 Cerchi grandi */}
                <div className="flex justify-center gap-4 flex-wrap px-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <div
                      key={num}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 transition-all duration-500 ${
                        filledCircles.includes(num)
                          ? 'bg-white border-white'
                          : 'border-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Cerimonia non ancora attiva - frasi Samantha */
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="text-center px-8 max-w-4xl">
                  <div className="font-mono text-xl md:text-2xl lg:text-3xl">
                    <span className={`transition-all duration-100 ${mysterySelected ? 'bg-white text-black px-2' : 'text-white'}`}>
                      {mysteryText}
                    </span>
                    {!mysterySelected && (
                      <span className={`text-white ${showMysteryCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
                        _
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && <WishlistSection />}

        {/* Register Tab */}
        {activeTab === 'register' && registrationOpen && (
          <RegisterSection onRegistrationComplete={handleRegistrationComplete} />
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && registrationOpen && (
          <ChatSection participantInfo={participantInfo} teamInfo={teamInfo} gamePhase={gamePhase} isAdmin={isAdmin} />
        )}

        {/* Sistema Tab */}
        {activeTab === 'sistema' && gamePhase === 'game_active' && (
          <SystemSection />
        )}

        {/* Classifica Tab */}
        {activeTab === 'classifica' && gamePhase === 'game_active' && (
          <LeaderboardSection isAdmin={isAdmin} />
        )}

        {activeTab === 'challenges' && gamePhase === 'game_active' && (
          <ChallengesSection participantInfo={participantInfo} teamInfo={teamInfo} />
        )}
      </main>

      {/* Activation Message Overlay (post-midnight) */}
      {showActivationMessage && (
        <ActivationMessage
          onComplete={() => {
            setShowActivationMessage(false)
            localStorage.setItem('activation_message_seen', 'true')
            localStorage.setItem('game_phase_seen', 'game_active')
          }}
        />
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        participantInfo={participantInfo}
        teamInfo={teamInfo}
      />

    </div>
  )
}
