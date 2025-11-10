'use client'

import { useState } from 'react'
import ChallengeItem from './ChallengeItem'

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

interface ChallengesManagementProps {
  challenges: Challenge[]
}

export default function ChallengesManagement({ challenges: initialChallenges }: ChallengesManagementProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)

  // Total of 12 challenges
  const totalChallenges = 12
  const now = new Date()

  return (
    <div className="space-y-6">
      {/* Challenges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {Array.from({ length: totalChallenges }, (_, i) => {
          const challengeNumber = i + 1
          const challenge = initialChallenges.find((c) => c.challenge_number === challengeNumber)
          const isActive = challenge && new Date(challenge.start_date) <= now && new Date(challenge.end_date) >= now
          const isCompleted = challenge && new Date(challenge.end_date) < now
          const isScheduled = challenge && new Date(challenge.start_date) > now

          return (
            <button
              key={i}
              onClick={() => challenge && setSelectedChallenge(challenge)}
              className={`
                aspect-square rounded-xl flex flex-col items-center justify-center
                border-2 transition-all
                ${
                  isActive
                    ? 'bg-green-500/20 border-green-500'
                    : isCompleted
                    ? 'bg-white/10 border-white/30'
                    : isScheduled
                    ? 'bg-blue-500/20 border-blue-500'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }
              `}
            >
              <span className="text-3xl mb-2">
                {!challenge ? '➕' : isActive ? '🔥' : isCompleted ? '✅' : '📅'}
              </span>
              <span className="text-white font-bold">{challengeNumber}</span>
              {challenge && (
                <span className="text-xs text-white/60 mt-1">{challenge.title}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Challenge Detail */}
      {selectedChallenge ? (
        <ChallengeItem
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
        />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <span className="text-6xl block mb-4">🎯</span>
          <p className="text-white/60">Seleziona una sfida per visualizzarla o modificarla</p>
        </div>
      )}
    </div>
  )
}
