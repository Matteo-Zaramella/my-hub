'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ParticipantLogin from './ParticipantLogin'
import GroupChat from './GroupChat'

// NOTE: MonthlyChallengesCluesSection e ValidateAnswerTab rimossi temporaneamente
// Si sbloccheranno dopo la cerimonia del 25/01/2026

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
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        🔒 Privato
      </h2>

      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-8 text-center">
        <span className="text-6xl block mb-4">⏳</span>
        <p className="text-xl text-white/90 mb-6">
          Contenuto bloccato
        </p>

        <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
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
  const [activeTab, setActiveTab] = useState<'info' | 'chat' | 'wishlist' | 'private'>('info')

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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    )
  }

  // Se non è loggato, mostra il login
  if (!participant) {
    return <ParticipantLogin onLoginSuccess={setParticipant} />
  }

  // Game Area completa
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 text-white pb-16">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center relative">
            {/* Nome utente - Sinistra */}
            <div className="flex-shrink-0">
              <p className="text-purple-200 text-sm md:text-base">
                Ciao, {participant.participant_name}!
              </p>
            </div>

            {/* Countdown - Centro assoluto */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center bg-black/30 px-4 py-2 rounded-lg border border-white/10">
                <div className="flex gap-1 font-mono text-white text-sm md:text-base">
                  <span>{String(ceremonyTimeLeft.days).padStart(2, '0')}</span>
                  <span>:</span>
                  <span>{String(ceremonyTimeLeft.hours).padStart(2, '0')}</span>
                  <span>:</span>
                  <span>{String(ceremonyTimeLeft.minutes).padStart(2, '0')}</span>
                  <span>:</span>
                  <span>{String(ceremonyTimeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            {/* Esci - Destra */}
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
        <div className="w-full flex justify-center">
          <div className="flex gap-2 md:gap-8">
            {/* Info - informazioni festa */}
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 md:px-6 py-3 font-semibold transition whitespace-nowrap ${
                activeTab === 'info'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              📍 Info
            </button>
            {/* Chat - sempre accessibile */}
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
            {/* Wishlist - sempre accessibile */}
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`px-4 md:px-6 py-3 font-semibold transition whitespace-nowrap ${
                activeTab === 'wishlist'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              🎁 Wishlist
            </button>
            {/* Privato - mostra countdown */}
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
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">📍 Informazioni Festa</h2>

            {/* Luogo */}
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-purple-300">Luogo</h3>
                <div className="space-y-3">
                  <p className="text-white text-lg font-medium">
                    L'Oste di Vino | Enoteca • Ristorante • Bistrot
                  </p>
                  <p className="text-white/70">
                    Via Pelosa, 76 - Selvazzano Dentro (PD)
                  </p>
                  <a
                    href="https://maps.app.goo.gl/qTRtBD2vRR3VLfgQA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
                  >
                    🗺️ Apri in Google Maps
                  </a>
                </div>
              </div>

              {/* Parcheggio */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-yellow-300">⚠️ Parcheggio</h3>
                <p className="text-white/80 mb-4">
                  Il locale dispone di soli <strong className="text-white">3 posti auto</strong>.
                  Si consiglia di parcheggiare nel parcheggio pubblico nelle vicinanze (cerchiato in rosso nella mappa).
                </p>
                <div className="rounded-lg overflow-hidden border border-white/20">
                  <img
                    src="/venue-map.png"
                    alt="Mappa del locale con parcheggio consigliato"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Sondaggio placeholder */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-purple-300">📊 Sondaggio</h3>
                <p className="text-white/60">
                  In arrivo...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
            <div className="h-[calc(100vh-200px)] md:h-[700px] lg:h-[750px] flex flex-col">
              <GroupChat participant={participant} />
            </div>
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              🎁 Wishlist
            </h2>
            <p className="text-white/80 text-lg">
              Sezione in arrivo...
            </p>
          </div>
        )}

        {/* Private Tab - Locked with countdown */}
        {activeTab === 'private' && <PrivateSection />}
      </main>

      {/* Footer fisso con codice utente */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/10 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="text-sm text-white/50">
            <p>
              Codice: <span className="font-mono font-bold text-white">{participant.participant_code}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
