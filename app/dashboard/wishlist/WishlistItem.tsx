'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface WishlistItemProps {
  item: {
    id: number
    nome: string
    descrizione: string | null
    link: string | null
    immagine_url: string | null
    priorita: string
    pubblico: boolean
    created_at: string
  }
}

export default function WishlistItem({ item }: WishlistItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [nome, setNome] = useState(item.nome)
  const [descrizione, setDescrizione] = useState(item.descrizione || '')
  const [link, setLink] = useState(item.link || '')
  const [immagineUrl, setImmagineUrl] = useState(item.immagine_url || '')
  const [priorita, setPriorita] = useState(item.priorita)
  const [pubblico, setPubblico] = useState(item.pubblico)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async () => {
    setLoading(true)

    const { error } = await supabase
      .from('wishlist_items')
      .update({
        nome,
        descrizione: descrizione || null,
        link: link || null,
        immagine_url: immagineUrl || null,
        priorita,
        pubblico,
      })
      .eq('id', item.id)

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
    if (!confirm('Sei sicuro di voler eliminare questo item?')) return

    setLoading(true)

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('id', item.id)

    if (error) {
      alert('Errore durante l\'eliminazione')
      console.error(error)
      setLoading(false)
    } else {
      router.refresh()
    }
  }

  const getPriorityColor = (priorita: string) => {
    switch (priorita) {
      case 'alta':
        return 'bg-red-100 text-red-800'
      case 'media':
        return 'bg-yellow-100 text-yellow-800'
      case 'bassa':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityIcon = (priorita: string) => {
    switch (priorita) {
      case 'alta':
        return '🔴'
      case 'media':
        return '🟡'
      case 'bassa':
        return '🟢'
      default:
        return '⚪'
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Modifica Item</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrizione
            </label>
            <textarea
              value={descrizione}
              onChange={(e) => setDescrizione(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Immagine
            </label>
            <input
              type="url"
              value={immagineUrl}
              onChange={(e) => setImmagineUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priorità
            </label>
            <select
              value={priorita}
              onChange={(e) => setPriorita(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
            >
              <option value="bassa">🟢 Bassa</option>
              <option value="media">🟡 Media</option>
              <option value="alta">🔴 Alta</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`pubblico-${item.id}`}
              checked={pubblico}
              onChange={(e) => setPubblico(e.target.checked)}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor={`pubblico-${item.id}`} className="text-sm text-gray-700">
              Visibile pubblicamente
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition disabled:opacity-50"
            >
              {loading ? 'Salvataggio...' : 'Salva'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
              Annulla
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-800">{item.nome}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(item.priorita)}`}>
              {getPriorityIcon(item.priorita)} {item.priorita.charAt(0).toUpperCase() + item.priorita.slice(1)}
            </span>
            {item.pubblico && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                🌐 Pubblico
              </span>
            )}
          </div>

          {item.descrizione && (
            <p className="text-gray-600 mb-3">{item.descrizione}</p>
          )}

          <div className="space-y-2">
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 text-sm font-medium inline-flex items-center gap-1"
              >
                🔗 Vedi link
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}

            {item.immagine_url && (
              <div className="flex items-start gap-2">
                <span className="text-xs text-gray-500 font-medium">🖼️ Immagine:</span>
                <a
                  href={item.immagine_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 break-all"
                >
                  {item.immagine_url}
                </a>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Aggiunto il {new Date(item.created_at).toLocaleDateString('it-IT')}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Modifica"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
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
