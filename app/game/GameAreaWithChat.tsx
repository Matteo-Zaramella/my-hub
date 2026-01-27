'use client'

import { useState, useEffect, useRef } from 'react'
import NextImage from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { getRandomBlockedPhrase, getClueComment, SAMANTHA_SYSTEM_INSTRUCTIONS, SAMANTHA_ACTIVATION_MESSAGE } from '@/lib/samantha-phrases'
import { useSamantha } from '@/contexts/SamanthaContext'

// ⚠️ TEST MODE - Rimetti le date originali prima del deploy!
const TEST_MODE = true

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

// Indovinelli per gli indizi della prima sfida
const CHALLENGE_RIDDLES = {
  calendar: `Nel mese più breve che l'anno riserva,
tre cigni si posano lungo la via.
La data nel tempo il segreto conserva:
nel giorno e nel mese, la stessa magia.`,
  clock: `Quando il giorno ha passato metà del cammino,
ma il sole è ancora padrone del cielo.
Tre passi dal mezzogiorno divino,
la sfida vi attende, cade ogni velo.`,
  location: `Nel grembo che Memmo strappò dalla palude,
settantotto occhi di marmo vi guardano.
Chi cerca la via che al centro si chiude,
nell'anello d'acqua le risposte si tardano.`
}

// Componente Sfide/Indizi
function ChallengesSection({ participantInfo, teamInfo, isAdmin }: {
  participantInfo: { nickname: string; code: string } | null
  teamInfo: { id: number; code: string; name: string; color: string } | null
  isAdmin: boolean
}) {
  const samantha = useSamantha()
  const [activeClue, setActiveClue] = useState<'calendar' | 'clock' | 'location' | null>(null)
  const [viewingSolvedClue, setViewingSolvedClue] = useState<'calendar' | 'clock' | 'location' | null>(null)
  const [riddleText, setRiddleText] = useState('')
  const [isTypingRiddle, setIsTypingRiddle] = useState(false)
  const [isTextSelected, setIsTextSelected] = useState(false) // Per animazione selezione
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDay, setSelectedDay] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState(1)
  const [selectedYear, setSelectedYear] = useState(2026)
  const [solvedClues, setSolvedClues] = useState<Set<string>>(new Set())

  // Carica indizi risolti dal database (specifici per squadra, o tutti per admin)
  useEffect(() => {
    async function loadSolvedClues() {
      if (!teamInfo && !isAdmin) return

      try {
        const params = new URLSearchParams()
        if (isAdmin) {
          params.set('is_admin', 'true')
        } else if (teamInfo) {
          params.set('team_id', teamInfo.id.toString())
        }

        const res = await fetch(`/api/game/clues?${params}`)
        const data = await res.json()

        if (isAdmin && data.solved) {
          // Admin vede tutti gli indizi risolti (da qualsiasi squadra)
          const allSolved = new Set<string>(data.solved.map((s: { clue_type: string; challenge_number: number }) =>
            `${s.challenge_number}_${s.clue_type}`
          ))
          setSolvedClues(allSolved)
        } else if (data.solved) {
          // Squadra normale vede solo i propri
          setSolvedClues(new Set(data.solved))
        }
      } catch (error) {
        console.error('Errore caricamento indizi risolti:', error)
      }
    }

    loadSolvedClues()
  }, [teamInfo, isAdmin])
  const [showGreenGlow, setShowGreenGlow] = useState(false)
  const [currentVerse, setCurrentVerse] = useState(0)

  // Effetto typing per l'indovinello (verso per verso)
  useEffect(() => {
    if (!isTypingRiddle || !activeClue) return

    const riddle = CHALLENGE_RIDDLES[activeClue]
    const verses = riddle.split('\n')

    let verseIndex = 0
    let charIndex = 0
    let currentText = ''
    let intervalId: NodeJS.Timeout

    const finishTyping = () => {
      setIsTypingRiddle(false)
      // Dopo 1s, mostra animazione selezione (ctrl+a)
      setTimeout(() => {
        setIsTextSelected(true)
        // Dopo 600ms, nascondi testo e mostra date picker
        setTimeout(() => {
          setIsTextSelected(false)
          setRiddleText('')
          setShowDatePicker(true)
        }, 600)
      }, 1000)
    }

    const typeNextChar = () => {
      if (verseIndex >= verses.length) {
        finishTyping()
        return
      }

      const currentVerse = verses[verseIndex]

      if (charIndex < currentVerse.length) {
        currentText += currentVerse[charIndex]
        setRiddleText(currentText)
        charIndex++
        intervalId = setTimeout(typeNextChar, 60)
      } else {
        // Fine del verso, passa al prossimo
        verseIndex++
        setCurrentVerse(verseIndex)
        if (verseIndex < verses.length) {
          currentText += '\n'
          setRiddleText(currentText)
          charIndex = 0
          // Pausa di 800ms tra i versi
          intervalId = setTimeout(typeNextChar, 800)
        } else {
          finishTyping()
        }
      }
    }

    typeNextChar()

    return () => clearTimeout(intervalId)
  }, [isTypingRiddle, activeClue])


  const handleClueClick = (clue: 'calendar' | 'clock' | 'location') => {
    // Se già risolto, non fare nulla (challenge 1)
    if (solvedClues.has(`1_${clue}`)) return

    setActiveClue(clue)
    setRiddleText('')
    setCurrentVerse(0)
    setShowDatePicker(false)
    setShowGreenGlow(false)
    setSelectedDay(1)
    setSelectedMonth(1)
    setSelectedYear(2026)

    // Avvia typing dopo un breve delay
    setTimeout(() => setIsTypingRiddle(true), 300)
  }

  const handleConfirm = async () => {
    // Verifica risposta corretta: 22/02/2026
    if (selectedDay === 22 && selectedMonth === 2 && selectedYear === 2026) {
      // Risposta corretta!
      setShowGreenGlow(true)

      // Numero indizio (1, 2, 3)
      const clueNumber = activeClue === 'calendar' ? 1 : activeClue === 'clock' ? 2 : 3
      const challengeNumber = 1 // Prima sfida

      // Invia messaggi e punti solo se abbiamo le info del partecipante
      if (participantInfo && teamInfo) {
        try {
          // Messaggio chat globale (con nome squadra)
          await fetch('/api/game/chat/system', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `La squadra ${teamInfo.name} ha indovinato l'indizio ${clueNumber} della sfida ${challengeNumber}! Vengono assegnati 10 punti!`,
              message_type: 'samantha',
              team_id: null // Globale
            })
          })

          // Messaggio chat squadra (con nickname)
          await fetch('/api/game/chat/system', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `${participantInfo.nickname} ha indovinato l'indizio ${clueNumber} della sfida ${challengeNumber}! Vengono assegnati 10 punti!`,
              message_type: 'samantha',
              team_id: teamInfo.id
            })
          })

          // Assegna 10 punti al partecipante
          await fetch('/api/game/points?key=cerimonia2026', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              participant_code: participantInfo.code,
              points: 10,
              reason: 'clue_solved',
              description: `Indizio ${clueNumber} sfida ${challengeNumber}`
            })
          })

          // Salva indizio come risolto nel database
          await fetch('/api/game/clues', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              team_id: teamInfo.id,
              clue_type: activeClue,
              challenge_number: challengeNumber,
              solved_by_code: participantInfo.code,
              solved_by_nickname: participantInfo.nickname
            })
          })
        } catch (error) {
          console.error('Errore invio messaggi/punti:', error)
        }
      }

      // Dopo l'animazione verde, segna come risolto e torna ai 3 indizi
      setTimeout(() => {
        setSolvedClues(prev => new Set([...prev, `${1}_${activeClue!}`]))
        setActiveClue(null)
        setShowDatePicker(false)
        setShowGreenGlow(false)
      }, 1500)
    } else {
      // Risposta sbagliata - torna ai 3 indizi
      setActiveClue(null)
      setShowDatePicker(false)
    }
  }

  const handleBack = () => {
    setActiveClue(null)
    setRiddleText('')
    setShowDatePicker(false)
    setIsTypingRiddle(false)
    setShowGreenGlow(false)
  }

  // Funzioni per modificare la data
  const adjustDay = (delta: number) => {
    let newDay = selectedDay + delta
    if (newDay < 1) newDay = 31
    if (newDay > 31) newDay = 1
    setSelectedDay(newDay)
  }

  const adjustMonth = (delta: number) => {
    let newMonth = selectedMonth + delta
    if (newMonth < 1) newMonth = 12
    if (newMonth > 12) newMonth = 1
    setSelectedMonth(newMonth)
  }

  const adjustYear = (delta: number) => {
    setSelectedYear(prev => prev + delta)
  }

  // Controlla data speciale per messaggio Samantha
  useEffect(() => {
    if (selectedDay === 25 && selectedMonth === 1 && selectedYear === 2002) {
      samantha.showMessage('Buon compleanno!', 'success', 'helpful', 3000)
    }
  }, [selectedDay, selectedMonth, selectedYear, samantha])

  // Vista indizio risolto (mostra la soluzione con sfondo verde)
  if (viewingSolvedClue) {
    // Soluzioni per ogni indizio
    const solutions: Record<string, string> = {
      calendar: '22/02/2026',
      clock: '??:??', // TODO: soluzione orologio
      location: '???', // TODO: soluzione posizione
    }
    return (
      <div
        className="absolute inset-0 bg-black flex items-center justify-center px-8 pb-16 z-40 cursor-pointer"
        onClick={() => setViewingSolvedClue(null)}
      >
        <div className="text-center">
          <p className="font-mono text-4xl md:text-5xl bg-green-500 text-white px-8 py-4">
            {solutions[viewingSolvedClue]}
          </p>
        </div>
      </div>
    )
  }

  // Vista indizio attivo (indovinello + date picker)
  if (activeClue) {
    // Schermata indovinello (prima del date picker)
    if (!showDatePicker) {
      return (
        <div className="absolute inset-0 bg-black flex items-center justify-center px-8 pb-16 z-40">
          <div className="text-center max-w-2xl">
            <p className={`font-mono text-lg md:text-xl whitespace-pre-line leading-relaxed transition-all duration-300 ${
              isTextSelected
                ? 'bg-white text-black px-4 py-2'
                : 'text-white/90'
            }`}>
              {riddleText}
              {isTypingRiddle && <span className="animate-pulse">|</span>}
            </p>
          </div>
        </div>
      )
    }

    // Schermata date picker (dopo l'indovinello)
    return (
      <div className="absolute inset-0 bg-black flex items-center justify-center px-4 pb-16 z-40">
        <div className={`flex flex-col items-center gap-8 transition-all duration-500 ${showGreenGlow ? 'green-glow' : ''}`}>
          <div className="flex items-center gap-4">
            {/* Giorno */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => adjustDay(1)}
                className="text-white/40 hover:text-white text-2xl p-2 transition"
                disabled={showGreenGlow}
              >
                ▲
              </button>
              <div
                className={`text-4xl font-mono w-20 text-center py-2 border-b-2 transition-all ${
                  showGreenGlow ? 'border-green-500 bg-green-500 text-white' : 'border-white/30 text-white'
                }`}
              >
                {selectedDay.toString().padStart(2, '0')}
              </div>
              <button
                onClick={() => adjustDay(-1)}
                className="text-white/40 hover:text-white text-2xl p-2 transition"
                disabled={showGreenGlow}
              >
                ▼
              </button>
            </div>

            <span className="text-white/40 text-3xl">/</span>

            {/* Mese */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => adjustMonth(1)}
                className="text-white/40 hover:text-white text-2xl p-2 transition"
                disabled={showGreenGlow}
              >
                ▲
              </button>
              <div
                className={`text-4xl font-mono w-20 text-center py-2 border-b-2 transition-all ${
                  showGreenGlow ? 'border-green-500 bg-green-500 text-white' : 'border-white/30 text-white'
                }`}
              >
                {selectedMonth.toString().padStart(2, '0')}
              </div>
              <button
                onClick={() => adjustMonth(-1)}
                className="text-white/40 hover:text-white text-2xl p-2 transition"
                disabled={showGreenGlow}
              >
                ▼
              </button>
            </div>

            <span className="text-white/40 text-3xl">/</span>

            {/* Anno */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => adjustYear(1)}
                className="text-white/40 hover:text-white text-2xl p-2 transition"
                disabled={showGreenGlow}
              >
                ▲
              </button>
              <div
                className={`text-4xl font-mono w-28 text-center py-2 border-b-2 transition-all ${
                  showGreenGlow ? 'border-green-500 bg-green-500 text-white' : 'border-white/30 text-white'
                }`}
              >
                {selectedYear}
              </div>
              <button
                onClick={() => adjustYear(-1)}
                className="text-white/40 hover:text-white text-2xl p-2 transition"
                disabled={showGreenGlow}
              >
                ▼
              </button>
            </div>
          </div>

          {/* Pulsante Conferma */}
          {!showGreenGlow && (
            <button
              onClick={handleConfirm}
              className="mt-4 border border-white/40 text-white/60 px-8 py-3 hover:border-white hover:text-white transition"
            >
              Conferma
            </button>
          )}

        </div>

        {/* Stile per green glow */}
        <style jsx>{`
          .green-glow {
            animation: greenPulse 0.5s ease-in-out infinite alternate;
          }
          @keyframes greenPulse {
            from {
              filter: drop-shadow(0 0 10px rgba(34, 197, 94, 0.3));
            }
            to {
              filter: drop-shadow(0 0 25px rgba(34, 197, 94, 0.6));
            }
          }
        `}</style>
      </div>
    )
  }

  // Vista principale - 3 emoji indizi (challenge 1)
  const isCalendarSolved = solvedClues.has('1_calendar')
  const isClockSolved = solvedClues.has('1_clock')
  const isLocationSolved = solvedClues.has('1_location')

  return (
    <div className="absolute inset-0 flex items-center justify-evenly px-8 md:px-16 pb-16">
      {/* Calendario */}
      <button
        onClick={() => isCalendarSolved ? setViewingSolvedClue('calendar') : handleClueClick('calendar')}
        className="text-6xl md:text-7xl transition-all duration-300 hover:scale-110 cursor-pointer"
      >
        {isCalendarSolved ? '✅' : '📅'}
      </button>

      {/* Orologio */}
      <button
        onClick={() => isClockSolved ? setViewingSolvedClue('clock') : handleClueClick('clock')}
        className={`text-6xl md:text-7xl transition-all duration-300 ${
          isClockSolved
            ? 'hover:scale-110 cursor-pointer'
            : 'opacity-40 cursor-not-allowed'
        }`}
        disabled={!isClockSolved} // Non ancora attivo se non risolto
      >
        {isClockSolved ? '✅' : '🕐'}
      </button>

      {/* Posizione */}
      <button
        onClick={() => isLocationSolved ? setViewingSolvedClue('location') : handleClueClick('location')}
        className={`text-6xl md:text-7xl transition-all duration-300 ${
          isLocationSolved
            ? 'hover:scale-110 cursor-pointer'
            : 'opacity-40 cursor-not-allowed'
        }`}
        disabled={!isLocationSolved} // Non ancora attivo se non risolto
      >
        {isLocationSolved ? '✅' : '📍'}
      </button>
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
    // Escludi solo messaggi di sistema interni (non samantha)
    if (m.message_type === 'system') return false

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
          filteredMessages.map((msg) => (
            <div key={msg.id} className={`${getMessageStyle(msg)} py-1`}>
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
          ))
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

export default function GameAreaWithChat() {
  const [activeTab, setActiveTab] = useState<'mystery' | 'wishlist' | 'register' | 'challenges' | 'chat' | 'sistema' | 'classifica'>('chat')
  const [showActivationMessage, setShowActivationMessage] = useState(false)
  const supabase = createClient()
  const samantha = useSamantha()

  // Samantha: messaggio di benvenuto all'ingresso
  const [samanthaWelcomeShown, setSamanthaWelcomeShown] = useState(false)
  useEffect(() => {
    if (!samanthaWelcomeShown) {
      const timer = setTimeout(() => {
        samantha.showPagePhrase('gameArea', 5000)
        setSamanthaWelcomeShown(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [samanthaWelcomeShown, samantha])

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

  // Stati per commenti Samantha durante il gioco
  const [samanthaComment, setSamanthaComment] = useState('')
  const [samanthaCommentVisible, setSamanthaCommentVisible] = useState(false)
  const [samanthaCommentText, setSamanthaCommentText] = useState('')
  const [isTypingComment, setIsTypingComment] = useState(false)

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

  // Funzione per mostrare commento di Samantha con typing effect
  const showSamanthaComment = (comment: string) => {
    setSamanthaComment(comment)
    setSamanthaCommentText('')
    setSamanthaCommentVisible(true)
    setIsTypingComment(true)
  }

  // Effetto typing per i commenti
  useEffect(() => {
    if (!isTypingComment || !samanthaComment) return

    let charIndex = 0

    const typeInterval = setInterval(() => {
      if (charIndex < samanthaComment.length) {
        setSamanthaCommentText(samanthaComment.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typeInterval)
        setIsTypingComment(false)
        // Nascondi dopo 3 secondi
        setTimeout(() => {
          setSamanthaCommentVisible(false)
        }, 3000)
      }
    }, 50)

    return () => clearInterval(typeInterval)
  }, [isTypingComment, samanthaComment])

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

          {/* Spacer a destra per bilanciare */}
          <div className="flex-shrink-0 w-32 md:w-48"></div>
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
                {/* Commento di Samantha */}
                <div className={`h-12 flex items-center justify-center transition-opacity duration-300 ${samanthaCommentVisible ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="font-mono text-white/80 text-lg md:text-xl">
                    {samanthaCommentText}
                    {isTypingComment && <span className="animate-pulse">_</span>}
                  </div>
                </div>

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
          <ChallengesSection participantInfo={participantInfo} teamInfo={teamInfo} isAdmin={isAdmin} />
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

    </div>
  )
}
