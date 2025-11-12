'use client'

import { useState, useEffect } from 'react'
import ParticipantLogin from './ParticipantLogin'
import GroupChat from './GroupChat'

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
  const [activeTab, setActiveTab] = useState<'chat' | 'clues' | 'private'>('chat')

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">🎮 The Game</h1>
              <p className="text-purple-200 text-sm md:text-base">
                Ciao, {participant.participant_name}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-sm md:text-base"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
            <div className="h-[calc(100vh-280px)] md:h-[600px] flex flex-col">
              <GroupChat participant={participant} />
            </div>
          </div>
        )}

        {/* Clues Tab */}
        {activeTab === 'clues' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                🔍 Indizi Disponibili
              </h2>
              <div className="text-center py-12 text-white/50">
                <span className="text-6xl mb-4 block">📜</span>
                <p className="text-lg">Nessun indizio ancora disponibile</p>
                <p className="text-sm mt-2">
                  Gli indizi verranno rivelati ogni sabato alle 00:00
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Private Tab */}
        {activeTab === 'private' && <PrivateSection />}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-white/10 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
              <p>The Game 2026-2027</p>
              <p className="mt-1">24/01/2026 - 24/01/2027</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
