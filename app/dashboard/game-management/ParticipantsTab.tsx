'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Participant {
  id: number
  participant_name: string
  phone_number: string | null
  instagram_handle: string | null
  category: string | null
  participant_code: string
  notes: string | null
  partner_name: string | null
  is_couple: boolean
}

export default function ParticipantsTab() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [coupleFilter, setCoupleFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editPartnerName, setEditPartnerName] = useState('')

  const supabase = createClient()

  useEffect(() => {
    fetchParticipants()
  }, [])

  const fetchParticipants = async () => {
    const { data } = await supabase
      .from('game_participants')
      .select('*')
      .order('participant_name', { ascending: true })

    setParticipants(data || [])
    setLoading(false)
  }

  const handleEditPartner = (participant: Participant) => {
    setEditingId(participant.id)
    setEditPartnerName(participant.partner_name || '')
  }

  const handleSavePartner = async (participantId: number) => {
    const { error } = await supabase
      .from('game_participants')
      .update({ partner_name: editPartnerName || null })
      .eq('id', participantId)

    if (error) {
      console.error('Error updating partner:', error)
    } else {
      setEditingId(null)
      fetchParticipants()
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditPartnerName('')
  }

  // Get unique categories
  const categories = Array.from(new Set(participants.map(p => p.category).filter(c => c !== null))) as string[]

  // Filter participants
  const filteredParticipants = participants.filter(p => {
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter || (categoryFilter === 'none' && !p.category)
    const matchesCouple = coupleFilter === 'all' ||
      (coupleFilter === 'couple' && p.is_couple) ||
      (coupleFilter === 'single' && !p.is_couple)
    const matchesSearch = searchQuery === '' ||
      p.participant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.partner_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false)

    return matchesCategory && matchesCouple && matchesSearch
  })

  const couples = participants.filter(p => p.is_couple)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Caricamento...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl mb-2">👥</div>
          <div className="text-2xl font-bold text-white">{participants.length}</div>
          <div className="text-sm text-white/60">Partecipanti Totali</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-white">{categories.length}</div>
          <div className="text-sm text-white/60">Categorie</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl mb-2">❤️</div>
          <div className="text-2xl font-bold text-white">{couples.length}</div>
          <div className="text-sm text-white/60">In Coppia</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">🔍 Cerca</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nome..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">🏷️ Categoria</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-gray-900 [&>option]:text-white"
            >
              <option value="all">Tutte</option>
              {categories.sort().map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="none">Senza Categoria</option>
            </select>
          </div>

          {/* Couple Filter */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">💑 Relazione</label>
            <select
              value={coupleFilter}
              onChange={(e) => setCoupleFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-gray-900 [&>option]:text-white"
            >
              <option value="all">Tutti</option>
              <option value="couple">In Coppia</option>
              <option value="single">Single</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-white/60 text-sm">
        Mostrando {filteredParticipants.length} di {participants.length} partecipanti
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Telefono</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Instagram</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Categoria</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Partner</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Codice</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredParticipants.map((participant, index) => (
                <tr key={participant.id} className={index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}>
                  <td className="px-4 py-3 text-sm text-white font-medium">
                    {participant.participant_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-white/80">
                    {participant.phone_number || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-white/80">
                    {participant.instagram_handle || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-white/80">
                    {participant.category || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === participant.id ? (
                      <input
                        type="text"
                        value={editPartnerName}
                        onChange={(e) => setEditPartnerName(e.target.value)}
                        placeholder="Nome partner..."
                        className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-white/40"
                      />
                    ) : participant.is_couple && participant.partner_name ? (
                      <span className="text-pink-400">❤️ {participant.partner_name}</span>
                    ) : participant.is_couple ? (
                      <span className="text-yellow-400">❤️ Partner da aggiungere</span>
                    ) : (
                      <span className="text-white/40">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block bg-purple-600 text-white px-2 py-1 rounded text-xs font-mono font-bold">
                      {participant.participant_code}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {participant.is_couple && editingId === participant.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleSavePartner(participant.id)}
                          className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ) : participant.is_couple ? (
                      <button
                        onClick={() => handleEditPartner(participant)}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        ✏️
                      </button>
                    ) : (
                      <span className="text-white/40">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
