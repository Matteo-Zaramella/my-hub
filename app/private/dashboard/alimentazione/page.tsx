'use client'

import { useState, useEffect } from 'react'
import {
  menu21Giorni,
  getGiornoCiclo,
  getMenuOggi,
  getPastoCorrente,
  getProssimoPasto,
  CYCLE_START_DATE,
  type GiornoMenu,
  type Pasto
} from './menuData'

export default function AlimentazionePage() {
  const [now, setNow] = useState(new Date())
  const [menuOggi, setMenuOggi] = useState<GiornoMenu | null>(null)
  const [pastoCorrente, setPastoCorrente] = useState<Pasto | null>(null)
  const [prossimoPasto, setProssimoPasto] = useState<Pasto | null>(null)
  const [giornoCiclo, setGiornoCiclo] = useState(1)
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'oggi' | 'settimana' | 'ciclo'>('oggi')

  // Aggiorna ogni minuto
  useEffect(() => {
    const updateData = () => {
      const data = new Date()
      setNow(data)
      setGiornoCiclo(getGiornoCiclo(data))
      setMenuOggi(getMenuOggi(data))
      setPastoCorrente(getPastoCorrente(data))
      setProssimoPasto(getProssimoPasto(data))
    }

    updateData()
    const interval = setInterval(updateData, 60000) // Aggiorna ogni minuto

    return () => clearInterval(interval)
  }, [])

  if (!menuOggi) return <div>Caricamento...</div>

  const formatOra = (date: Date) => {
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
  }

  const isPastoPassed = (pasto: Pasto) => {
    const ora = now.getHours() + now.getMinutes() / 60
    return ora >= pasto.oraFine
  }

  const isPastoActive = (pasto: Pasto) => {
    const ora = now.getHours() + now.getMinutes() / 60
    return ora >= pasto.oraInizio && ora < pasto.oraFine
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header con data e ora */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-light">Alimentazione</h1>
          <p className="text-white/40 text-sm mt-1">
            {now.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-light tabular-nums">{formatOra(now)}</div>
          <div className="text-white/40 text-sm">
            Giorno {giornoCiclo}/21 - S{menuOggi.settimana}
          </div>
        </div>
      </div>

      {/* Card Pasto Corrente */}
      <div className="border-2 border-emerald-500/50 bg-emerald-500/10 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-emerald-400 text-sm font-medium uppercase tracking-wider">
            {pastoCorrente ? 'Adesso' : prossimoPasto ? 'Prossimo pasto' : 'Pasti completati'}
          </span>
        </div>

        {pastoCorrente ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-medium">{pastoCorrente.nome}</h2>
              <span className="text-white/60">{pastoCorrente.orario}</span>
            </div>
            <div className="space-y-2">
              {pastoCorrente.alimenti.map((alimento, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-white/10 last:border-0">
                  <span className="text-white/90">{alimento.nome}</span>
                  <span className="text-emerald-400 font-medium">{alimento.quantita}</span>
                </div>
              ))}
            </div>
          </div>
        ) : prossimoPasto ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-medium">{prossimoPasto.nome}</h2>
              <span className="text-white/60">alle {prossimoPasto.orario}</span>
            </div>
            <div className="space-y-2">
              {prossimoPasto.alimenti.map((alimento, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-white/10 last:border-0">
                  <span className="text-white/90">{alimento.nome}</span>
                  <span className="text-white/60 font-medium">{alimento.quantita}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-white/60">Hai completato tutti i pasti di oggi!</p>
            <p className="text-white/40 text-sm mt-2">Il ciclo continua domani</p>
          </div>
        )}
      </div>

      {/* Info Giorno */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="border border-white/20 p-4 text-center">
          <div className="text-2xl font-light">{menuOggi.calorie}</div>
          <div className="text-white/40 text-sm">kcal</div>
        </div>
        <div className="border border-white/20 p-4 text-center">
          <div className="text-2xl font-light">{menuOggi.proteine}g</div>
          <div className="text-white/40 text-sm">Proteine</div>
        </div>
        <div className="border border-white/20 p-4 text-center">
          <div className={`text-2xl font-light ${menuOggi.tipo === 'allenamento' ? 'text-orange-400' : 'text-blue-400'}`}>
            {menuOggi.tipo === 'allenamento' ? `ALL ${menuOggi.allenamento}` : 'RIPOSO'}
          </div>
          <div className="text-white/40 text-sm">Tipo Giorno</div>
        </div>
        <div className="border border-white/20 p-4 text-center">
          <div className="text-2xl font-light">{menuOggi.pasti.length}</div>
          <div className="text-white/40 text-sm">Pasti</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode('oggi')}
          className={`px-4 py-2 text-sm transition ${viewMode === 'oggi' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
        >
          Oggi
        </button>
        <button
          onClick={() => setViewMode('settimana')}
          className={`px-4 py-2 text-sm transition ${viewMode === 'settimana' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
        >
          Settimana {menuOggi.settimana}
        </button>
        <button
          onClick={() => setViewMode('ciclo')}
          className={`px-4 py-2 text-sm transition ${viewMode === 'ciclo' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
        >
          Ciclo Completo
        </button>
      </div>

      {/* Vista Oggi */}
      {viewMode === 'oggi' && (
        <div className="space-y-2">
          <h2 className="text-lg font-light mb-4 text-white/60">
            {menuOggi.giornoSettimana} - Tutti i pasti
          </h2>
          {menuOggi.pasti.map((pasto) => {
            const isActive = isPastoActive(pasto)
            const isPassed = isPastoPassed(pasto)

            return (
              <div
                key={pasto.nome}
                className={`border transition-all ${
                  isActive
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : isPassed
                    ? 'border-white/10 opacity-50'
                    : 'border-white/20'
                }`}
              >
                <button
                  onClick={() => setExpandedMeal(expandedMeal === pasto.nome ? null : pasto.nome)}
                  className="w-full px-4 py-3 flex justify-between items-center hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-sm w-12 ${isActive ? 'text-emerald-400' : 'text-white/40'}`}>
                      {pasto.orario}
                    </span>
                    <span className={`font-medium ${isPassed ? 'line-through' : ''}`}>{pasto.nome}</span>
                    {isActive && (
                      <span className="bg-emerald-500 text-black text-xs px-2 py-0.5 rounded">ORA</span>
                    )}
                    {isPassed && (
                      <span className="text-white/30 text-xs">completato</span>
                    )}
                  </div>
                  <span className={`transition-transform ${expandedMeal === pasto.nome ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {expandedMeal === pasto.nome && (
                  <div className="border-t border-white/10 px-4 py-3">
                    <ul className="space-y-2">
                      {pasto.alimenti.map((alimento, idx) => (
                        <li key={idx} className="flex justify-between text-sm">
                          <span className="text-white/80">{alimento.nome}</span>
                          <span className={isActive ? 'text-emerald-400' : 'text-white/40'}>
                            {alimento.quantita}
                          </span>
                        </li>
                      ))}
                    </ul>
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
          {menu21Giorni
            .filter((g) => g.settimana === menuOggi.settimana)
            .map((giorno) => {
              const isToday = giorno.giorno === giornoCiclo

              return (
                <div
                  key={giorno.giorno}
                  className={`border p-4 ${
                    isToday ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/20'
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
                      <span
                        className={`text-sm ${
                          giorno.tipo === 'allenamento' ? 'text-orange-400' : 'text-blue-400'
                        }`}
                      >
                        {giorno.tipo === 'allenamento' ? `ALL ${giorno.allenamento}` : 'RIPOSO'}
                      </span>
                      <span className="text-white/40 text-sm">{giorno.calorie} kcal</span>
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
                {menu21Giorni
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
                            ? 'border-orange-500/30 bg-orange-500/5'
                            : 'border-white/20'
                        }`}
                      >
                        <div className="text-xs text-white/40">{giorno.giornoSettimana.slice(0, 3)}</div>
                        <div className={`text-lg ${isToday ? 'text-emerald-400' : ''}`}>{giorno.giorno}</div>
                        <div
                          className={`text-xs mt-1 ${
                            giorno.tipo === 'allenamento' ? 'text-orange-400' : 'text-blue-400'
                          }`}
                        >
                          {giorno.tipo === 'allenamento' ? giorno.allenamento : 'R'}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-white/10 text-center">
        <p className="text-white/30 text-xs">
          Ciclo iniziato: {CYCLE_START_DATE.toLocaleDateString('it-IT')} | Piano Definizione
        </p>
      </div>
    </div>
  )
}
