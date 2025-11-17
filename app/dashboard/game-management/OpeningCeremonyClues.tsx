'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ClueRiddle {
  id: number
  clue_word: string
  riddle: string | null
  location_hint: string | null
  physical_location: string | null
  order_number: number
}

export default function OpeningCeremonyClues() {
  const supabase = createClient()
  const [clueRiddles, setClueRiddles] = useState<ClueRiddle[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editClueWord, setEditClueWord] = useState('')
  const [editRiddle, setEditRiddle] = useState('')
  const [editLocationHint, setEditLocationHint] = useState('')
  const [editPhysicalLocation, setEditPhysicalLocation] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [ceremonyDate] = useState('2026-01-24T00:00:00')
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Load clues from database
  useEffect(() => {
    loadClues()
  }, [])

  async function loadClues() {
    setLoading(true)
    const { data, error } = await supabase
      .from('ceremony_clue_riddles')
      .select('*')
      .order('order_number')

    if (error) {
      console.error('Error loading clues:', error)
    } else if (data) {
      setClueRiddles(data)
    }
    setLoading(false)
  }

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

  const handleEdit = (clue: ClueRiddle) => {
    setEditingId(clue.id)
    setEditClueWord(clue.clue_word)
    setEditRiddle(clue.riddle || '')
    setEditLocationHint(clue.location_hint || '')
    setEditPhysicalLocation(clue.physical_location || '')
  }

  const handleSave = async (id: number) => {
    // Validazione: la parola deve essere un anagramma di EVOLUZIONE
    const wordUpper = editClueWord.trim().toUpperCase()
    if (!isAnagramOfEvoluzione(wordUpper)) {
      alert('❌ Errore: La parola deve essere un anagramma di EVOLUZIONE!\n\nLettere disponibili: E, V, O, L, U, Z, I, O, N, E')
      return
    }

    setSaving(true)
    const { error } = await supabase
      .from('ceremony_clue_riddles')
      .update({
        clue_word: wordUpper,
        riddle: editRiddle.trim() || null,
        location_hint: editLocationHint.trim() || null,
        physical_location: editPhysicalLocation.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Error saving riddle:', error)
      alert('Errore nel salvataggio: ' + error.message)
    } else {
      await loadClues()
      setEditingId(null)
    }
    setSaving(false)
  }

  // Verifica se una parola è un anagramma di EVOLUZIONE
  function isAnagramOfEvoluzione(word: string): boolean {
    const evoluzione = 'EVOLUZIONE'.split('').sort().join('')
    const input = word.split('').sort().join('')
    return evoluzione === input
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditClueWord('')
    setEditRiddle('')
    setEditLocationHint('')
    setEditPhysicalLocation('')
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

      {/* Final Password */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2">🔐 Password Finale</h3>
        <div className="bg-black/30 rounded-lg p-4 inline-block">
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            EVOLUZIONE
          </span>
        </div>
        <p className="text-sm text-white/60 mt-3">
          Le prime lettere dei 10 indizi formano questa password. Chi la indovina riceve <span className="text-green-400 font-bold">+100 punti</span> e accede all'area di gioco
        </p>
      </div>

      {/* Clues List */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white">🔍 Indizi e Indovinelli (10 totali)</h3>
          <p className="text-sm text-white/60 mt-1">
            Scrivi gli indovinelli in rima che indicheranno ai partecipanti dove trovare gli indizi fisici durante la festa. Le prime lettere formano EVOLUZIONE!
          </p>
        </div>

        {loading ? (
          <div className="text-center text-white/60 py-8">Caricamento...</div>
        ) : (
          <div className="space-y-4">
            {clueRiddles.map((clue) => (
              <div key={clue.id} className="bg-black/30 border border-white/10 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-white/60 font-mono">#{clue.order_number}</span>
                    <span className="text-white font-bold text-lg">{clue.clue_word}</span>
                  </div>
                  {editingId === clue.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(clue.id)}
                        disabled={saving}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm disabled:opacity-50"
                      >
                        {saving ? 'Salvataggio...' : '✓ Salva'}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm disabled:opacity-50"
                      >
                        ✕ Annulla
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(clue)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                    >
                      ✏️ Modifica
                    </button>
                  )}
                </div>

                {editingId === clue.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-white/60 block mb-1">
                        🔤 Parola Indizio (deve essere un anagramma di EVOLUZIONE)
                      </label>
                      <input
                        type="text"
                        value={editClueWord}
                        onChange={(e) => setEditClueWord(e.target.value.toUpperCase())}
                        placeholder="es: ENTOMOLOGIA"
                        className="w-full bg-transparent border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-white/40 font-mono text-lg"
                      />
                      <div className="text-xs text-white/40 mt-1">
                        💡 Lettere disponibili: E, V, O, L, U, Z, I, O, N, E
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-white/60 block mb-1">
                        📜 Indovinello in Rima (max 500 caratteri)
                      </label>
                      <textarea
                        value={editRiddle}
                        onChange={(e) => setEditRiddle(e.target.value.slice(0, 500))}
                        placeholder="Scrivi qui l'indovinello in rima che indicherà dove trovare questo indizio..."
                        className="w-full bg-transparent border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-white/40 min-h-[100px]"
                      />
                      <div className="text-xs text-white/40 mt-1 text-right">
                        {editRiddle.length}/500 caratteri
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-white/60 block mb-1">
                        💡 Hint Aggiuntivo (opzionale)
                      </label>
                      <input
                        type="text"
                        value={editLocationHint}
                        onChange={(e) => setEditLocationHint(e.target.value)}
                        placeholder="Un hint extra se l'indovinello è troppo difficile"
                        className="w-full bg-transparent border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-white/40"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/60 block mb-1">
                        📍 Posizione Fisica (nota privata per te)
                      </label>
                      <input
                        type="text"
                        value={editPhysicalLocation}
                        onChange={(e) => setEditPhysicalLocation(e.target.value)}
                        placeholder="es: Dietro il bancone, sotto il tavolo 3, ecc."
                        className="w-full bg-transparent border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-white/40"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-white/60 block mb-1">📜 Indovinello:</span>
                      {clue.riddle ? (
                        <p className="text-white text-sm whitespace-pre-wrap bg-black/30 rounded p-3 border border-white/5">
                          {clue.riddle}
                        </p>
                      ) : (
                        <p className="text-white/40 italic text-sm">Nessun indovinello inserito</p>
                      )}
                    </div>
                    {clue.location_hint && (
                      <div>
                        <span className="text-xs text-white/60 block mb-1">💡 Hint:</span>
                        <p className="text-white/80 text-sm">{clue.location_hint}</p>
                      </div>
                    )}
                    {clue.physical_location && (
                      <div>
                        <span className="text-xs text-white/60 block mb-1">📍 Posizione fisica:</span>
                        <p className="text-white/60 text-sm italic">{clue.physical_location}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 space-y-2 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-xs text-blue-300">
            ℹ️ <span className="font-bold">Come funziona:</span>
          </p>
          <ul className="text-xs text-blue-200/80 space-y-1 ml-4">
            <li>• Gli indovinelli saranno visibili ai partecipanti durante la festa</li>
            <li>• Ogni indovinello indica dove trovare fisicamente l'indizio</li>
            <li>• I partecipanti inseriscono la parola trovata nell'app</li>
            <li>• Le prime lettere delle 10 parole formano "EVOLUZIONE"</li>
            <li>• Chi indovina "EVOLUZIONE" riceve +100 punti</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
