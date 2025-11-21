'use client'

import { useState } from 'react'
import OpeningCeremonyClues from './OpeningCeremonyClues'
import ChallengesManagement from './ChallengesManagement'
import ParticipantsTab from './ParticipantsTab'
import ChecklistTab from './ChecklistTab'
import GamePhasesTab from './GamePhasesTab'
import SettingsTab from './SettingsTab'
import GameAreaControlTab from './GameAreaControlTab'
import TestingTab from './TestingTab'

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
  const [activeTab, setActiveTab] = useState<'ceremony' | 'challenges' | 'participants' | 'checklist' | 'phases' | 'settings' | 'gamearea'>('ceremony')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { id: 'ceremony' as const, icon: '🎉', label: 'Cerimonia Apertura' },
    { id: 'challenges' as const, icon: '🎯', label: 'Sfide Mensili' },
    { id: 'participants' as const, icon: '👥', label: 'Partecipanti' },
    { id: 'checklist' as const, icon: '✅', label: 'Checklist' },
    { id: 'phases' as const, icon: '🎯', label: 'Fasi del Gioco' },
    { id: 'settings' as const, icon: '⚙️', label: 'Impostazioni' },
    { id: 'gamearea' as const, icon: '🎮', label: 'Area di Gioco' },
  ]

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

      {/* Main Layout with Sidebar */}
      <div className="flex gap-6 relative">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:from-purple-700 hover:to-pink-700 transition"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 h-screen lg:h-auto
            w-64 bg-white/5 border border-white/10 rounded-xl p-4
            transition-transform duration-300 z-40
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  font-medium transition text-left
                  ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}

        {/* Content */}
        <main className="flex-1 min-w-0">
          {activeTab === 'ceremony' && <OpeningCeremonyClues />}
          {activeTab === 'challenges' && <ChallengesManagement challenges={challenges} />}
          {activeTab === 'participants' && <ParticipantsTab />}
          {activeTab === 'checklist' && <ChecklistTab />}
          {activeTab === 'phases' && <GamePhasesTab />}
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'gamearea' && <GameAreaControlTab />}
        </main>
      </div>
    </div>
  )
}
