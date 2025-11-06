'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface PastoItemProps {
  pasto: {
    id: number
    data: string
    tipo_pasto: string
    descrizione: string
    created_at: string
  }
}

export default function PastoItem({ pasto }: PastoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [data, setData] = useState(pasto.data)
  const [tipoPasto, setTipoPasto] = useState(pasto.tipo_pasto)
  const [descrizione, setDescrizione] = useState(pasto.descrizione)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async () => {
    setLoading(true)

    const { error } = await supabase
      .from('pasti')
      .update({
        data,
        tipo_pasto: tipoPasto,
        descrizione,
      })
      .eq('id', pasto.id)

    if (error) {
      alert('Errore durante l\'aggiornamento')
      console.error(error)
    } else {
      setIsEditing(false)
      router.refresh()
    }

    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Eliminare questo pasto?')) return

    setLoading(true)

    const { error } = await supabase
      .from('pasti')
      .delete()
      .eq('id', pasto.id)

    if (error) {
      alert('Errore durante l\'eliminazione')
      console.error(error)
      setLoading(false)
    } else {
      router.refresh()
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'colazione':
        return '☕'
      case 'pranzo':
        return '🍝'
      case 'cena':
        return '🍖'
      case 'snack':
        return '🍎'
      default:
        return '🍽️'
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'colazione':
        return 'bg-yellow-100 text-yellow-800'
      case 'pranzo':
        return 'bg-green-100 text-green-800'
      case 'cena':
        return 'bg-blue-100 text-blue-800'
      case 'snack':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Modifica Pasto</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tipo Pasto
            </label>
            <select
              value={tipoPasto}
              onChange={(e) => setTipoPasto(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
            >
              <option value="colazione">☕ Colazione</option>
              <option value="pranzo">🍝 Pranzo</option>
              <option value="cena">🍖 Cena</option>
              <option value="snack">🍎 Snack</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Descrizione
            </label>
            <textarea
              value={descrizione}
              onChange={(e) => setDescrizione(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm"
            >
              {loading ? 'Salvataggio...' : 'Salva'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 text-sm"
            >
              Annulla
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getTipoColor(pasto.tipo_pasto)}`}>
              {getTipoIcon(pasto.tipo_pasto)} {pasto.tipo_pasto.charAt(0).toUpperCase() + pasto.tipo_pasto.slice(1)}
            </span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{pasto.descrizione}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition flex-shrink-0"
            title="Modifica"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 flex-shrink-0"
            title="Elimina"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
