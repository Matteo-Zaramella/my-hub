'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface GamePhase {
  id: number
  phase_number: number
  phase_name: string
  description: string
  start_date: string
  end_date: string
  is_active: boolean
}

export default function GamePhasesTab() {
  const [phases, setPhases] = useState<GamePhase[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadPhases()
  }, [])

  async function loadPhases() {
    const { data, error } = await supabase
      .from('game_phases')
      .select('*')
      .order('phase_number')

    if (error) {
      console.error('Error loading phases:', error)
      return
    }

    setPhases(data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white/60">Caricamento fasi...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">🎯 Fasi del Gioco</h2>
        <p className="text-white/60">
          Il gioco è strutturato in 6 fasi principali, dalla registrazione iniziale fino alla festa finale con la caccia alla valigetta.
        </p>
      </div>

      {/* Timeline delle Fasi */}
      <div className="space-y-4">
        {phases.map((phase, index) => {
          const isFirst = index === 0
          const isLast = index === phases.length - 1

          // Determina il colore in base alla fase
          const getPhaseColor = (phaseNum: number) => {
            switch(phaseNum) {
              case 0: return 'blue'
              case 1: return 'green'
              case 2: return 'yellow'
              case 3: return 'orange'
              case 4: return 'red'
              case 5: return 'purple'
              default: return 'gray'
            }
          }

          const color = getPhaseColor(phase.phase_number)

          return (
            <div key={phase.id} className="relative">
              {/* Linea di connessione */}
              {!isLast && (
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-white/10" />
              )}

              {/* Card Fase */}
              <div className={`bg-${color}-500/5 border border-${color}-500/20 rounded-xl p-6 relative`}>
                {/* Numero Fase */}
                <div className={`absolute -left-3 top-6 w-12 h-12 bg-${color}-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                  {phase.phase_number}
                </div>

                {/* Contenuto */}
                <div className="ml-12">
                  {/* Titolo */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">{phase.phase_name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-white/60">
                        <span>
                          📅 {new Date(phase.start_date).toLocaleDateString('it-IT', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span>→</span>
                        <span>
                          {new Date(phase.end_date).toLocaleDateString('it-IT', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Badge Status */}
                    {phase.is_active && (
                      <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-xs font-semibold">
                        ● ATTIVA
                      </span>
                    )}
                  </div>

                  {/* Descrizione */}
                  <p className="text-white/80 leading-relaxed whitespace-pre-line">
                    {phase.description}
                  </p>

                  {/* Info Extra per Fase Specifica */}
                  {phase.phase_number === 1 && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">🎵 Dettagli Serata</h4>
                      <ul className="text-sm text-white/70 space-y-1">
                        <li>• 21:00-23:30: Musica e socializzazione</li>
                        <li>• 23:30-00:00: Ricerca indizi (silenzio)</li>
                        <li>• 00:00: Countdown finisce - Rivelazione gioco</li>
                        <li>• 00:00-00:30: Presentazione e chiusura</li>
                      </ul>
                    </div>
                  )}

                  {phase.phase_number === 2 && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">🏆 Sistema Punteggi</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-white/60 mb-1">Indizi:</p>
                          <p className="text-white/80">1°: 50pt | 2°: 40pt | 3°-4°: 30pt</p>
                          <p className="text-white/80">5°: 10pt | 6°: 5pt | 7°+: 1pt</p>
                        </div>
                        <div>
                          <p className="text-white/60 mb-1">Sfide:</p>
                          <p className="text-white/80">1°: 500pt | 2°: 400pt | 3°: 300pt</p>
                          <p className="text-white/80">4°: 200pt | 5°: 100pt | 6°: 50pt</p>
                          <p className="text-white/80">7°: 10pt | 8°: 5pt | 9°+: 1pt</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {phase.phase_number === 3 && (
                    <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <h4 className="text-orange-300 font-semibold mb-2">🎊 Rivelazione Classifica</h4>
                      <p className="text-white/80 text-sm">
                        Ad <strong>Agosto 2026</strong> la classifica diventa pubblica per la prima volta!
                        Fino ad ora i punteggi sono rimasti segreti.
                      </p>
                    </div>
                  )}

                  {phase.phase_number === 5 && (
                    <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <h4 className="text-purple-300 font-semibold mb-3">💼 Plot Twist: La Valigetta</h4>
                      <div className="flex gap-4 items-start">
                        <div className="flex-1">
                          <p className="text-white/80 text-sm mb-2">
                            Il vincitore riceve una valigetta durante la festa... ma è <strong>VUOTA</strong>! 🤯
                          </p>
                          <p className="text-white/80 text-sm mb-2">
                            Dentro troverà solo l'immagine di <strong>Ezekiel</strong> (da "A tutto Reality") che tiene in mano la valigetta - un riferimento all'episodio dove perde il montepremi! 😅
                          </p>
                          <p className="text-white/80 text-sm">
                            Quando la apre, viene annunciata la <strong>Caccia alla Valigetta Vera</strong> nascosta nella location.
                            Chi la trova vince i <strong className="text-yellow-400">€1.000</strong>!
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <img
                            src="/ezekiel-valigetta.png"
                            alt="Ezekiel con valigetta"
                            className="w-32 h-32 object-contain rounded-lg bg-white/5 p-2"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">📌 Note Importanti</h3>
        <ul className="space-y-2 text-sm text-white/70">
          <li>• <strong className="text-white">Modificare dati dopo registrazione:</strong> -5 punti di penalità</li>
          <li>• <strong className="text-white">Classifica segreta</strong> fino ad Agosto 2026</li>
          <li>• <strong className="text-white">Montepremi:</strong> €1.000 (rivelato solo alla presentazione)</li>
          <li>• <strong className="text-white">Location Apertura:</strong> Fenice Green Energy Park (indizio nello sfondo registrazione)</li>
        </ul>
      </div>
    </div>
  )
}
