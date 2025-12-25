'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeviceForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('PC Components')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Campi dinamici basati sulla categoria
  const [dynamicSpecs, setDynamicSpecs] = useState<Array<{ key: string; value: string }>>([
    { key: '', value: '' }
  ])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const brand = formData.get('brand') as string
    const model = formData.get('model') as string
    const notes = formData.get('notes') as string
    const purchaseDate = formData.get('purchase_date') as string

    // Costruisci oggetto specs da campi dinamici
    const specs: Record<string, string> = {}
    dynamicSpecs.forEach(({ key, value }) => {
      if (key && value) {
        specs[key] = value
      }
    })

    try {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          name,
          brand,
          model,
          specs,
          notes,
          purchase_date: purchaseDate || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add device')
      }

      // Reset form
      e.currentTarget.reset()
      setDynamicSpecs([{ key: '', value: '' }])
      setShowAdvanced(false)
      router.refresh()
    } catch (error) {
      console.error('Error adding device:', error)
      alert('Errore durante l\'aggiunta del dispositivo')
    } finally {
      setLoading(false)
    }
  }

  const addSpecField = () => {
    setDynamicSpecs([...dynamicSpecs, { key: '', value: '' }])
  }

  const removeSpecField = (index: number) => {
    setDynamicSpecs(dynamicSpecs.filter((_, i) => i !== index))
  }

  const updateSpecField = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...dynamicSpecs]
    newSpecs[index][field] = value
    setDynamicSpecs(newSpecs)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Categoria */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoria *
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="PC Components">🖥️ PC Components</option>
          <option value="Periferiche">⌨️ Periferiche</option>
          <option value="Bici">🚴 Bici</option>
          <option value="Elettronica">📱 Elettronica</option>
          <option value="Altro">📦 Altro</option>
        </select>
      </div>

      {/* Nome */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome *
        </label>
        <input
          type="text"
          name="name"
          placeholder="es. Scheda Madre"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Brand */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Brand
        </label>
        <input
          type="text"
          name="brand"
          placeholder="es. Logitech"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Modello */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Modello
        </label>
        <input
          type="text"
          name="model"
          placeholder="es. MX Keys"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Toggle per specifiche avanzate */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        {showAdvanced ? '▼ Nascondi' : '▶ Mostra'} specifiche tecniche
      </button>

      {/* Specifiche Tecniche Dinamiche */}
      {showAdvanced && (
        <div className="space-y-2 border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specifiche Tecniche
          </label>
          {dynamicSpecs.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Nome (es. RAM)"
                value={spec.key}
                onChange={(e) => updateSpecField(index, 'key', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <input
                type="text"
                placeholder="Valore (es. 16GB)"
                value={spec.value}
                onChange={(e) => updateSpecField(index, 'value', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {dynamicSpecs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSpecField(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSpecField}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Aggiungi specifica
          </button>
        </div>
      )}

      {/* Data Acquisto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data Acquisto
        </label>
        <input
          type="date"
          name="purchase_date"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Note
        </label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Eventuali annotazioni..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
      >
        {loading ? 'Salvataggio...' : 'Aggiungi Dispositivo'}
      </button>
    </form>
  )
}
