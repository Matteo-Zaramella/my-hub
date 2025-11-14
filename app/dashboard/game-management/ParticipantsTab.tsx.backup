'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Participant {
  id: number
  participant_name: string
  phone_number: string | null
  instagram_handle: string | null
  email: string | null
  category: string | null
  participant_code: string
  notes: string | null
  partner_name: string | null
  is_couple: boolean
  current_points: number
}

interface EditingData {
  phone: string
  instagram: string
  email: string
  category: string
  partnerName: string
}

type SortField = 'participant_name' | 'category' | 'partner_name' | 'participant_code' | 'current_points'
type SortDirection = 'asc' | 'desc'

export default function ParticipantsTab() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [coupleFilter, setCoupleFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<EditingData>({
    phone: '',
    instagram: '',
    email: '',
    category: '',
    partnerName: ''
  })
  const [sortField, setSortField] = useState<SortField>('current_points')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // New participant form
  const [showAddForm, setShowAddForm] = useState(false)
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    phone: '',
    instagram: '',
    email: '',
    category: 'Arcella',
    isCouple: false,
    partnerName: ''
  })
  const [adding, setAdding] = useState(false)

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

  const handleEdit = (participant: Participant) => {
    setEditingId(participant.id)
    setEditingData({
      phone: participant.phone_number || '',
      instagram: participant.instagram_handle || '',
      email: participant.email || '',
      category: participant.category || 'Arcella',
      partnerName: participant.partner_name || ''
    })
  }

  const handleSave = async (participantId: number) => {
    const { error } = await supabase
      .from('game_participants')
      .update({
        phone_number: editingData.phone.trim() || null,
        instagram_handle: editingData.instagram.trim() || null,
        email: editingData.email.trim() || null,
        category: editingData.category,
        partner_name: editingData.partnerName.trim() || null
      })
      .eq('id', participantId)

    if (error) {
      console.error('Error updating participant:', error)
      alert('Errore durante l\'aggiornamento')
    } else {
      setEditingId(null)
      fetchParticipants()
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingData({
      phone: '',
      instagram: '',
      email: '',
      category: '',
      partnerName: ''
    })
  }

  const generateParticipantCode = (name: string) => {
    // Generate code from name initials + random number
    const parts = name.trim().split(' ')
    let code = ''

    parts.forEach(part => {
      if (part.length > 0) code += part[0].toUpperCase()
    })

    // Add random 2 digits
    code += Math.floor(10 + Math.random() * 90)

    return code.substring(0, 6)
  }

  const handleAddParticipant = async () => {
    if (!newParticipant.name.trim()) {
      alert('Inserisci almeno il nome')
      return
    }

    setAdding(true)

    try {
      const participantCode = generateParticipantCode(newParticipant.name)

      // Get current user ID
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('game_participants')
        .insert({
          user_id: userData.user.id,
          participant_name: newParticipant.name.trim(),
          phone_number: newParticipant.phone.trim() || null,
          instagram_handle: newParticipant.instagram.trim() || null,
          email: newParticipant.email.trim() || null,
          category: newParticipant.category,
          participant_code: participantCode,
          is_couple: newParticipant.isCouple,
          partner_name: newParticipant.isCouple ? newParticipant.partnerName.trim() || null : null,
          current_points: 0
        })
        .select()

      if (error) throw error

      // Reset form
      setNewParticipant({
        name: '',
        phone: '',
        instagram: '',
        email: '',
        category: 'Arcella',
        isCouple: false,
        partnerName: ''
      })
      setShowAddForm(false)

      // Refresh list
      fetchParticipants()

      alert(`✅ Partecipante aggiunto!\nCodice: ${participantCode}`)
    } catch (error: any) {
      console.error('Error adding participant:', error)
      if (error.code === '23505') {
        alert('Errore: questo partecipante esiste già o il codice è duplicato. Riprova.')
      } else {
        alert('Errore durante l\'aggiunta del partecipante')
      }
    } finally {
      setAdding(false)
    }
  }

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New field, default to ascending (except points which defaults to descending)
      setSortField(field)
      setSortDirection(field === 'current_points' ? 'desc' : 'asc')
    }
  }

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️'
    return sortDirection === 'asc' ? '↑' : '↓'
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

  // Sort participants
  const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    // Handle null values - move to end
    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    // Convert to lowercase for string comparison
    if (typeof aValue === 'string') aValue = aValue.toLowerCase()
    if (typeof bValue === 'string') bValue = bValue.toLowerCase()

    // Compare
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
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
      {/* Add Participant Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition flex items-center gap-2"
        >
          {showAddForm ? '✕ Chiudi' : '➕ Aggiungi Partecipante'}
        </button>
      </div>

      {/* Add Participant Form */}
      {showAddForm && (
        <div className="bg-white/5 border border-green-500/30 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">➕ Nuovo Partecipante</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Nome e Cognome *
              </label>
              <input
                type="text"
                value={newParticipant.name}
                onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                placeholder="Mario Rossi"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={adding}
              />
            </div>

            {/* Telefono */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Telefono
              </label>
              <input
                type="tel"
                value={newParticipant.phone}
                onChange={(e) => setNewParticipant({ ...newParticipant, phone: e.target.value })}
                placeholder="+39 123 456 7890"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={adding}
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Instagram
              </label>
              <input
                type="text"
                value={newParticipant.instagram}
                onChange={(e) => setNewParticipant({ ...newParticipant, instagram: e.target.value })}
                placeholder="@username"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={adding}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                type="email"
                value={newParticipant.email}
                onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={adding}
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Categoria *
              </label>
              <select
                value={newParticipant.category}
                onChange={(e) => setNewParticipant({ ...newParticipant, category: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 [&>option]:bg-gray-900 [&>option]:text-white"
                disabled={adding}
              >
                <option value="Arcella">Arcella</option>
                <option value="Mare">Mare</option>
                <option value="Severi">Severi</option>
                <option value="Mortise">Mortise</option>
                <option value="Famiglia">Famiglia</option>
                <option value="Colleghi">Colleghi</option>
                <option value="Amici">Amici</option>
                <option value="Vigodarzere">Vigodarzere</option>
              </select>
            </div>

            {/* In Coppia */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newParticipant.isCouple}
                  onChange={(e) => setNewParticipant({ ...newParticipant, isCouple: e.target.checked })}
                  className="w-4 h-4"
                  disabled={adding}
                />
                <span className="text-sm font-medium text-white/80">In coppia</span>
              </label>
            </div>

            {/* Partner Name (conditional) */}
            {newParticipant.isCouple && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Nome Partner
                </label>
                <input
                  type="text"
                  value={newParticipant.partnerName}
                  onChange={(e) => setNewParticipant({ ...newParticipant, partnerName: e.target.value })}
                  placeholder="Nome del partner"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={adding}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddParticipant}
              disabled={adding || !newParticipant.name.trim()}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {adding ? 'Aggiunta in corso...' : '✓ Aggiungi'}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              disabled={adding}
              className="px-4 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition"
            >
              Annulla
            </button>
          </div>

          <p className="text-xs text-white/50 mt-4">
            * Il codice partecipante verrà generato automaticamente
          </p>
        </div>
      )}

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
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                  <button
                    onClick={() => handleSort('participant_name')}
                    className="flex items-center gap-1 hover:text-purple-300 transition"
                  >
                    Nome {getSortIcon('participant_name')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Telefono</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Instagram</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                  <button
                    onClick={() => handleSort('category')}
                    className="flex items-center gap-1 hover:text-purple-300 transition"
                  >
                    Categoria {getSortIcon('category')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                  <button
                    onClick={() => handleSort('partner_name')}
                    className="flex items-center gap-1 hover:text-purple-300 transition"
                  >
                    Partner {getSortIcon('partner_name')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                  <button
                    onClick={() => handleSort('participant_code')}
                    className="flex items-center gap-1 hover:text-purple-300 transition"
                  >
                    Codice {getSortIcon('participant_code')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                  <button
                    onClick={() => handleSort('current_points')}
                    className="flex items-center gap-1 hover:text-purple-300 transition"
                  >
                    Punteggio {getSortIcon('current_points')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {sortedParticipants.map((participant, index) => {
                const isEditing = editingId === participant.id

                return (
                <tr key={participant.id} className={index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}>
                  <td className="px-4 py-3 text-sm text-white font-medium">
                    {participant.participant_name}
                  </td>

                  {/* Telefono */}
                  <td className="px-4 py-3 text-sm text-white/80">
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editingData.phone}
                        onChange={(e) => setEditingData({ ...editingData, phone: e.target.value })}
                        placeholder="Telefono..."
                        className="w-full bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-white/40"
                      />
                    ) : (
                      participant.phone_number || '-'
                    )}
                  </td>

                  {/* Instagram */}
                  <td className="px-4 py-3 text-sm text-white/80">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingData.instagram}
                        onChange={(e) => setEditingData({ ...editingData, instagram: e.target.value })}
                        placeholder="@username..."
                        className="w-full bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-white/40"
                      />
                    ) : (
                      participant.instagram_handle || '-'
                    )}
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3 text-sm text-white/80">
                    {isEditing ? (
                      <input
                        type="email"
                        value={editingData.email}
                        onChange={(e) => setEditingData({ ...editingData, email: e.target.value })}
                        placeholder="email..."
                        className="w-full bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-white/40"
                      />
                    ) : (
                      participant.email || '-'
                    )}
                  </td>

                  {/* Categoria */}
                  <td className="px-4 py-3 text-sm text-white/80">
                    {isEditing ? (
                      <select
                        value={editingData.category}
                        onChange={(e) => setEditingData({ ...editingData, category: e.target.value })}
                        className="w-full bg-gray-900 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-white/40"
                      >
                        <option value="Arcella">Arcella</option>
                        <option value="Mare">Mare</option>
                        <option value="Severi">Severi</option>
                        <option value="Mortise">Mortise</option>
                        <option value="Famiglia">Famiglia</option>
                        <option value="Colleghi">Colleghi</option>
                        <option value="Amici">Amici</option>
                        <option value="Vigodarzere">Vigodarzere</option>
                      </select>
                    ) : (
                      participant.category || '-'
                    )}
                  </td>

                  {/* Partner */}
                  <td className="px-4 py-3 text-sm">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingData.partnerName}
                        onChange={(e) => setEditingData({ ...editingData, partnerName: e.target.value })}
                        placeholder="Nome partner..."
                        className="w-full bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-white/40"
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
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      🏆 {participant.current_points}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleSave(participant.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 font-semibold"
                        >
                          💾 Salva
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 font-semibold"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(participant)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 font-semibold"
                      >
                        ✏️ Modifica
                      </button>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
