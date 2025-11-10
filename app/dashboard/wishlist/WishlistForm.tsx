'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function WishlistForm() {
  const [nome, setNome] = useState('')
  const [descrizione, setDescrizione] = useState('')
  const [link, setLink] = useState('')
  const [priorita, setPriorita] = useState('media')
  const [pubblico, setPubblico] = useState(true)
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

      const { error: insertError } = await supabase
        .from('wishlist_items')
        .insert([
          {
            user_id: user.id,
            nome,
            descrizione,
            link: link || null,
            priorita,
            pubblico,
          },
        ])

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
      } else {
        // Reset form
        setNome('')
        setDescrizione('')
        setLink('')
        setPriorita('media')
        setPubblico(true)
        setLoading(false)

        // Refresh page
        window.location.reload()
      }
    } catch (err) {
      setError('Errore durante il salvataggio')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome *
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
          required
          placeholder="Es: iPhone 16 Pro"
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
          placeholder="Dettagli opzionali..."
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
          placeholder="https://..."
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
          id="pubblico"
          checked={pubblico}
          onChange={(e) => setPubblico(e.target.checked)}
          className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
        />
        <label htmlFor="pubblico" className="text-sm text-gray-700">
          Visibile pubblicamente
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Aggiunta in corso...' : '+ Aggiungi alla Wishlist'}
      </button>
    </form>
  )
}
