'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface MealPreset {
  id: number
  meal_type: string
  day_type: string | null
  description: string
}

interface PastoFormProps {
  presets: MealPreset[]
}

export default function PastoForm({ presets }: PastoFormProps) {
  const today = new Date().toISOString().split('T')[0]

  const [data, setData] = useState(today)
  const [tipoPasto, setTipoPasto] = useState('colazione')
  const [tipoGiorno, setTipoGiorno] = useState<'allenamento' | 'riposo'>('allenamento')
  const [usaManuale, setUsaManuale] = useState(false)
  const [descrizioneManuale, setDescrizioneManuale] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const supabase = createClient()

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

      let descrizione = ''

      if (usaManuale) {
        descrizione = descrizioneManuale
      } else {
        // Find preset from database
        const needsDayType = ['colazione', 'pranzo', 'cena'].includes(tipoPasto)
        const matchingPreset = presets.find(p =>
          p.meal_type === tipoPasto &&
          (!needsDayType || p.day_type === tipoGiorno)
        )

        if (matchingPreset) {
          descrizione = matchingPreset.description
        } else {
          setError('Nessun preset configurato per questo pasto. Vai su "Gestisci Preset" o usa modalità Manuale.')
          setLoading(false)
          return
        }
      }

      if (!descrizione) {
        setError('Inserisci una descrizione')
        setLoading(false)
        return
      }

      const { error: insertError } = await supabase
        .from('pasti')
        .insert([
          {
            user_id: user.id,
            data,
            tipo_pasto: tipoPasto,
            descrizione,
          },
        ])

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
      } else {
        // Reset form
        setDescrizioneManuale('')
        setData(today)
        setTipoPasto('colazione')
        setTipoGiorno('allenamento')
        setUsaManuale(false)
        setLoading(false)

        // Refresh page
        router.refresh()
      }
    } catch (err) {
      setError('Errore durante il salvataggio')
      setLoading(false)
    }
  }

  // Get preview of selected preset
  const getAnteprimaPasto = () => {
    const needsDayType = ['colazione', 'pranzo', 'cena'].includes(tipoPasto)
    const matchingPreset = presets.find(p =>
      p.meal_type === tipoPasto &&
      (!needsDayType || p.day_type === tipoGiorno)
    )

    if (matchingPreset) {
      return matchingPreset.description
    }

    return 'Nessun preset configurato. Configura i preset o usa modalità Manuale.'
  }

  const mostraSelezioneTipoGiorno = ['colazione', 'pranzo', 'cena'].includes(tipoPasto)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Data */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📅 Data
        </label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 text-sm"
          required
        />
      </div>

      {/* Tipo Pasto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🍽️ Tipo Pasto
        </label>
        <select
          value={tipoPasto}
          onChange={(e) => setTipoPasto(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 text-sm"
        >
          <option value="colazione">☕ Colazione</option>
          <option value="spuntino_mattina">🍎 Spuntino Mattina</option>
          <option value="pranzo">🍝 Pranzo</option>
          <option value="spuntino_pomeriggio">🥨 Spuntino Pomeriggio</option>
          <option value="cena">🍖 Cena</option>
          <option value="snack">🍪 Snack</option>
          <option value="pizza">🍕 Pizza</option>
        </select>
      </div>

      {/* Tipo Giorno */}
      {mostraSelezioneTipoGiorno && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            💪 Tipo Giorno
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTipoGiorno('allenamento')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition ${
                tipoGiorno === 'allenamento'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🏃 Allenamento
            </button>
            <button
              type="button"
              onClick={() => setTipoGiorno('riposo')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition ${
                tipoGiorno === 'riposo'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              💤 Riposo
            </button>
          </div>
        </div>
      )}

      {/* Toggle Auto/Manuale */}
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={() => setUsaManuale(false)}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
            !usaManuale
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ✨ Auto
        </button>
        <button
          type="button"
          onClick={() => setUsaManuale(true)}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
            usaManuale
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ✏️ Manuale
        </button>
      </div>

      {/* Preview or Manual Input */}
      {!usaManuale ? (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-xs font-medium text-gray-700 mb-1">📋 Pasto Automatico:</p>
          <p className="text-xs text-gray-600 leading-relaxed">{getAnteprimaPasto()}</p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ✏️ Descrizione Manuale
          </label>
          <textarea
            value={descrizioneManuale}
            onChange={(e) => setDescrizioneManuale(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 text-sm"
            rows={3}
            required={usaManuale}
            placeholder="Descrivi cosa hai mangiato..."
          />
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition disabled:opacity-50 font-medium text-sm shadow-md"
      >
        {loading ? 'Salvataggio...' : '✅ Registra Pasto'}
      </button>
    </form>
  )
}
