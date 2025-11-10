'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

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

interface ChallengeItemProps {
  challenge: Challenge
  onClose: () => void
}

export default function ChallengeItem({ challenge, onClose }: ChallengeItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(challenge.title)
  const [description, setDescription] = useState(challenge.description)
  const [points, setPoints] = useState(challenge.points)
  const [startDate, setStartDate] = useState(challenge.start_date.split('T')[0])
  const [endDate, setEndDate] = useState(challenge.end_date.split('T')[0])
  const [location, setLocation] = useState(challenge.location)
  const [instructions, setInstructions] = useState(challenge.instructions)
  const [clues, setClues] = useState<Clue[]>(challenge.game_clues || [])
  const [newClueText, setNewClueText] = useState('')

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const supabase = createClient()

  // Countdown to challenge start
  useEffect(() => {
    const targetDate = new Date(challenge.start_date).getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [challenge.start_date])

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('game_challenges')
      .update({
        title,
        description,
        points,
        start_date: startDate,
        end_date: endDate,
        location,
        instructions,
      })
      .eq('id', challenge.id)

    if (error) {
      console.error('Error updating challenge:', error)
    } else {
      setIsEditing(false)
      window.location.reload()
    }
  }

  const handleAddClue = async () => {
    if (!newClueText.trim()) return

    const { error } = await supabase
      .from('game_clues')
      .insert([
        {
          challenge_id: challenge.id,
          clue_number: clues.length + 1,
          clue_text: newClueText,
        },
      ])

    if (error) {
      console.error('Error adding clue:', error)
    } else {
      setNewClueText('')
      window.location.reload()
    }
  }

  const handleDeleteClue = async (clueId: number) => {
    const { error } = await supabase.from('game_clues').delete().eq('id', clueId)

    if (error) {
      console.error('Error deleting clue:', error)
    } else {
      window.location.reload()
    }
  }

  const now = new Date()
  const isActive = new Date(challenge.start_date) <= now && new Date(challenge.end_date) >= now

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-white/60">Sfida #{challenge.challenge_number}</span>
            {isActive && <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">ATTIVA</span>}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold bg-transparent border-b border-white/20 text-white focus:outline-none focus:border-white/40"
            />
          ) : (
            <h2 className="text-2xl font-bold text-white">{challenge.title}</h2>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white text-2xl"
        >
          ✕
        </button>
      </div>

      {/* Countdown */}
      {new Date(challenge.start_date) > now && (
        <div className="bg-black/30 border border-white/10 rounded-lg p-4">
          <h3 className="text-sm text-white/60 mb-2">⏰ Inizio tra:</h3>
          <div className="flex gap-3">
            <div>
              <div className="text-xl font-bold text-white">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="text-xs text-white/60">Giorni</div>
            </div>
            <div className="text-xl text-white/40">:</div>
            <div>
              <div className="text-xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-xs text-white/60">Ore</div>
            </div>
            <div className="text-xl text-white/40">:</div>
            <div>
              <div className="text-xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-xs text-white/60">Min</div>
            </div>
          </div>
        </div>
      )}

      {/* Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <span className="text-white/60 text-sm">Punti</span>
          {isEditing ? (
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value))}
              className="block w-full bg-transparent border border-white/20 rounded px-2 py-1 text-white focus:outline-none focus:border-white/40"
            />
          ) : (
            <p className="text-white font-bold">{challenge.points}</p>
          )}
        </div>
        <div>
          <span className="text-white/60 text-sm">Inizio</span>
          {isEditing ? (
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full bg-transparent border border-white/20 rounded px-2 py-1 text-white focus:outline-none focus:border-white/40"
            />
          ) : (
            <p className="text-white font-bold">
              {new Date(challenge.start_date).toLocaleDateString('it-IT')}
            </p>
          )}
        </div>
        <div>
          <span className="text-white/60 text-sm">Fine</span>
          {isEditing ? (
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full bg-transparent border border-white/20 rounded px-2 py-1 text-white focus:outline-none focus:border-white/40"
            />
          ) : (
            <p className="text-white font-bold">
              {new Date(challenge.end_date).toLocaleDateString('it-IT')}
            </p>
          )}
        </div>
        <div>
          <span className="text-white/60 text-sm">Luogo</span>
          {isEditing ? (
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="block w-full bg-transparent border border-white/20 rounded px-2 py-1 text-white focus:outline-none focus:border-white/40"
            />
          ) : (
            <p className="text-white font-bold">{challenge.location || 'Da definire'}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <span className="text-white/60 text-sm">Descrizione</span>
        {isEditing ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="block w-full bg-transparent border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-white/40 mt-1"
          />
        ) : (
          <p className="text-white mt-1">{challenge.description}</p>
        )}
      </div>

      {/* Instructions */}
      <div>
        <span className="text-white/60 text-sm">Istruzioni</span>
        {isEditing ? (
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
            className="block w-full bg-transparent border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-white/40 mt-1"
          />
        ) : (
          <p className="text-white mt-1">{challenge.instructions || 'Nessuna istruzione'}</p>
        )}
      </div>

      {/* Clues */}
      <div>
        <h3 className="text-lg font-bold text-white mb-3">🔍 Indizi</h3>
        <div className="space-y-2 mb-3">
          {clues.map((clue) => (
            <div key={clue.id} className="flex items-center justify-between bg-black/30 border border-white/10 rounded p-3">
              <div>
                <span className="text-white/60 text-sm">Indizio #{clue.clue_number}</span>
                <p className="text-white">{clue.clue_text}</p>
                {clue.revealed_date && (
                  <span className="text-xs text-green-400">
                    Rivelato: {new Date(clue.revealed_date).toLocaleString('it-IT')}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDeleteClue(clue.id)}
                className="text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newClueText}
            onChange={(e) => setNewClueText(e.target.value)}
            placeholder="Nuovo indizio..."
            className="flex-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-white/40"
          />
          <button
            onClick={handleAddClue}
            className="px-4 py-2 bg-white text-black rounded hover:bg-white/90 transition"
          >
            Aggiungi
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="px-6 py-2 bg-white text-black rounded hover:bg-white/90 transition font-medium"
            >
              Salva
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border border-white/20 text-white rounded hover:bg-white/10 transition"
            >
              Annulla
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 border border-white/20 text-white rounded hover:bg-white/10 transition"
          >
            Modifica
          </button>
        )}
      </div>
    </div>
  )
}
