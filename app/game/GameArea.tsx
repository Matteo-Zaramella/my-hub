'use client'

import Link from 'next/link'
import { useState } from 'react'

interface GameConfig {
  id: number
  game_name: string
  start_date: string
  end_date: string
  total_challenges: number
  description: string
}

interface Challenge {
  id: number
  challenge_number: number
  title: string
  description: string
  points: number
  start_date: string
  end_date: string
  location: string
  instructions: string
}

interface LeaderboardEntry {
  user_id: number
  points: number
  users: {
    username: string
  }
}

interface GameAreaProps {
  gameConfig: GameConfig | null
  challenges: Challenge[]
  leaderboard: LeaderboardEntry[]
  user: any
}

export default function GameArea({ gameConfig, challenges, leaderboard, user }: GameAreaProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)

  const now = new Date()
  const activeChallenge = challenges.find((c) => {
    const start = new Date(c.start_date)
    const end = new Date(c.end_date)
    return now >= start && now <= end
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">🎮 A Tutto Reality: La Rivoluzione</h1>
              <p className="text-purple-200 mt-2">
                {gameConfig?.description || 'Caccia al Tesoro 2026'}
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition backdrop-blur-sm"
            >
              ← Esci
            </Link>
          </div>

          {/* Management Links */}
          {user && (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard/game-management/participants"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition text-white font-medium flex items-center gap-2"
              >
                👥 Partecipanti
              </Link>
              <button
                disabled
                className="px-4 py-2 bg-white/10 rounded-lg text-white/50 font-medium flex items-center gap-2 cursor-not-allowed"
              >
                🎪 Cerimonia Apertura
              </button>
              <button
                disabled
                className="px-4 py-2 bg-white/10 rounded-lg text-white/50 font-medium flex items-center gap-2 cursor-not-allowed"
              >
                📅 Sfide Mensili
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Challenge */}
            {activeChallenge ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🔥</span>
                  <div>
                    <h2 className="text-2xl font-bold">Sfida Attiva</h2>
                    <p className="text-purple-200">Sfida #{activeChallenge.challenge_number}</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{activeChallenge.title}</h3>
                <p className="text-gray-200 mb-4">{activeChallenge.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-purple-300">Punti:</span>{' '}
                    <span className="font-bold">{activeChallenge.points}</span>
                  </div>
                  <div>
                    <span className="text-purple-300">Luogo:</span>{' '}
                    <span className="font-bold">{activeChallenge.location || 'Da scoprire'}</span>
                  </div>
                </div>
                {activeChallenge.instructions && (
                  <div className="mt-4 p-4 bg-black/30 rounded-lg">
                    <p className="text-sm text-gray-300">{activeChallenge.instructions}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 text-center">
                <span className="text-6xl mb-4 block">⏳</span>
                <h2 className="text-2xl font-bold mb-2">Nessuna Sfida Attiva</h2>
                <p className="text-gray-300">La prossima sfida sarà presto disponibile!</p>
              </div>
            )}

            {/* All Challenges */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4">📋 Tutte le Sfide</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: gameConfig?.total_challenges || 12 }, (_, i) => {
                  const challenge = challenges.find((c) => c.challenge_number === i + 1)
                  const isActive = challenge?.id === activeChallenge?.id
                  const isCompleted = challenge && new Date(challenge.end_date) < now
                  const isLocked = !challenge

                  return (
                    <button
                      key={i}
                      onClick={() => challenge && setSelectedChallenge(challenge)}
                      disabled={isLocked}
                      className={`
                        aspect-square rounded-xl flex flex-col items-center justify-center
                        transition-all duration-300 border-2
                        ${
                          isActive
                            ? 'bg-gradient-to-br from-yellow-500 to-orange-500 border-yellow-300 shadow-lg shadow-yellow-500/50'
                            : isCompleted
                            ? 'bg-gradient-to-br from-green-600 to-teal-600 border-green-400'
                            : isLocked
                            ? 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
                            : 'bg-white/10 border-white/20 hover:bg-white/20'
                        }
                      `}
                    >
                      <span className="text-3xl mb-2">
                        {isLocked ? '🔒' : isCompleted ? '✅' : isActive ? '🔥' : '📍'}
                      </span>
                      <span className="font-bold">Sfida {i + 1}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 sticky top-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                🏆 Classifica
              </h2>
              {leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.user_id}
                      className={`
                        flex items-center justify-between p-3 rounded-lg
                        ${
                          index === 0
                            ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border border-yellow-400/50'
                            : index === 1
                            ? 'bg-gradient-to-r from-gray-300/20 to-gray-400/20 border border-gray-300/50'
                            : index === 2
                            ? 'bg-gradient-to-r from-orange-700/30 to-red-700/30 border border-orange-400/50'
                            : 'bg-white/5'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold w-8">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                        </span>
                        <span className="font-medium">{entry.users.username}</span>
                      </div>
                      <span className="font-bold text-lg">{entry.points} pt</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <span className="text-4xl block mb-2">📊</span>
                  <p>Nessun punteggio ancora</p>
                </div>
              )}

              {/* Game Info */}
              {gameConfig && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-purple-300">Inizio:</span>{' '}
                      <span className="font-bold">
                        {new Date(gameConfig.start_date).toLocaleDateString('it-IT')}
                      </span>
                    </div>
                    <div>
                      <span className="text-purple-300">Fine:</span>{' '}
                      <span className="font-bold">
                        {new Date(gameConfig.end_date).toLocaleDateString('it-IT')}
                      </span>
                    </div>
                    <div>
                      <span className="text-purple-300">Montepremi:</span>{' '}
                      <span className="font-bold text-yellow-400">1.000€</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedChallenge(null)}
        >
          <div
            className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-purple-300 text-sm">Sfida #{selectedChallenge.challenge_number}</span>
                <h2 className="text-3xl font-bold mt-1">{selectedChallenge.title}</h2>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="text-white/60 hover:text-white text-3xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-200 mb-6">{selectedChallenge.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/30 rounded-lg p-4">
                <span className="text-purple-300 text-sm">Punti</span>
                <p className="text-2xl font-bold">{selectedChallenge.points}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <span className="text-purple-300 text-sm">Luogo</span>
                <p className="text-xl font-bold">{selectedChallenge.location || 'Da scoprire'}</p>
              </div>
            </div>
            {selectedChallenge.instructions && (
              <div className="bg-black/30 rounded-lg p-4">
                <span className="text-purple-300 text-sm block mb-2">Istruzioni</span>
                <p className="text-gray-200">{selectedChallenge.instructions}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
