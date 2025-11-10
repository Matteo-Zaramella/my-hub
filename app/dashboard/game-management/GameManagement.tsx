'use client'

import { useState } from 'react'
import OpeningCeremonyClues from './OpeningCeremonyClues'
import ChallengesManagement from './ChallengesManagement'
import ParticipantsTab from './ParticipantsTab'

interface GameConfig {
  id: number
  game_name: string
  start_date: string
  end_date: string
  total_challenges: number
  description: string
}

interface Clue {
  id: number
  challenge_id: number
  clue_number: number
  clue_text: string
  revealed_date: string | null
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
  game_clues: Clue[]
}

interface GameManagementProps {
  gameConfig: GameConfig | null
  challenges: Challenge[]
}

export default function GameManagement({ gameConfig, challenges }: GameManagementProps) {
  const [activeTab, setActiveTab] = useState<'ceremony' | 'challenges' | 'participants'>('ceremony')

  return (
    <div className="space-y-6">
      {/* Game Info */}
      {gameConfig && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">📋 Info Gioco</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-white/60">Inizio:</span>
              <p className="text-white font-bold">
                {new Date(gameConfig.start_date).toLocaleDateString('it-IT')}
              </p>
            </div>
            <div>
              <span className="text-white/60">Fine:</span>
              <p className="text-white font-bold">
                {new Date(gameConfig.end_date).toLocaleDateString('it-IT')}
              </p>
            </div>
            <div>
              <span className="text-white/60">Sfide Totali:</span>
              <p className="text-white font-bold">{gameConfig.total_challenges}</p>
            </div>
            <div>
              <span className="text-white/60">Montepremi:</span>
              <p className="text-white font-bold text-yellow-400">1.000€</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab('ceremony')}
          className={`px-6 py-3 font-medium transition ${
            activeTab === 'ceremony'
              ? 'text-white border-b-2 border-white'
              : 'text-white/60 hover:text-white'
          }`}
        >
          🎉 Cerimonia Apertura
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-6 py-3 font-medium transition ${
            activeTab === 'challenges'
              ? 'text-white border-b-2 border-white'
              : 'text-white/60 hover:text-white'
          }`}
        >
          🎯 Sfide Mensili
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          className={`px-6 py-3 font-medium transition ${
            activeTab === 'participants'
              ? 'text-white border-b-2 border-white'
              : 'text-white/60 hover:text-white'
          }`}
        >
          👥 Partecipanti
        </button>
      </div>

      {/* Content */}
      {activeTab === 'ceremony' && <OpeningCeremonyClues />}
      {activeTab === 'challenges' && <ChallengesManagement challenges={challenges} />}
      {activeTab === 'participants' && <ParticipantsTab />}
    </div>
  )
}
