'use client'

import { useState, useEffect } from 'react'
import {
  ciclo21Giorni,
  getGiornoCiclo,
  getGiornoOggi,
  getSchedaOggi,
  getScheda,
  getProssimoAllenamento,
  getStatisticheCiclo,
  CYCLE_START_DATE,
  ORARIO_ALLENAMENTO,
  isOraAllenamento,
  type GiornoAllenamento,
  type Esercizio,
  type TipoScheda
} from './workoutData'

export default function PalestraPage() {
  const [now, setNow] = useState(new Date())
  const [giornoOggi, setGiornoOggi] = useState<GiornoAllenamento | null>(null)
  const [schedaOggi, setSchedaOggi] = useState<Esercizio[] | null>(null)
  const [giornoCiclo, setGiornoCiclo] = useState(1)
  const [isOraGym, setIsOraGym] = useState(false)
  const [expandedScheda, setExpandedScheda] = useState<TipoScheda | null>(null)
  const [viewMode, setViewMode] = useState<'oggi' | 'settimana' | 'ciclo'>('oggi')

  // Aggiorna ogni minuto
  useEffect(() => {
    const updateData = () => {
      const data = new Date()
      setNow(data)
      setGiornoCiclo(getGiornoCiclo(data))
      setGiornoOggi(getGiornoOggi(data))
      setSchedaOggi(getSchedaOggi(data))
      setIsOraGym(isOraAllenamento(data))
    }

    updateData()
    const interval = setInterval(updateData, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!giornoOggi) return <div>Caricamento...</div>

  const formatOra = (date: Date) => {
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
  }

  const prossimoAllenamento = getProssimoAllenamento(now)
  const statistiche = getStatisticheCiclo()
  const isSabato = giornoOggi.giornoSettimana === 'Sabato'
  const orarioGym = isSabato ? ORARIO_ALLENAMENTO.sabato : ORARIO_ALLENAMENTO.feriale

  const getSchedaColor = (scheda: TipoScheda) => {
    switch (scheda) {
      case 'A': return 'text-orange-400 border-orange-500/50 bg-orange-500/10'
      case 'B': return 'text-blue-400 border-blue-500/50 bg-blue-500/10'
      case 'C': return 'text-purple-400 border-purple-500/50 bg-purple-500/10'
      default: return 'text-white/40 border-white/20'
    }
  }

  const getSchedaBadgeColor = (scheda: TipoScheda) => {
    switch (scheda) {
      case 'A': return 'bg-orange-500 text-black'
      case 'B': return 'bg-blue-500 text-black'
      case 'C': return 'bg-purple-500 text-black'
      default: return 'bg-white/20 text-white'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header con data e ora */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-light">Palestra</h1>
          <p className="text-white/40 text-sm mt-1">
            {now.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-light tabular-nums">{formatOra(now)}</div>
          <div className="text-white/40 text-sm">
            Giorno {giornoCiclo}/21 - S{giornoOggi.settimana}
          </div>
        </div>
      </div>

      {/* Card Stato Allenamento */}
      <div className={`border-2 p-6 mb-6 ${
        giornoOggi.tipo === 'allenamento'
          ? isOraGym
            ? 'border-emerald-500/50 bg-emerald-500/10'
            : getSchedaColor(giornoOggi.scheda)
          : 'border-blue-500/30 bg-blue-500/5'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          {isOraGym && (
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          )}
          <span className={`text-sm font-medium uppercase tracking-wider ${
            isOraGym ? 'text-emerald-400' : giornoOggi.tipo === 'allenamento'
              ? giornoOggi.scheda === 'A' ? 'text-orange-400'
              : giornoOggi.scheda === 'B' ? 'text-blue-400'
              : 'text-purple-400'
              : 'text-blue-400'
          }`}>
            {isOraGym ? 'Ora di allenarsi!' : giornoOggi.tipo === 'allenamento' ? `Oggi: Scheda ${giornoOggi.scheda}` : 'Giorno di Riposo'}
          </span>
        </div>

        {giornoOggi.tipo === 'allenamento' && schedaOggi ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-medium">Scheda {giornoOggi.scheda}</h2>
              <span className="text-white/60">{orarioGym.inizio} - {orarioGym.fine}</span>
            </div>
            <div className="space-y-2">
              {schedaOggi.map((esercizio, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                  <span className="text-white/90">{esercizio.nome}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-white/40">{esercizio.serie}x{esercizio.ripetizioni}</span>
                    <span className={`font-medium ${
                      giornoOggi.scheda === 'A' ? 'text-orange-400'
                      : giornoOggi.scheda === 'B' ? 'text-blue-400'
                      : 'text-purple-400'
                    }`}>{esercizio.peso}</span>
                  </div>
                </div>
              ))}
            </div>
            {schedaOggi[0]?.note && (
              <p className="text-white/40 text-sm mt-4 italic">{schedaOggi[0].note}</p>
            )}
          </div>
        ) : (
          <div>
            <div className="text-center py-4">
              <p className="text-white/60 text-lg mb-2">Recupero muscolare</p>
              {prossimoAllenamento && (
                <p className="text-white/40 text-sm">
                  Prossimo allenamento: <span className={getSchedaBadgeColor(prossimoAllenamento.giorno.scheda) + ' px-2 py-0.5 rounded text-xs'}>
                    Scheda {prossimoAllenamento.giorno.scheda}
                  </span> tra {prossimoAllenamento.inGiorni} giorn{prossimoAllenamento.inGiorni === 1 ? 'o' : 'i'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Statistiche Ciclo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="border border-white/20 p-4 text-center">
          <div className="text-2xl font-light">{statistiche.totaleAllenamenti}</div>
          <div className="text-white/40 text-sm">Allenamenti/Ciclo</div>
        </div>
        <div className="border border-orange-500/30 p-4 text-center">
          <div className="text-2xl font-light text-orange-400">{statistiche.schedeA}x</div>
          <div className="text-white/40 text-sm">Scheda A</div>
        </div>
        <div className="border border-blue-500/30 p-4 text-center">
          <div className="text-2xl font-light text-blue-400">{statistiche.schedeB}x</div>
          <div className="text-white/40 text-sm">Scheda B</div>
        </div>
        <div className="border border-purple-500/30 p-4 text-center">
          <div className="text-2xl font-light text-purple-400">{statistiche.schedeC}x</div>
          <div className="text-white/40 text-sm">Scheda C</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode('oggi')}
          className={`px-4 py-2 text-sm transition ${viewMode === 'oggi' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
        >
          Schede
        </button>
        <button
          onClick={() => setViewMode('settimana')}
          className={`px-4 py-2 text-sm transition ${viewMode === 'settimana' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
        >
          Settimana {giornoOggi.settimana}
        </button>
        <button
          onClick={() => setViewMode('ciclo')}
          className={`px-4 py-2 text-sm transition ${viewMode === 'ciclo' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
        >
          Ciclo Completo
        </button>
      </div>

      {/* Vista Schede */}
      {viewMode === 'oggi' && (
        <div className="space-y-3">
          <h2 className="text-lg font-light mb-4 text-white/60">Le tue schede</h2>
          {(['A', 'B', 'C'] as TipoScheda[]).map((scheda) => {
            const esercizi = getScheda(scheda)
            const isActive = giornoOggi.scheda === scheda

            return (
              <div
                key={scheda}
                className={`border transition-all ${
                  isActive ? getSchedaColor(scheda) : 'border-white/20'
                }`}
              >
                <button
                  onClick={() => setExpandedScheda(expandedScheda === scheda ? null : scheda)}
                  className="w-full px-4 py-3 flex justify-between items-center hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-lg font-medium ${getSchedaBadgeColor(scheda)} px-3 py-1 rounded`}>
                      {scheda}
                    </span>
                    <span className="font-medium">Scheda {scheda}</span>
                    {isActive && (
                      <span className="bg-emerald-500 text-black text-xs px-2 py-0.5 rounded">OGGI</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white/40 text-sm">{esercizi.length} esercizi</span>
                    <span className={`transition-transform ${expandedScheda === scheda ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>

                {expandedScheda === scheda && (
                  <div className="border-t border-white/10 px-4 py-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-white/40">
                          <th className="text-left py-2">Esercizio</th>
                          <th className="text-center py-2">Serie</th>
                          <th className="text-center py-2">Reps</th>
                          <th className="text-right py-2">Peso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {esercizi.map((esercizio, idx) => (
                          <tr key={idx} className="border-t border-white/5">
                            <td className="py-2 text-white/80">{esercizio.nome}</td>
                            <td className="py-2 text-center text-white/60">{esercizio.serie}</td>
                            <td className="py-2 text-center text-white/60">{esercizio.ripetizioni}</td>
                            <td className={`py-2 text-right ${
                              scheda === 'A' ? 'text-orange-400'
                              : scheda === 'B' ? 'text-blue-400'
                              : 'text-purple-400'
                            }`}>{esercizio.peso}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Vista Settimana */}
      {viewMode === 'settimana' && (
        <div className="space-y-3">
          {ciclo21Giorni
            .filter((g) => g.settimana === giornoOggi.settimana)
            .map((giorno) => {
              const isToday = giorno.giorno === giornoCiclo

              return (
                <div
                  key={giorno.giorno}
                  className={`border p-4 ${
                    isToday
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : giorno.tipo === 'allenamento'
                      ? getSchedaColor(giorno.scheda).replace('text-', 'border-').split(' ')[0] + '/30'
                      : 'border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-white/40 text-sm w-8">G{giorno.giorno}</span>
                      <span className="font-medium">{giorno.giornoSettimana}</span>
                      {isToday && (
                        <span className="bg-emerald-500 text-black text-xs px-2 py-0.5 rounded">OGGI</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {giorno.tipo === 'allenamento' ? (
                        <span className={`text-sm px-2 py-1 rounded ${getSchedaBadgeColor(giorno.scheda)}`}>
                          Scheda {giorno.scheda}
                        </span>
                      ) : (
                        <span className="text-blue-400 text-sm">RIPOSO</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      )}

      {/* Vista Ciclo Completo */}
      {viewMode === 'ciclo' && (
        <div className="space-y-6">
          {[1, 2, 3].map((settimana) => (
            <div key={settimana}>
              <h3 className="text-white/60 text-sm mb-3">SETTIMANA {settimana}</h3>
              <div className="grid grid-cols-7 gap-2">
                {ciclo21Giorni
                  .filter((g) => g.settimana === settimana)
                  .map((giorno) => {
                    const isToday = giorno.giorno === giornoCiclo

                    return (
                      <div
                        key={giorno.giorno}
                        className={`border p-3 text-center ${
                          isToday
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : giorno.tipo === 'allenamento'
                            ? giorno.scheda === 'A'
                              ? 'border-orange-500/30 bg-orange-500/5'
                              : giorno.scheda === 'B'
                              ? 'border-blue-500/30 bg-blue-500/5'
                              : 'border-purple-500/30 bg-purple-500/5'
                            : 'border-white/20'
                        }`}
                      >
                        <div className="text-xs text-white/40">{giorno.giornoSettimana.slice(0, 3)}</div>
                        <div className={`text-lg ${isToday ? 'text-emerald-400' : ''}`}>{giorno.giorno}</div>
                        <div
                          className={`text-xs mt-1 font-medium ${
                            giorno.tipo === 'allenamento'
                              ? giorno.scheda === 'A'
                                ? 'text-orange-400'
                                : giorno.scheda === 'B'
                                ? 'text-blue-400'
                                : 'text-purple-400'
                              : 'text-white/30'
                          }`}
                        >
                          {giorno.tipo === 'allenamento' ? giorno.scheda : 'R'}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Orari */}
      <div className="mt-8 p-4 border border-white/10 bg-white/5">
        <h3 className="text-white/60 text-sm mb-3">ORARI ALLENAMENTO</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-white/40">Giorni feriali:</span>
            <span className="text-white ml-2">{ORARIO_ALLENAMENTO.feriale.inizio} - {ORARIO_ALLENAMENTO.feriale.fine}</span>
          </div>
          <div>
            <span className="text-white/40">Sabato:</span>
            <span className="text-white ml-2">{ORARIO_ALLENAMENTO.sabato.inizio} - {ORARIO_ALLENAMENTO.sabato.fine}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-white/10 text-center">
        <p className="text-white/30 text-xs">
          Ciclo iniziato: {CYCLE_START_DATE.toLocaleDateString('it-IT')} | Sincronizzato con Alimentazione
        </p>
        <p className="text-white/20 text-xs mt-1">
          Modifica workoutData.ts per inserire i tuoi esercizi
        </p>
      </div>
    </div>
  )
}
