'use client'

import { useState, useEffect } from 'react'

interface ClueData {
  solution: string
  instagramHint: string
}

export default function OpeningCeremonyClues() {
  const [clues, setClues] = useState<ClueData[]>([
    { solution: 'indizio1', instagramHint: '' },
    { solution: 'indizio2', instagramHint: '' },
    { solution: 'indizio3', instagramHint: '' },
    { solution: 'indizio4', instagramHint: '' },
    { solution: 'indizio5', instagramHint: '' },
    { solution: 'indizio6', instagramHint: '' },
    { solution: 'indizio7', instagramHint: '' },
    { solution: 'indizio8', instagramHint: '' },
    { solution: 'indizio9', instagramHint: '' },
    { solution: 'indizio10', instagramHint: '' },
  ])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editSolution, setEditSolution] = useState('')
  const [editInstagramHint, setEditInstagramHint] = useState('')
  const [ceremonyDate] = useState('2026-01-24T00:00:00')
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Load clues from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ceremonyClues')
    if (saved) {
      setClues(JSON.parse(saved))
    }
  }, [])

  // Countdown
  useEffect(() => {
    const targetDate = new Date(ceremonyDate).getTime()

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
  }, [ceremonyDate])

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditSolution(clues[index].solution)
    setEditInstagramHint(clues[index].instagramHint)
  }

  const handleSave = (index: number) => {
    const newClues = [...clues]
    newClues[index] = {
      solution: editSolution,
      instagramHint: editInstagramHint,
    }
    setClues(newClues)
    localStorage.setItem('ceremonyClues', JSON.stringify(newClues))
    setEditingIndex(null)
  }

  const handleCancel = () => {
    setEditingIndex(null)
    setEditSolution('')
    setEditInstagramHint('')
  }

  return (
    <div className="space-y-6">
      {/* Countdown */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">⏰ Tempo Rimanente</h3>
        <div className="flex gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-white">{String(timeLeft.days).padStart(3, '0')}</div>
            <div className="text-xs text-white/60 mt-1">Giorni</div>
          </div>
          <div className="text-3xl text-white/40">:</div>
          <div>
            <div className="text-3xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-xs text-white/60 mt-1">Ore</div>
          </div>
          <div className="text-3xl text-white/40">:</div>
          <div>
            <div className="text-3xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-xs text-white/60 mt-1">Min</div>
          </div>
          <div className="text-3xl text-white/40">:</div>
          <div>
            <div className="text-3xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-xs text-white/60 mt-1">Sec</div>
          </div>
        </div>
        <p className="text-sm text-white/60 mt-4">
          Data evento: {new Date(ceremonyDate).toLocaleString('it-IT')}
        </p>
      </div>

      {/* Clues List */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white">🔍 Indizi (10 totali)</h3>
          <p className="text-sm text-white/60 mt-1">
            Se tutti i 10 indizi vengono trovati durante la festa, ogni partecipante ottiene <span className="text-green-400 font-bold">+50 punti bonus</span>!
          </p>
        </div>
        <div className="space-y-4">
          {clues.map((clue, index) => (
            <div key={index} className="bg-black/30 border border-white/10 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-white/60 font-mono">#{index + 1}</span>
                  {editingIndex === index ? (
                    <div className="flex-1 space-y-2">
                      <div>
                        <label className="text-xs text-white/60 block mb-1">Soluzione (risposta esatta)</label>
                        <input
                          type="text"
                          value={editSolution}
                          onChange={(e) => setEditSolution(e.target.value)}
                          placeholder="es: PAROLA"
                          className="w-full bg-transparent border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-white/40"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/60 block mb-1">Frase per storia Instagram (emergenza)</label>
                        <input
                          type="text"
                          value={editInstagramHint}
                          onChange={(e) => setEditInstagramHint(e.target.value)}
                          placeholder="es: Trova la parola nascosta nel giardino..."
                          className="w-full bg-transparent border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-white/40"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="mb-1">
                        <span className="text-xs text-white/60">Soluzione:</span>
                        <span className="text-white font-mono ml-2">{clue.solution}</span>
                      </div>
                      {clue.instagramHint && (
                        <div>
                          <span className="text-xs text-white/60">Storia Instagram:</span>
                          <span className="text-white/80 text-sm ml-2 italic">{clue.instagramHint}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingIndex === index ? (
                    <>
                      <button
                        onClick={() => handleSave(index)}
                        className="px-4 py-2 bg-white text-black rounded hover:bg-white/90 transition text-sm"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 border border-white/20 text-white rounded hover:bg-white/10 transition text-sm"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(index)}
                      className="px-4 py-2 border border-white/20 text-white rounded hover:bg-white/10 transition text-sm"
                    >
                      Modifica
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-xs text-white/60">
            ℹ️ <span className="font-bold">Soluzione:</span> La parola esatta che i partecipanti devono inserire (case-sensitive)
          </p>
          <p className="text-xs text-white/60">
            📱 <span className="font-bold">Storia Instagram:</span> Indovinello/frase da pubblicare nelle storie se i partecipanti non trovano gli indizi durante la festa
          </p>
          <p className="text-xs text-green-400/80">
            🎁 <span className="font-bold">Bonus:</span> Se tutti i 10 indizi vengono completati durante la festa, ogni partecipante riceve +50 punti
          </p>
        </div>
      </div>
    </div>
  )
}
