'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NextImage from 'next/image'
import { createClient } from '@/lib/supabase/client'
import ParticipantLogin from './ParticipantLogin'
import GroupChat from './GroupChat'
import { getRandomBlockedPhrase, getClueComment } from '@/lib/samantha-phrases'

// NOTE: MonthlyChallengesCluesSection e ValidateAnswerTab rimossi temporaneamente
// Si sbloccheranno dopo la cerimonia del 25/01/2026

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

const CATEGORIE_LABELS: Record<string, string> = {
  elettrodomestici: 'Elettrodomestici',
  elettronica: 'Elettronica',
  bici: 'Bici',
  integratori: 'Integratori',
  sport: 'Sport',
  vestiti: 'Vestiti',
  altro: 'Altro'
}

// Componente RSVP Presenza + Narghilé
function RSVPQuestion({ participantCode }: { participantCode: string }) {
  const [rsvpStatus, setRsvpStatus] = useState<string | null>(null)
  const [narghileAnswer, setNarghileAnswer] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    checkExistingAnswers()
  }, [participantCode])

  async function checkExistingAnswers() {
    const { data, error } = await supabase
      .from('party_survey_responses')
      .select('rsvp_status, wants_narghile')
      .eq('participant_code', participantCode)
      .single()

    if (data && !error) {
      setRsvpStatus(data.rsvp_status)
      setNarghileAnswer(data.wants_narghile)
    }
    setIsLoading(false)
  }

  async function handleRSVP(status: 'yes' | 'no' | 'maybe') {
    setIsSaving(true)

    // Usa upsert per creare o aggiornare
    const { error } = await supabase
      .from('party_survey_responses')
      .upsert({
        participant_code: participantCode,
        rsvp_status: status
      }, { onConflict: 'participant_code' })

    if (error) {
      console.error('Error saving RSVP:', error)
    } else {
      setRsvpStatus(status)
      // Reset narghile answer to show question again if switching to yes/maybe
      if (status === 'yes' || status === 'maybe') {
        // Ricarica per vedere se ha già risposto
        const { data } = await supabase
          .from('party_survey_responses')
          .select('wants_narghile')
          .eq('participant_code', participantCode)
          .single()
        setNarghileAnswer(data?.wants_narghile ?? null)
      }
    }

    setIsSaving(false)
  }

  async function handleNarghile(wantsNarghile: boolean) {
    const { error } = await supabase
      .from('party_survey_responses')
      .update({ wants_narghile: wantsNarghile })
      .eq('participant_code', participantCode)

    if (!error) {
      setNarghileAnswer(wantsNarghile)
    }
  }

  if (isLoading) {
    return null
  }

  const options = [
    { value: 'yes', label: 'Ci sarò' },
    { value: 'maybe', label: 'Forse' },
    { value: 'no', label: 'Non ci sarò' }
  ] as const

  const showNarghile = (rsvpStatus === 'yes' || rsvpStatus === 'maybe') && narghileAnswer === null

  return (
    <div className="pb-4">
      <p className="text-white/70 mb-4 text-center">Conferma la tua presenza</p>
      <div className="flex justify-center gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleRSVP(option.value)}
            disabled={isSaving}
            className={`px-4 py-2 border transition ${
              rsvpStatus === option.value
                ? 'border-white text-white'
                : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white/80'
            } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {rsvpStatus && (
        <p className="text-white/40 text-xs text-center mt-3">
          Puoi modificare la tua risposta in qualsiasi momento.
        </p>
      )}

      {/* Domanda Narghilé - solo se presenza = sì o forse */}
      {showNarghile && (
        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-white/70 mb-4">Narghilé?</p>
          <div className="flex justify-center gap-8">
            <button
              onClick={() => handleNarghile(true)}
              className="text-white/60 hover:text-white transition"
            >
              Sì
            </button>
            <button
              onClick={() => handleNarghile(false)}
              className="text-white/60 hover:text-white transition"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  )
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
        .order('categoria', { ascending: true })
        .order('created_at', { ascending: false })

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

  // Raggruppa per categoria
  const itemsByCategory = items.reduce((acc, item) => {
    const cat = item.categoria || 'altro'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {} as Record<string, WishlistItem[]>)

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
        {Object.entries(itemsByCategory).map(([categoria, categoryItems]) => (
          <section key={categoria}>
            <h3 className="text-sm text-white/60 mb-4 border-b border-white/10 pb-2">
              {CATEGORIE_LABELS[categoria] || categoria}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-white/20 overflow-hidden hover:border-white/40 transition-colors"
                >
                  {/* Immagine */}
                  {item.immagine_url ? (
                    <div className="aspect-square relative bg-black">
                      <NextImage
                        src={item.immagine_url}
                        alt={item.nome}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-contain opacity-80"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-white/5 flex items-center justify-center">
                      <span className="text-2xl opacity-20">?</span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-4 border-t border-white/10">
                    <h4 className="text-white/80 text-sm mb-2 line-clamp-2">
                      {item.nome}
                    </h4>

                    {/* Taglie per vestiti */}
                    {item.categoria === 'vestiti' && item.taglie && (
                      <div className="text-xs text-white/40 mb-3 space-y-0.5">
                        {item.taglie.pantaloni && <p>Pantaloni: {item.taglie.pantaloni}</p>}
                        {item.taglie.maglie && <p>Maglie: {item.taglie.maglie}</p>}
                        {item.taglie.tshirt && <p>T-shirt: {item.taglie.tshirt}</p>}
                      </div>
                    )}

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/40 hover:text-white text-xs underline transition"
                      >
                        Vedi prodotto
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

// Componente Cerimonia - 10 cerchi per gli indizi
function CeremonySection({ participantCode, onCeremonyComplete }: { participantCode: string, onCeremonyComplete: () => void }) {
  const [foundClues, setFoundClues] = useState<string[]>([])
  const [inputWord, setInputWord] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  const [allClues, setAllClues] = useState<{ word: string, order_number: number }[]>([])
  const [showFinalPassword, setShowFinalPassword] = useState(false)
  const [finalPassword, setFinalPassword] = useState('')
  const [ceremonyCompleted, setCeremonyCompleted] = useState(false)

  // Stati per messaggio Samantha (finale)
  const [samanthaText, setSamanthaText] = useState('')
  const [showSamanthaCursor, setShowSamanthaCursor] = useState(true)
  const [glitchPhase, setGlitchPhase] = useState<'none' | 'rgb' | 'wingdings'>('none')

  // Stati per commenti Samantha durante il gioco
  const [samanthaComment, setSamanthaComment] = useState('')
  const [samanthaCommentVisible, setSamanthaCommentVisible] = useState(false)
  const [samanthaCommentText, setSamanthaCommentText] = useState('')
  const [isTypingComment, setIsTypingComment] = useState(false)

  const supabase = createClient()

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

  // Carica gli indizi e lo stato globale
  useEffect(() => {
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
  }, [])

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

  async function handleSubmitWord(e: React.FormEvent) {
    e.preventDefault()
    if (!inputWord.trim() || isSubmitting) return

    setIsSubmitting(true)
    setMessage(null)

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
      setMessage({ type: 'error', text: 'Errore nel salvataggio' })
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
      setCeremonyCompleted(true)
      setMessage({ type: 'success', text: 'EVOLUZIONE! Accesso sbloccato!' })
      // Qui si potrebbe triggerare l'assegnazione dei punti bonus
    } else {
      setMessage({ type: 'error', text: 'Password errata' })
    }
  }

  // Calcola quali cerchi sono pieni in base all'ordine
  const filledCircles = allClues
    .filter(c => foundClues.includes(c.word))
    .map(c => c.order_number)

  const SAMANTHA_LINES = [
    'Congratulazioni.',
    'Avete vinto.',
    'Tutti i partecipanti guadagnano 50 punti.',
    'Adesso inizia il divertimento... :D'
  ]

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
      '0': '📁', '1': '📂', '2': '📄', '3': '🗏', '4': '🗐', '5': '🗄',
    }
    return wingdingsMap[char] || char
  }

  const getWingdingsText = (text: string) => {
    return text.split('').map(char => char === ' ' ? ' ' : charToWingdings(char)).join('')
  }

  useEffect(() => {
    if (!ceremonyCompleted) return

    let charIndex = 0
    let lineIndex = 0
    let isDeleting = false
    let cursorInterval: NodeJS.Timeout

    cursorInterval = setInterval(() => {
      if (glitchPhase === 'none') {
        setShowSamanthaCursor(prev => !prev)
      }
    }, 500)

    const animate = () => {
      // Tutte le righe completate - attiva glitch
      if (lineIndex >= SAMANTHA_LINES.length) {
        setShowSamanthaCursor(false)
        // Fase 1: Glitch RGB
        setGlitchPhase('rgb')
        setTimeout(() => {
          // Fase 2: Wingdings
          setGlitchPhase('wingdings')
          setTimeout(() => {
            // Fine - nascondi tab Gioco
            onCeremonyComplete()
          }, 1500)
        }, 1000)
        return
      }

      const currentLine = SAMANTHA_LINES[lineIndex]

      if (!isDeleting) {
        if (charIndex < currentLine.length) {
          setSamanthaText(currentLine.slice(0, charIndex + 1))
          charIndex++
          setTimeout(animate, 60)
        } else {
          // Riga completata
          if (lineIndex < SAMANTHA_LINES.length - 1) {
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
          setSamanthaText(currentLine.slice(0, charIndex))
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

  // Se la cerimonia è completata, mostra messaggio Samantha
  if (ceremonyCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center px-8 max-w-4xl">
          <div className="font-mono text-white text-xl md:text-2xl lg:text-3xl">
            {glitchPhase === 'wingdings' ? (
              <span className="wingdings-text">
                {getWingdingsText(samanthaText)}
              </span>
            ) : glitchPhase === 'rgb' ? (
              <span className="rgb-glitch-text">
                {samanthaText.split('').map((char, i) => (
                  <span key={i} className="glitch-char">
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
            ) : (
              <>
                {samanthaText}
                <span className={`${showSamanthaCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
                  _
                </span>
              </>
            )}
          </div>
        </div>

        <style jsx>{`
          .rgb-glitch-text {
            display: inline-block;
            animation: screen-shake 0.1s infinite;
          }

          .glitch-char {
            display: inline-block;
            position: relative;
            animation: char-glitch 0.1s infinite;
            text-shadow:
              -3px 0 #ff0040,
              3px 0 #00ffff;
          }

          .wingdings-text {
            display: inline-block;
            color: #a855f7;
            text-shadow: 0 0 10px #a855f7, 0 0 20px #a855f7;
            animation: wingdings-pulse 0.2s infinite;
          }

          @keyframes screen-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            50% { transform: translateX(2px); }
            75% { transform: translateX(-1px); }
          }

          @keyframes char-glitch {
            0%, 100% { transform: translateX(0) skewX(0deg); }
            20% { transform: translateX(-2px) skewX(-5deg); }
            40% { transform: translateX(2px) skewX(5deg); }
            60% { transform: translateX(-1px) skewX(-2deg); }
            80% { transform: translateX(1px) skewX(2deg); }
          }

          @keyframes wingdings-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      {/* Commento di Samantha */}
      <div className={`h-12 flex items-center justify-center transition-opacity duration-300 ${samanthaCommentVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="font-mono text-white/80 text-lg md:text-xl">
          {samanthaCommentText}
          {isTypingComment && <span className="animate-pulse">_</span>}
        </div>
      </div>

      {/* Input parola - grande e centrato con freccia a destra */}
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
  )
}

// Componente sezione privata con countdown
function PrivateSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    // Countdown alla cerimonia 25/01/2026 00:00
    const targetDate = new Date('2026-01-25T00:00:00')

    const updateCountdown = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-light text-center">Privato</h2>

      <div className="text-center py-8">
        <p className="text-white/40 mb-8">Contenuto bloccato</p>

        <div className="flex justify-center gap-8 font-mono">
          <div>
            <div className="text-2xl md:text-3xl text-white">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-xs text-white/40 mt-1">giorni</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl text-white">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-xs text-white/40 mt-1">ore</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl text-white">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-xs text-white/40 mt-1">min</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl text-white">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-xs text-white/40 mt-1">sec</div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Participant {
  id: number
  user_id: string
  participant_name: string
  phone_number: string | null
  instagram_handle: string | null
  category: string | null
  participant_code: string
  notes: string | null
  partner_name: string | null
  is_couple: boolean
}

export default function GameAreaWithChat() {
  const router = useRouter()
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'info' | 'chat' | 'wishlist' | 'private' | 'cerimonia' | 'mystery'>('info')
  const [ceremonyHidden, setCeremonyHidden] = useState(false)

  // Stati per tab "?" bloccata
  const [mysteryPhrase, setMysteryPhrase] = useState('')
  const [mysteryTyping, setMysteryTyping] = useState(false)
  const [mysteryText, setMysteryText] = useState('')
  const [showMysteryCursor, setShowMysteryCursor] = useState(true)

  // Controlla se la cerimonia è già stata completata
  useEffect(() => {
    const completed = localStorage.getItem('ceremony_completed')
    if (completed === 'true') {
      setCeremonyHidden(true)
    }
  }, [])

  const handleCeremonyComplete = () => {
    localStorage.setItem('ceremony_completed', 'true')
    setCeremonyHidden(true)
    setActiveTab('info')
  }

  // Gestisce il click sulla tab "?" - mostra messaggio Samantha
  const handleMysteryTabClick = () => {
    setActiveTab('mystery')
    const phrase = getRandomBlockedPhrase()
    setMysteryPhrase(phrase)
    setMysteryText('')
    setMysteryTyping(true)
  }

  // Effetto typing per la tab mystery (scrive e poi cancella)
  useEffect(() => {
    if (!mysteryTyping || activeTab !== 'mystery') return

    let charIndex = 0
    let isDeleting = false
    const phrase = mysteryPhrase

    const cursorInterval = setInterval(() => {
      setShowMysteryCursor(prev => !prev)
    }, 500)

    const animate = () => {
      if (!isDeleting) {
        // Fase scrittura
        if (charIndex < phrase.length) {
          setMysteryText(phrase.slice(0, charIndex + 1))
          charIndex++
          setTimeout(animate, 60)
        } else {
          // Pausa prima di cancellare
          setTimeout(() => {
            isDeleting = true
            animate()
          }, 2000)
        }
      } else {
        // Fase cancellazione
        if (charIndex > 0) {
          charIndex--
          setMysteryText(phrase.slice(0, charIndex))
          setTimeout(animate, 40)
        } else {
          // Finito
          setMysteryTyping(false)
        }
      }
    }

    animate()

    return () => {
      clearInterval(cursorInterval)
    }
  }, [mysteryTyping, mysteryPhrase, activeTab])

  // Countdown alla cerimonia (25/01/2026 00:00)
  const [ceremonyTimeLeft, setCeremonyTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Carica partecipante da localStorage se esiste
  useEffect(() => {
    const stored = localStorage.getItem('game_participant')
    if (stored) {
      try {
        setParticipant(JSON.parse(stored))
      } catch (e) {
        console.error('Error loading participant:', e)
      }
    }
    setIsLoading(false)
  }, [])

  // Countdown effect
  useEffect(() => {
    const targetDate = new Date('2026-01-25T00:00:00')

    const updateCountdown = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        setCeremonyTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setCeremonyTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('game_participant')
    localStorage.removeItem('participantCode')
    localStorage.removeItem('registrationCompleted')
    // Torna alla pagina principale con scelta REGISTRATI/ACCEDI
    router.replace('/')
  }

  // Mostra loading mentre verifica localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60">Caricamento...</div>
      </div>
    )
  }

  // Se non è loggato, mostra il login
  if (!participant) {
    return <ParticipantLogin onLoginSuccess={setParticipant} />
  }

  // Game Area completa
  return (
    <div className="min-h-screen bg-black text-white pb-12">
      {/* Header */}
      <header className="border-b border-white/20">
        <div className="w-full px-4 py-3">
          {/* Mobile: stack vertically */}
          <div className="flex flex-col gap-2 md:hidden">
            <div className="flex justify-between items-center">
              <p className="text-white/60 text-sm truncate max-w-[150px]">
                Ciao, {participant.participant_name.split(' ')[0]}!
              </p>
              <div className="font-mono text-white text-xs">
                {String(ceremonyTimeLeft.days).padStart(2, '0')} : {String(ceremonyTimeLeft.hours).padStart(2, '0')} : {String(ceremonyTimeLeft.minutes).padStart(2, '0')} : {String(ceremonyTimeLeft.seconds).padStart(2, '0')}
              </div>
              <button
                onClick={handleLogout}
                className="text-white/40 hover:text-white transition text-sm"
              >
                Esci
              </button>
            </div>
          </div>

          {/* Desktop: horizontal with centered timer */}
          <div className="hidden md:flex justify-between items-center relative">
            <div className="flex-shrink-0">
              <p className="text-white/60">
                Ciao, {participant.participant_name}!
              </p>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="font-mono text-white">
                {String(ceremonyTimeLeft.days).padStart(2, '0')} : {String(ceremonyTimeLeft.hours).padStart(2, '0')} : {String(ceremonyTimeLeft.minutes).padStart(2, '0')} : {String(ceremonyTimeLeft.seconds).padStart(2, '0')}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-white/40 hover:text-white transition flex-shrink-0"
            >
              Esci
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-white/20">
        <div className="w-full flex justify-center">
          <div className="flex gap-6 md:gap-12">
            {/* Tab "?" - sempre visibile, bloccata con messaggi di Samantha */}
            {!ceremonyHidden && (
              <button
                onClick={handleMysteryTabClick}
                className={`py-3 transition whitespace-nowrap ${
                  activeTab === 'mystery'
                    ? 'text-white border-b border-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                ?
              </button>
            )}
            <button
              onClick={() => setActiveTab('info')}
              className={`py-3 transition whitespace-nowrap ${
                activeTab === 'info'
                  ? 'text-white border-b border-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Info
            </button>
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
            <button
              onClick={() => setActiveTab('private')}
              className={`py-3 transition whitespace-nowrap ${
                activeTab === 'private'
                  ? 'text-white border-b border-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Privato
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 md:px-8 lg:px-16 py-8">
        {/* Mystery Tab - Schermata bloccata con Samantha */}
        {activeTab === 'mystery' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center px-8 max-w-4xl">
              <div className="font-mono text-white text-xl md:text-2xl lg:text-3xl">
                {mysteryText}
                <span className={`${showMysteryCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
                  _
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-8">
            <h2 className="text-xl font-light text-center mb-8">Informazioni Festa</h2>

            {/* RSVP Presenza */}
            <RSVPQuestion participantCode={participant.participant_code} />

            {/* Luogo e Orario */}
            <div className="space-y-4">
              <p className="text-white font-medium">
                L'Oste di Vino | Enoteca • Ristorante • Bistrot
              </p>
              <p className="text-white/60">
                Via Pelosa, 76 - Selvazzano Dentro (PD)
              </p>
              <p className="text-white/60">
                24 Gennaio 2026 - Dalle 21:30 / 22:00 alle 02:00
              </p>
              <div className="flex gap-4 mt-2">
                <a
                  href="https://maps.app.goo.gl/qTRtBD2vRR3VLfgQA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition"
                  title="Google Maps"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </a>
                <a
                  href="https://chat.whatsapp.com/J0G6N7owQWcBtuuhcTpCo6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition"
                  title="Gruppo WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <p className="text-white/60 mb-4">
                Il locale dispone di soli 3 posti auto.
                Parcheggiare nel parcheggio pubblico nelle vicinanze.
              </p>
              <div className="border border-white/20">
                <img
                  src="/venue-map.png"
                  alt="Mappa del locale con parcheggio consigliato"
                  className="w-full h-auto opacity-80"
                />
              </div>
            </div>

          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="border border-white/20 overflow-hidden">
            <div className="h-[calc(100vh-180px)] flex flex-col">
              <GroupChat participant={participant} />
            </div>
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && <WishlistSection />}

        {/* Private Tab - Locked with countdown */}
        {activeTab === 'private' && <PrivateSection />}
      </main>

      {/* Footer fisso con codice utente */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/20 z-40">
        <div className="w-full px-4 py-2">
          <p className="text-xs text-white/40">
            Codice: <span className="font-mono text-white/60">{participant.participant_code}</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
