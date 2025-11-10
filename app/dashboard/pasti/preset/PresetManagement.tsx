'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface MealPreset {
  id?: number
  user_id: string
  meal_type: string
  day_type: string | null
  description: string
}

interface PresetManagementProps {
  initialPresets: MealPreset[]
  userId: string
}

export default function PresetManagement({ initialPresets, userId }: PresetManagementProps) {
  const [presets, setPresets] = useState<MealPreset[]>(initialPresets)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [mealType, setMealType] = useState('colazione')
  const [dayType, setDayType] = useState<string | null>('allenamento')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const supabase = createClient()

  const needsDayType = ['colazione', 'pranzo', 'cena'].includes(mealType)

  const resetForm = () => {
    setMealType('colazione')
    setDayType('allenamento')
    setDescription('')
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  const handleEdit = (preset: MealPreset) => {
    setEditingId(preset.id!)
    setMealType(preset.meal_type)
    setDayType(preset.day_type)
    setDescription(preset.description)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const finalDayType = needsDayType ? dayType : null

      if (editingId) {
        // Update existing preset
        const { error: updateError } = await supabase
          .from('meal_presets')
          .update({
            meal_type: mealType,
            day_type: finalDayType,
            description,
          })
          .eq('id', editingId)
          .eq('user_id', userId)

        if (updateError) throw updateError
      } else {
        // Create new preset
        const { error: insertError } = await supabase
          .from('meal_presets')
          .insert([{
            user_id: userId,
            meal_type: mealType,
            day_type: finalDayType,
            description,
          }])

        if (insertError) throw insertError
      }

      router.refresh()
      resetForm()
    } catch (err: any) {
      setError(err.message || 'Errore durante il salvataggio')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Sei sicuro di voler eliminare questo preset?')) return

    try {
      const { error: deleteError } = await supabase
        .from('meal_presets')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (deleteError) throw deleteError

      router.refresh()
    } catch (err: any) {
      alert('Errore durante l\'eliminazione: ' + err.message)
    }
  }

  const getMealTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      colazione: '☕ Colazione',
      spuntino_mattina: '🍎 Spuntino Mattina',
      pranzo: '🍝 Pranzo',
      spuntino_pomeriggio: '🥨 Spuntino Pomeriggio',
      cena: '🍖 Cena',
      snack: '🍪 Snack',
      pizza: '🍕 Pizza',
    }
    return labels[type] || type
  }

  const getDayTypeLabel = (type: string | null) => {
    if (!type) return ''
    return type === 'allenamento' ? '🏃 Allenamento' : '💤 Riposo'
  }

  // Group presets by meal type
  const groupedPresets: { [key: string]: MealPreset[] } = {}
  presets.forEach(preset => {
    if (!groupedPresets[preset.meal_type]) {
      groupedPresets[preset.meal_type] = []
    }
    groupedPresets[preset.meal_type].push(preset)
  })

  return (
    <div className="space-y-6">
      {/* Add Preset Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition font-medium shadow-md"
        >
          + Aggiungi Nuovo Preset
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              {editingId ? '✏️ Modifica Preset' : '➕ Nuovo Preset'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Meal Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🍽️ Tipo Pasto
              </label>
              <select
                value={mealType}
                onChange={(e) => {
                  setMealType(e.target.value)
                  if (!['colazione', 'pranzo', 'cena'].includes(e.target.value)) {
                    setDayType(null)
                  } else if (!dayType) {
                    setDayType('allenamento')
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                required
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

            {/* Day Type (only for certain meals) */}
            {needsDayType && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💪 Tipo Giorno
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDayType('allenamento')}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition ${
                      dayType === 'allenamento'
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    🏃 Allenamento
                  </button>
                  <button
                    type="button"
                    onClick={() => setDayType('riposo')}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition ${
                      dayType === 'riposo'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    💤 Riposo
                  </button>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Descrizione
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
                rows={4}
                required
                placeholder="Es: Caffè, banana 150g, uova e albumi 150g, pane 90g con cioccolato fondente 20g..."
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition disabled:opacity-50 font-medium"
              >
                {loading ? 'Salvataggio...' : (editingId ? 'Aggiorna' : 'Salva')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Presets List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">📋 I Tuoi Preset</h3>

        {presets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-orange-200">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Nessun preset configurato
            </h3>
            <p className="text-gray-600">
              Inizia creando il tuo primo preset!
            </p>
          </div>
        ) : (
          Object.entries(groupedPresets).map(([mealTypeKey, mealPresets]) => (
            <div key={mealTypeKey} className="bg-white rounded-xl shadow-lg p-4 border border-orange-200">
              <h4 className="font-bold text-gray-800 mb-3">{getMealTypeLabel(mealTypeKey)}</h4>
              <div className="space-y-2">
                {mealPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
                  >
                    <div className="flex-1">
                      {preset.day_type && (
                        <div className="text-xs font-medium text-orange-700 mb-1">
                          {getDayTypeLabel(preset.day_type)}
                        </div>
                      )}
                      <p className="text-sm text-gray-700">{preset.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(preset)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                        title="Modifica"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(preset.id!)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                        title="Elimina"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
