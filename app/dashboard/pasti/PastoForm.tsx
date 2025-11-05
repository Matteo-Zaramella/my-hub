'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Pasti predefiniti basati sul piano nutrizionale
const PASTI_FISSI = {
  colazione: 'Caffè, banana 150g, uova e albumi 150g, pane 90g con cioccolato fondente 20g',
  colazione_integratori: 'Caffè, banana 150g, uova e albumi 150g, pane 90g con cioccolato fondente 20g + proteine 40g e creatina 10g',
  spuntino_mattina: 'Frutto 150g + yogurt greco',
  pranzo_allenamento: 'Carotine 100g, riso integrale 90g, pesce (sgombro/salmone) 150g, verdure miste 200g, olio EVO 2 cucchiai',
  pranzo_riposo: 'Carotine 100g, riso integrale 70g, legumi (fagioli/lenticchie) 200g cotti, verdure miste 200g, olio EVO 2 cucchiai',
  pranzo_riposo_tortellini: 'Carotine 100g, tortellini di carne 125g crudi, verdure miste 200g, olio EVO 2 cucchiai',
  spuntino_pomeriggio: 'Cracker integrali + frutta secca 15-20g',
  cena_allenamento: 'Pomodoro crudo 100g, pollo 250g, taralli 50g, verdure cotte 200g, olio EVO 2 cucchiai',
  cena_riposo: 'Pomodoro crudo 100g, legumi 350g cotti, taralli 40g, verdure cotte 200g, olio EVO 2 cucchiai',
  pizza: 'Mezza pizza con mozzarella + verdura abbondante prima',
}

export default function PastoForm() {
  const today = new Date().toISOString().split('T')[0]

  const [data, setData] = useState(today)
  const [tipoPasto, setTipoPasto] = useState('pranzo')
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
        // Genera automaticamente la descrizione dal preset
        if (tipoPasto === 'colazione') {
          descrizione = tipoGiorno === 'allenamento' ? PASTI_FISSI.colazione_integratori : PASTI_FISSI.colazione
        } else if (tipoPasto === 'spuntino_mattina') {
          descrizione = PASTI_FISSI.spuntino_mattina
        } else if (tipoPasto === 'pranzo') {
          descrizione = tipoGiorno === 'allenamento' ? PASTI_FISSI.pranzo_allenamento : PASTI_FISSI.pranzo_riposo
        } else if (tipoPasto === 'spuntino_pomeriggio') {
          descrizione = PASTI_FISSI.spuntino_pomeriggio
        } else if (tipoPasto === 'cena') {
          descrizione = tipoGiorno === 'allenamento' ? PASTI_FISSI.cena_allenamento : PASTI_FISSI.cena_riposo
        } else if (tipoPasto === 'pizza') {
          descrizione = PASTI_FISSI.pizza
        }
      }

      if (!descrizione) {
        setError('Inserisci una descrizione')
        setLoading(false)
        return
      }

      // Converti tipo pasto per il database
      let tipoDb = tipoPasto
      if (tipoPasto === 'spuntino_mattina' || tipoPasto === 'spuntino_pomeriggio') {
        tipoDb = 'snack'
      }

      const { error: insertError } = await supabase
        .from('pasti')
        .insert([
          {
            user_id: user.id,
            data,
            tipo_pasto: tipoDb,
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
        setTipoPasto('pranzo')
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

  // Anteprima del pasto selezionato
  const getAnteprimaPasto = () => {
    if (tipoPasto === 'colazione') {
      return tipoGiorno === 'allenamento' ? PASTI_FISSI.colazione_integratori : PASTI_FISSI.colazione
    } else if (tipoPasto === 'spuntino_mattina') {
      return PASTI_FISSI.spuntino_mattina
    } else if (tipoPasto === 'pranzo') {
      return tipoGiorno === 'allenamento' ? PASTI_FISSI.pranzo_allenamento : PASTI_FISSI.pranzo_riposo
    } else if (tipoPasto === 'spuntino_pomeriggio') {
      return PASTI_FISSI.spuntino_pomeriggio
    } else if (tipoPasto === 'cena') {
      return tipoGiorno === 'allenamento' ? PASTI_FISSI.cena_allenamento : PASTI_FISSI.cena_riposo
    } else if (tipoPasto === 'pizza') {
      return PASTI_FISSI.pizza
    }
    return ''
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-sm"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-sm"
        >
          <option value="colazione">☕ Colazione</option>
          <option value="spuntino_mattina">🍎 Spuntino Mattina</option>
          <option value="pranzo">🍝 Pranzo</option>
          <option value="spuntino_pomeriggio">🥨 Spuntino Pomeriggio</option>
          <option value="cena">🍖 Cena</option>
          <option value="pizza">🍕 Pizza</option>
        </select>
      </div>

      {/* Tipo Giorno (solo per colazione, pranzo, cena) */}
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

      {/* Toggle Preset / Manuale */}
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

      {/* Anteprima o campo manuale */}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 text-sm"
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
        className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-md"
      >
        {loading ? 'Salvataggio...' : '✅ Registra Pasto'}
      </button>
    </form>
  )
}
