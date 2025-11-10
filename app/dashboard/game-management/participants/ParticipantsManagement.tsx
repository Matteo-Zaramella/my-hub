'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Participant {
  id?: number
  user_id: string
  participant_name: string
  phone_number: string | null
  instagram_handle: string | null
  category: string | null
  participant_code: string
  notes: string | null
}

interface ParticipantsManagementProps {
  initialParticipants: Participant[]
  userId: string
}

export default function ParticipantsManagement({ initialParticipants, userId }: ParticipantsManagementProps) {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [instagram, setInstagram] = useState('')
  const [category, setCategory] = useState<string>('Amici')
  const [code, setCode] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const supabase = createClient()

  const categories = ['Arcella', 'Mare', 'Severi', 'Mortise', 'Famiglia', 'Colleghi', 'Amici']

  // Generate unique code
  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const resetForm = () => {
    setName('')
    setPhone('')
    setInstagram('')
    setCategory('Amici')
    setCode('')
    setNotes('')
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  const handleEdit = (participant: Participant) => {
    setEditingId(participant.id!)
    setName(participant.participant_name)
    setPhone(participant.phone_number || '')
    setInstagram(participant.instagram_handle || '')
    setCategory(participant.category || 'Amici')
    setCode(participant.participant_code)
    setNotes(participant.notes || '')
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!name.trim()) {
      setError('Il nome è obbligatorio')
      setLoading(false)
      return
    }

    if (!code.trim()) {
      setError('Il codice è obbligatorio')
      setLoading(false)
      return
    }

    try {
      if (editingId) {
        // Update existing participant
        const { error: updateError } = await supabase
          .from('game_participants')
          .update({
            participant_name: name,
            phone_number: phone || null,
            instagram_handle: instagram || null,
            category: category || null,
            participant_code: code,
            notes: notes || null,
          })
          .eq('id', editingId)
          .eq('user_id', userId)

        if (updateError) throw updateError
      } else {
        // Create new participant
        const { error: insertError } = await supabase
          .from('game_participants')
          .insert([{
            user_id: userId,
            participant_name: name,
            phone_number: phone || null,
            instagram_handle: instagram || null,
            category: category || null,
            participant_code: code,
            notes: notes || null,
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
    if (!confirm('Sei sicuro di voler eliminare questo partecipante?')) return

    try {
      const { error: deleteError } = await supabase
        .from('game_participants')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (deleteError) throw deleteError

      router.refresh()
    } catch (err: any) {
      alert('Errore durante l\'eliminazione: ' + err.message)
    }
  }

  const getCategoryIcon = (cat: string | null) => {
    const icons: { [key: string]: string } = {
      'Arcella': '🏘️',
      'Mare': '🌊',
      'Severi': '🎓',
      'Mortise': '🏡',
      'Famiglia': '👨‍👩‍👧‍👦',
      'Colleghi': '💼',
      'Amici': '🤝',
    }
    return icons[cat || ''] || '👤'
  }

  // Group by category
  const groupedParticipants: { [key: string]: Participant[] } = {}
  participants.forEach(participant => {
    const cat = participant.category || 'Altro'
    if (!groupedParticipants[cat]) {
      groupedParticipants[cat] = []
    }
    groupedParticipants[cat].push(participant)
  })

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <div className="text-2xl mb-2">👥</div>
          <div className="text-2xl font-bold text-gray-800">{participants.length}</div>
          <div className="text-sm text-gray-600">Partecipanti Totali</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-gray-800">{Object.keys(groupedParticipants).length}</div>
          <div className="text-sm text-gray-600">Categorie</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="text-2xl mb-2">🔑</div>
          <div className="text-2xl font-bold text-gray-800">{participants.filter(p => p.participant_code).length}</div>
          <div className="text-sm text-gray-600">Codici Assegnati</div>
        </div>
      </div>

      {/* Add Participant Button */}
      {!showForm && (
        <button
          onClick={() => {
            setCode(generateCode())
            setShowForm(true)
          }}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition font-medium shadow-md"
        >
          + Aggiungi Partecipante
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              {editingId ? '✏️ Modifica Partecipante' : '➕ Nuovo Partecipante'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 Nome *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                required
                placeholder="Nome completo"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📱 Telefono
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                placeholder="+39 123 456 7890"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📸 Instagram
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                placeholder="@username"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏷️ Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {getCategoryIcon(cat)} {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔑 Codice Partecipante *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 font-mono"
                  required
                  placeholder="ABC123"
                />
                <button
                  type="button"
                  onClick={() => setCode(generateCode())}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  🎲 Genera
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Note
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                rows={2}
                placeholder="Note aggiuntive..."
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
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 font-medium"
              >
                {loading ? 'Salvataggio...' : (editingId ? 'Aggiorna' : 'Salva')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Participants List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">📋 Lista Partecipanti</h3>

        {participants.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-purple-200">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Nessun partecipante
            </h3>
            <p className="text-gray-600">
              Inizia aggiungendo i primi partecipanti al gioco!
            </p>
          </div>
        ) : (
          Object.entries(groupedParticipants).map(([categoryName, categoryParticipants]) => (
            <div key={categoryName} className="bg-white rounded-xl shadow-lg p-4 border border-purple-200">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-xl">{getCategoryIcon(categoryName)}</span>
                {categoryName}
                <span className="text-sm font-normal text-gray-500">({categoryParticipants.length})</span>
              </h4>
              <div className="space-y-2">
                {categoryParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{participant.participant_name}</div>
                      <div className="text-sm text-gray-600 space-y-1 mt-1">
                        {participant.phone_number && (
                          <div className="flex items-center gap-1">
                            <span>📱</span>
                            <span>{participant.phone_number}</span>
                          </div>
                        )}
                        {participant.instagram_handle && (
                          <div className="flex items-center gap-1">
                            <span>📸</span>
                            <span>{participant.instagram_handle}</span>
                          </div>
                        )}
                        {participant.notes && (
                          <div className="flex items-center gap-1">
                            <span>📝</span>
                            <span className="text-xs italic">{participant.notes}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 inline-block bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-mono font-bold">
                        🔑 {participant.participant_code}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(participant)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                        title="Modifica"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(participant.id!)}
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
