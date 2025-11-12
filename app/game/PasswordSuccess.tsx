'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import GameAreaWithChat from './GameAreaWithChat'

export default function PasswordSuccess() {
  const [isGameActive, setIsGameActive] = useState(false)
  const [timeUntilGame, setTimeUntilGame] = useState('')

  useEffect(() => {
    const GAME_ACTIVATION_DATE = new Date('2026-01-26T00:00:00')

    const checkGameStatus = () => {
      const now = new Date()
      const isActive = now >= GAME_ACTIVATION_DATE
      setIsGameActive(isActive)

      if (!isActive) {
        const diff = GAME_ACTIVATION_DATE.getTime() - now.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeUntilGame(`${days}g ${hours}h ${minutes}m`)
      }
    }

    checkGameStatus()
    const interval = setInterval(checkGameStatus, 60000)

    return () => clearInterval(interval)
  }, [])

  // Se il game è attivo, mostra la GameArea completa
  if (isGameActive) {
    return <GameAreaWithChat />
  }

  // Prima del 26/01/2026, mostra solo la pagina successo
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border-4 border-green-500">
              <span className="text-6xl">✓</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Hai indovinato!
          </h1>

          {/* Message */}
          <div className="space-y-4">
            <p className="text-xl md:text-2xl text-white/90">
              Tutti i partecipanti guadagnano
            </p>
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6">
              <span className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                100 punti
              </span>
            </div>
          </div>

          {/* Celebration */}
          <div className="text-6xl animate-pulse">
            🎉 🎊 🎈
          </div>

          {/* Info Game Area */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
              <p className="text-purple-300 mb-2">
                🎮 L'area game si attiverà il
              </p>
              <p className="text-2xl font-bold text-white">
                26 Gennaio 2026
              </p>
              <p className="text-sm text-white/50 mt-1">ore 00:00</p>
              <div className="mt-3 space-y-1 text-sm text-white/70">
                <p>Tempo rimanente: <span className="font-mono">{timeUntilGame}</span></p>
              </div>
            </div>

            {/* Temporary Button */}
            <Link
              href="/game/area"
              className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              🚀 Accedi all'Area Game (Provvisorio)
            </Link>
            <p className="text-xs text-white/50">
              ⚠️ Pulsante provvisorio per test. Verrà rimosso dopo il 26/01/2026
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
