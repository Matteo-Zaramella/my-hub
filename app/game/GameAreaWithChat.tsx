'use client'

import { useState, useEffect } from 'react'
import ParticipantLogin from './ParticipantLogin'
import GroupChat from './GroupChat'
import ValidateAnswerTab from './ValidateAnswerTab'
import { createClient } from '@/lib/supabase/client'

// Componente per mostrare indizi sfide mensili con accordion
function MonthlyChallengesCluesSection() {
  const supabase = createClient()
  const [challenges, setChallenges] = useState<any[]>([])
  const [clues, setClues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openChallengeId, setOpenChallengeId] = useState<number | null>(null)

  useEffect(() => {
    loadChallengesAndClues()
  }, [])

  async function loadChallengesAndClues() {
    setLoading(true)

    // Carica le 11 sfide mensili (Febbraio 2026 - Dicembre 2026)
    const { data: challengesData, error: challengesError } = await supabase
      .from('game_challenges')
      .select('*')
      .gte('start_date', '2026-02-01')
      .lte('start_date', '2026-12-31')
      .order('start_date', { ascending: true })

    if (challengesError) {
      console.error('Error loading challenges:', challengesError)
      setLoading(false)
      return
    }

    // Carica tutti gli indizi
    const { data: cluesData, error: cluesError } = await supabase
      .from('game_clues')
      .select('*')
      .order('revealed_date', { ascending: true })

    if (cluesError) {
      console.error('Error loading clues:', cluesError)
      setLoading(false)
      return
    }

    setChallenges(challengesData || [])
    setClues(cluesData || [])
    setLoading(false)
  }

  function getChallengeClues(challengeId: number) {
    return clues.filter((clue) => clue.challenge_id === challengeId)
  }

  function toggleChallenge(challengeId: number) {
    setOpenChallengeId(openChallengeId === challengeId ? null : challengeId)
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  function isClueRevealed(revealDate: string) {
    return new Date(revealDate) <= new Date()
  }

  // Calcola il prossimo lunedì dopo una data
  function getNextMonday(date: Date): Date {
    const result = new Date(date)
    const day = result.getDay()
    const daysUntilMonday = day === 0 ? 1 : (8 - day) % 7
    result.setDate(result.getDate() + daysUntilMonday)
    result.setHours(0, 0, 0, 0)
    return result
  }

  // Verifica se l'immagine dell'indizio può essere mostrata (lunedì dopo revealed_date)
  function canShowClueImage(revealDate: string) {
    const reveal = new Date(revealDate)
    const nextMonday = getNextMonday(reveal)
    return new Date() >= nextMonday
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          🔍 Indizi Sfide Mensili
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-white/60">Caricamento...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {challenges.map((challenge, index) => {
              const challengeClues = getChallengeClues(challenge.id)
              const isOpen = openChallengeId === challenge.id
              const revealedClues = challengeClues.filter(c => isClueRevealed(c.revealed_date))

              return (
                <div
                  key={challenge.id}
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all hover:border-purple-500/30"
                >
                  {/* Header - Clickable */}
                  <button
                    onClick={() => toggleChallenge(challenge.id)}
                    className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-white text-lg">
                          Sfida {formatDate(challenge.start_date)}
                        </div>
                        <div className="text-sm text-white/60">
                          {revealedClues.length}/{challengeClues.length} indizi rivelati
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      ▼
                    </div>
                  </button>

                  {/* Content - Accordion */}
                  {isOpen && (
                    <div className="border-t border-white/10 p-5 bg-white/5">
                      {challengeClues.length === 0 ? (
                        <p className="text-white/60 text-center py-4">
                          Nessun indizio disponibile per questa sfida
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {challengeClues.map((clue, clueIndex) => {
                            const imageRevealed = canShowClueImage(clue.revealed_date)
                            const nextMonday = getNextMonday(new Date(clue.revealed_date))

                            return (
                              <div
                                key={clue.id}
                                className="relative aspect-square rounded-xl overflow-hidden border-2 border-white/20 group hover:border-purple-500/50 transition-all"
                              >
                                {imageRevealed ? (
                                  // Immagine rivelata
                                  clue.image_url ? (
                                    <div className="relative w-full h-full">
                                      <img
                                        src={clue.image_url}
                                        alt={`Indizio ${clueIndex + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                        <p className="text-white text-sm font-semibold">
                                          Indizio #{clueIndex + 1}
                                        </p>
                                        <p className="text-white/70 text-xs">
                                          {formatDate(clue.revealed_date)}
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    // Placeholder se l'immagine non è stata caricata
                                    <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex flex-col items-center justify-center p-4 text-center">
                                      <span className="text-4xl mb-2">📷</span>
                                      <p className="text-white/80 font-semibold">Indizio #{clueIndex + 1}</p>
                                      <p className="text-white/50 text-xs mt-2">Immagine non ancora caricata</p>
                                    </div>
                                  )
                                ) : (
                                  // Card lucchettata
                                  <div className="w-full h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex flex-col items-center justify-center p-4 text-center">
                                    <span className="text-6xl mb-3 opacity-50">🔒</span>
                                    <p className="text-white/80 font-semibold mb-1">Indizio #{clueIndex + 1}</p>
                                    <p className="text-white/50 text-xs">
                                      Disponibile dal {nextMonday.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Info */}
        <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-2">
          <p className="text-sm text-white/70">
            💡 <span className="font-bold">Come funziona:</span> Gli indizi vengono pubblicati ogni settimana, ma le immagini
            si rivelano solo il <span className="font-bold">lunedì successivo</span> per dare tempo a tutti di partecipare!
          </p>
          <p className="text-sm text-purple-300">
            🔒 <span className="font-bold">Rivelazione:</span> Durante il giorno dell'indizio/sfida rimane tutto lucchettato.
            Le immagini si sbloccano il lunedì successivo.
          </p>
          <p className="text-sm text-green-300">
            🏆 <span className="font-bold">11 Sfide:</span> Da Febbraio 2026 a Dicembre 2026, una sfida al mese con 3-4 indizi ciascuna
          </p>
        </div>
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
    const targetDate = new Date('2026-07-26T00:00:00')

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
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        🔒 Privato
      </h2>

      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-8 text-center">
        <span className="text-6xl block mb-4">⏳</span>
        <p className="text-xl text-white/90 mb-6">
          Contenuto disponibile tra:
        </p>

        <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto mb-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              {timeLeft.days}
            </div>
            <div className="text-xs md:text-sm text-white/60 uppercase">Giorni</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              {timeLeft.hours}
            </div>
            <div className="text-xs md:text-sm text-white/60 uppercase">Ore</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              {timeLeft.minutes}
            </div>
            <div className="text-xs md:text-sm text-white/60 uppercase">Minuti</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              {timeLeft.seconds}
            </div>
            <div className="text-xs md:text-sm text-white/60 uppercase">Secondi</div>
          </div>
        </div>

        <p className="text-purple-200 text-sm">
          📅 26 Luglio 2026 - 00:00
        </p>
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
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [activeTab, setActiveTab] = useState<'chat' | 'clues' | 'validate' | 'private'>('chat')

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
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('game_participant')
    setParticipant(null)
  }

  // Se non è loggato, mostra il login
  if (!participant) {
    return <ParticipantLogin onLoginSuccess={setParticipant} />
  }

  // Game Area completa
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center gap-4">
            {/* Logo e Titolo */}
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-12 h-12 md:w-16 md:h-16 rounded-lg"
              />
              <div>
                <h1 className="text-xl md:text-3xl font-bold">A Tutto Reality: La Rivoluzione</h1>
                <p className="text-purple-200 text-sm md:text-base">
                  Ciao, {participant.participant_name}!
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-sm md:text-base flex-shrink-0"
            >
              Esci
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 md:gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 md:px-6 py-3 font-semibold transition whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setActiveTab('clues')}
              className={`px-4 md:px-6 py-3 font-semibold transition whitespace-nowrap ${
                activeTab === 'clues'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              🔍 Indizi
            </button>
            <button
              onClick={() => setActiveTab('validate')}
              className={`px-4 md:px-6 py-3 font-semibold transition whitespace-nowrap ${
                activeTab === 'validate'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              🔐 Valida Risposta
            </button>
            <button
              onClick={() => setActiveTab('private')}
              className={`px-4 md:px-6 py-3 font-semibold transition whitespace-nowrap ${
                activeTab === 'private'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              🔒 Privato
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
            <div className="h-[calc(100vh-200px)] md:h-[700px] lg:h-[750px] flex flex-col">
              <GroupChat participant={participant} />
            </div>
          </div>
        )}

        {/* Clues Tab */}
        {activeTab === 'clues' && (
          <MonthlyChallengesCluesSection />
        )}

        {/* Validate Answer Tab */}
        {activeTab === 'validate' && (
          <ValidateAnswerTab participantId={participant.id} />
        )}

        {/* Private Tab */}
        {activeTab === 'private' && <PrivateSection />}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-white/10 mt-8">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
            <div>
              <p>
                Codice: <span className="font-mono font-bold text-white">{participant.participant_code}</span>
              </p>
              {participant.partner_name && (
                <p className="mt-1">
                  Partner: <span className="text-white">{participant.partner_name}</span>
                </p>
              )}
            </div>
            <div className="text-center md:text-right">
              <p>A Tutto Reality: La Rivoluzione 2026-2027</p>
              <p className="mt-1">24/01/2026 - 24/01/2027</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
