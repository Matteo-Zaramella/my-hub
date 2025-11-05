'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface EsercizioPreset {
  nome: string
  serie: string
  ripetizioni: string
}

const SCHEDE_PRESET = {
  A: [
    { nome: 'Riscaldamento - Extrarotazione Manubri', serie: '3', ripetizioni: '15-12-12' },
    { nome: 'Croci Panca 30°', serie: '3', ripetizioni: '10' },
    { nome: 'Distensioni Panca Piana', serie: '4', ripetizioni: '10-8-6-4' },
    { nome: 'Tricipiti 2 Manubri', serie: '3', ripetizioni: '10' },
    { nome: 'Tricipiti Bilan Panca 30° alla nuca', serie: '4', ripetizioni: '10-8-6-6' },
    { nome: 'Pausa + Bike', serie: '1', ripetizioni: '3min' },
    { nome: 'Leg Extension', serie: '3', ripetizioni: '15-12-10' },
    { nome: 'Affondi Due Manubri Singoli', serie: '4', ripetizioni: '12-10-8-8' },
    { nome: 'Crunch', serie: '3', ripetizioni: '30' },
    { nome: 'Stretching', serie: '1', ripetizioni: '-' },
  ],
  B: [
    { nome: 'Riscaldamento - Extrarotazione Manubri', serie: '3', ripetizioni: '15' },
    { nome: 'Bicipiti Man. Alter. Rotaz. Compl.', serie: '3', ripetizioni: '10' },
    { nome: 'Bicipiti Bilanciere', serie: '4', ripetizioni: '10-8-6-6' },
    { nome: 'Pull Over Bilanc - Presa Inv.', serie: '3', ripetizioni: '12' },
    { nome: 'Lat Machine Trazibar', serie: '4', ripetizioni: '12-10-8-8' },
    { nome: 'Alzate Frontali Bilanciere', serie: '3', ripetizioni: '12' },
    { nome: 'Lento Manubri con Rotazione', serie: '4', ripetizioni: '12-10-8-15' },
    { nome: 'Ginoc. Alpetto alle Parallele', serie: '3', ripetizioni: '30' },
    { nome: 'Stretching', serie: '1', ripetizioni: '-' },
  ],
  C: [
    { nome: 'Run', serie: '1', ripetizioni: '5min' },
    { nome: 'Top', serie: '1', ripetizioni: '3min' },
    { nome: 'Distensioni Panca Alta', serie: '4', ripetizioni: '8-10' },
    { nome: 'Trazioni (con Aiuto)', serie: '4', ripetizioni: 'MAX' },
    { nome: 'Pausa', serie: '1', ripetizioni: '-' },
    { nome: 'Squat', serie: '4', ripetizioni: '10-8' },
    { nome: 'Hyperxtension', serie: '3', ripetizioni: '20' },
    { nome: 'Crunch Doppio', serie: '3', ripetizioni: '25' },
    { nome: 'Stretching', serie: '1', ripetizioni: '-' },
  ],
}

interface EsercizioConPeso extends EsercizioPreset {
  pesi: number[]
}

export default function WorkoutSessionForm() {
  const today = new Date().toISOString().split('T')[0]

  const [data, setData] = useState(today)
  const [tipoScheda, setTipoScheda] = useState<'A' | 'B' | 'C'>('A')
  const [eserciziConPeso, setEserciziConPeso] = useState<EsercizioConPeso[]>([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const supabase = createClient()

  const hasPesiCrescenti = (ripetizioni: string) => {
    return ripetizioni.includes('-') && !ripetizioni.includes('x')
  }

  const nonUsaPeso = (nome: string, ripetizioni: string) => {
    const nomeLC = nome.toLowerCase()
    return nomeLC.includes('pausa') ||
           nomeLC.includes('stretching') ||
           nomeLC.includes('run') ||
           nomeLC.includes('bike') ||
           nomeLC.includes('top') ||
           ripetizioni.includes('min') ||
           ripetizioni === '-' ||
           ripetizioni === 'MAX'
  }

  const getLabelPeso = (nome: string, ripetizioni: string) => {
    if (ripetizioni.includes('min')) return 'Durata (min):'
    if (ripetizioni === 'MAX') return 'Reps raggiunte:'
    if (ripetizioni === '-' || nome.toLowerCase().includes('pausa')) return 'Note:'
    return 'Peso (kg):'
  }

  const caricaScheda = (scheda: 'A' | 'B' | 'C') => {
    setTipoScheda(scheda)
    const eserciziPreset = SCHEDE_PRESET[scheda]
    setEserciziConPeso(eserciziPreset.map(ex => {
      const numSerie = parseInt(ex.serie)
      const pesiArray = hasPesiCrescenti(ex.ripetizioni) ? Array(numSerie).fill(0) : [0]
      return { ...ex, pesi: pesiArray }
    }))
  }

  const aggiornaPeso = (indexEsercizio: number, indexPeso: number, peso: number) => {
    const nuoviEsercizi = [...eserciziConPeso]
    nuoviEsercizi[indexEsercizio].pesi[indexPeso] = peso
    setEserciziConPeso(nuoviEsercizi)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('Devi essere loggato')
        setLoading(false)
        return
      }

      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert([
          {
            user_id: user.id,
            data,
            tipo_scheda: tipoScheda,
            note,
          },
        ])
        .select()
        .single()

      if (sessionError) {
        setError(sessionError.message)
        setLoading(false)
        return
      }

      const eserciziDaInserire = eserciziConPeso.flatMap((ex) => {
        if (hasPesiCrescenti(ex.ripetizioni)) {
          const repsArray = ex.ripetizioni.split('-')
          return ex.pesi.map((peso, idx) => ({
            workout_session_id: session.id,
            nome: ex.nome,
            serie: `${idx + 1}`,
            ripetizioni: repsArray[idx] || repsArray[0],
            peso: peso,
          }))
        } else {
          return [{
            workout_session_id: session.id,
            nome: ex.nome,
            serie: ex.serie,
            ripetizioni: ex.ripetizioni,
            peso: ex.pesi[0],
          }]
        }
      })

      const { error: exercisesError } = await supabase
        .from('workout_exercises')
        .insert(eserciziDaInserire)

      if (exercisesError) {
        setError(exercisesError.message)
        setLoading(false)
      } else {
        setData(today)
        setTipoScheda('A')
        setEserciziConPeso([])
        setNote('')
        setLoading(false)
        router.refresh()
      }
    } catch (err) {
      setError('Errore durante il salvataggio')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📅 Data
        </label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🏋️ Tipo Scheda
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['A', 'B', 'C'] as const).map((scheda) => (
            <button
              key={scheda}
              type="button"
              onClick={() => caricaScheda(scheda)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition ${
                tipoScheda === scheda
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Scheda {scheda}
            </button>
          ))}
        </div>
      </div>

      {eserciziConPeso.length === 0 && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-xs font-medium text-gray-700 mb-1">📋 Seleziona una scheda:</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Clicca su una delle schede sopra per visualizzare gli esercizi
          </p>
        </div>
      )}

      {eserciziConPeso.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            📋 Esercizi - Scheda {tipoScheda} ({eserciziConPeso.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {eserciziConPeso.map((ex, idx) => {
              const usaPesiCrescenti = hasPesiCrescenti(ex.ripetizioni)
              const repsArray = usaPesiCrescenti ? ex.ripetizioni.split('-') : []

              return (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-gray-800">{ex.nome}</span>
                    <span className="text-xs text-gray-600">
                      {ex.serie} serie × {ex.ripetizioni} reps
                    </span>
                  </div>

                  {usaPesiCrescenti ? (
                    <div className="space-y-1">
                      {ex.pesi.map((peso, pesoIdx) => (
                        <div key={pesoIdx} className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 w-24">
                            Serie {pesoIdx + 1} ({repsArray[pesoIdx]} reps):
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={peso}
                            onChange={(e) => aggiornaPeso(idx, pesoIdx, parseFloat(e.target.value) || 0)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-xs"
                            placeholder="0"
                          />
                          <span className="text-xs text-gray-500 w-8">kg</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-600 whitespace-nowrap">
                        {getLabelPeso(ex.nome, ex.ripetizioni)}
                      </label>
                      <input
                        type={nonUsaPeso(ex.nome, ex.ripetizioni) ? 'text' : 'number'}
                        min="0"
                        step="0.5"
                        value={ex.pesi[0]}
                        onChange={(e) => aggiornaPeso(idx, 0, parseFloat(e.target.value) || 0)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-xs"
                        placeholder={nonUsaPeso(ex.nome, ex.ripetizioni) ? '-' : '0'}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📝 Note (opzionale)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-sm"
          rows={3}
          placeholder="Aggiungi note sulla sessione..."
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || eserciziConPeso.length === 0}
        className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-md"
      >
        {loading ? 'Salvataggio...' : '✅ Registra Allenamento'}
      </button>
    </form>
  )
}
