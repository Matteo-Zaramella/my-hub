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
  present_at_opening: boolean
  opening_bonus_awarded: boolean
  registration_completed: boolean
  participant_type: 'principale' | 'partner'
}

interface CategoryColor {
  category: string
  color_hex: string
  color_name: string
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
  const [categoryColors, setCategoryColors] = useState<Record<string, CategoryColor>>({})
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [coupleFilter, setCoupleFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all') // Nuovo filtro
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

  // Advanced edit modal
  const [showAdvancedEdit, setShowAdvancedEdit] = useState(false)
  const [advancedEditParticipant, setAdvancedEditParticipant] = useState<Participant | null>(null)
  const [advancedEditData, setAdvancedEditData] = useState({
    name: '',
    code: '',
    notes: ''
  })
  const [savingAdvanced, setSavingAdvanced] = useState(false)

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
    fetchCategoryColors()
  }, [])

  const fetchParticipants = async () => {
    const { data } = await supabase
      .from('game_participants')
      .select('*')
      .order('participant_name', { ascending: true })

    setParticipants(data || [])
    setLoading(false)
  }

  const fetchCategoryColors = async () => {
    const { data } = await supabase
      .from('category_colors')
      .select('*')

    if (data) {
      const colorsMap: Record<string, CategoryColor> = {}
      data.forEach((item) => {
        colorsMap[item.category] = item
      })
      setCategoryColors(colorsMap)
    }
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

  const handleResendEmail = async (participant: Participant) => {
    if (!participant.email) {
      alert('❌ Questo partecipante non ha un indirizzo email registrato.')
      return
    }

    if (!confirm(`Vuoi inviare l'email di conferma a:\n\n${participant.participant_name}\n${participant.email}\n\nCodice: ${participant.participant_code}`)) {
      return
    }

    try {
      const emailResponse = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: participant.email,
          name: participant.participant_name,
          participantCode: participant.participant_code
        })
      })

      const emailResult = await emailResponse.json()

      if (!emailResponse.ok) {
        throw new Error(emailResult.error || 'Errore sconosciuto')
      }

      alert(`✅ Email inviata con successo a ${participant.email}!`)
    } catch (error: any) {
      console.error('Error sending email:', error)
      alert(`❌ Errore durante l'invio dell'email:\n${error.message}`)
    }
  }

  const handleResetRegistration = async (participantId: number, participantName: string) => {
    if (!confirm(`Sei sicuro di voler resettare i dati di registrazione di ${participantName}?\n\nVerranno cancellati:\n- Email\n- Telefono\n- Instagram\n- Flag registrazione completata`)) return

    try {
      const { error } = await supabase
        .from('game_participants')
        .update({
          email: null,
          phone_number: null,
          instagram_handle: null,
          registration_completed: false
        })
        .eq('id', participantId)

      if (error) throw error

      alert('✅ Dati di registrazione resettati con successo!')
      fetchParticipants()
    } catch (err: any) {
      console.error('Error resetting registration:', err)
      alert('❌ Errore durante il reset: ' + err.message)
    }
  }

  const handleDelete = async (participantId: number, participantName: string) => {
    if (!confirm(`⚠️ ATTENZIONE!\n\nSei sicuro di voler eliminare definitivamente ${participantName}?\n\nQuesta azione NON può essere annullata.`)) return

    try {
      const { error } = await supabase
        .from('game_participants')
        .delete()
        .eq('id', participantId)

      if (error) throw error

      alert('✅ Partecipante eliminato con successo')
      fetchParticipants()
    } catch (err: any) {
      console.error('Error deleting participant:', err)
      alert('❌ Errore durante l\'eliminazione: ' + err.message)
    }
  }

  const handleOpenAdvancedEdit = (participant: Participant) => {
    setAdvancedEditParticipant(participant)
    setAdvancedEditData({
      name: participant.participant_name,
      code: participant.participant_code,
      notes: participant.notes || ''
    })
    setShowAdvancedEdit(true)
  }

  const handleSaveAdvancedEdit = async () => {
    if (!advancedEditParticipant) return

    if (!advancedEditData.name.trim()) {
      alert('Il nome è obbligatorio')
      return
    }

    if (!advancedEditData.code.trim()) {
      alert('Il codice è obbligatorio')
      return
    }

    setSavingAdvanced(true)

    try {
      const { error } = await supabase
        .from('game_participants')
        .update({
          participant_name: advancedEditData.name.trim(),
          participant_code: advancedEditData.code.trim().toUpperCase(),
          notes: advancedEditData.notes.trim() || null
        })
        .eq('id', advancedEditParticipant.id)

      if (error) throw error

      alert('✅ Modifiche salvate con successo!')
      setShowAdvancedEdit(false)
      setAdvancedEditParticipant(null)
      fetchParticipants()
    } catch (err: any) {
      console.error('Error saving advanced edit:', err)
      alert('❌ Errore durante il salvataggio: ' + err.message)
    } finally {
      setSavingAdvanced(false)
    }
  }

  const generateParticipantCode = (name: string) => {
    // Generate 6-character random code: 3 letters + 3 numbers
    // Example: ABC123, XYZ789
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'

    let code = ''

    // First 3 characters: random letters
    for (let i = 0; i < 3; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length))
    }

    // Last 3 characters: random numbers
    for (let i = 0; i < 3; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }

    return code
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

      // Send confirmation email if email is provided
      if (newParticipant.email.trim()) {
        try {
          const emailResponse = await fetch('/api/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: newParticipant.email.trim(),
              name: newParticipant.name.trim(),
              participantCode: participantCode
            })
          })

          const emailResult = await emailResponse.json()

          if (!emailResponse.ok) {
            console.error('Email error:', emailResult.error)
            alert(`⚠️ Partecipante aggiunto ma email non inviata.\nCodice: ${participantCode}\nErrore email: ${emailResult.error}`)
          } else {
            alert(`✅ Partecipante aggiunto!\nCodice: ${participantCode}\n📧 Email di conferma inviata a ${newParticipant.email}`)
          }
        } catch (emailError) {
          console.error('Email sending failed:', emailError)
          alert(`⚠️ Partecipante aggiunto ma email non inviata.\nCodice: ${participantCode}`)
        }
      } else {
        alert(`✅ Partecipante aggiunto!\nCodice: ${participantCode}\n📋 Nessuna email fornita - notifica non inviata`)
      }

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
    const matchesType = typeFilter === 'all' || p.participant_type === typeFilter
    const matchesSearch = searchQuery === '' ||
      p.participant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.partner_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false)

    return matchesCategory && matchesCouple && matchesType && matchesSearch
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">👤 Tipo</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-gray-900 [&>option]:text-white"
            >
              <option value="all">Tutti</option>
              <option value="principale">Principale</option>
              <option value="partner">Partner</option>
            </select>
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Tipo</th>
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
                <th className="px-4 py-3 text-center text-sm font-semibold text-white">Iscritto</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-white">Presente</th>
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

                  {/* Tipo */}
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      participant.participant_type === 'principale'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {participant.participant_type === 'principale' ? '👤 Principale' : '👥 Partner'}
                    </span>
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
                    ) : participant.category && categoryColors[participant.category] ? (
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold border"
                        style={{
                          backgroundColor: `${categoryColors[participant.category].color_hex}20`,
                          color: categoryColors[participant.category].color_hex,
                          borderColor: `${categoryColors[participant.category].color_hex}50`
                        }}
                      >
                        {participant.category}
                      </span>
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

                  {/* Iscritto - Pallino verde/rosso */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center">
                      <div className={`w-4 h-4 rounded-full ${participant.registration_completed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                  </td>

                  {/* Presente alla serata apertura */}
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={participant.present_at_opening}
                      onChange={async (e) => {
                        const newValue = e.target.checked
                        // Aggiorna immediatamente nel database
                        const { error } = await supabase
                          .from('game_participants')
                          .update({ present_at_opening: newValue })
                          .eq('id', participant.id)

                        if (!error) {
                          // Aggiorna stato locale
                          setParticipants(participants.map(p =>
                            p.id === participant.id ? { ...p, present_at_opening: newValue } : p
                          ))
                        } else {
                          console.error('Error updating presence:', error)
                        }
                      }}
                      className="w-5 h-5 cursor-pointer accent-green-500"
                    />
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
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => handleEdit(participant)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 font-semibold"
                          title="Modifica rapida"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleOpenAdvancedEdit(participant)}
                          className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 font-semibold"
                          title="Modifica avanzata (Nome, Codice, Note)"
                        >
                          ⚙️
                        </button>
                        {participant.email && (
                          <button
                            onClick={() => handleResendEmail(participant)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 font-semibold"
                            title="Invia/Reinvia Email Conferma"
                          >
                            📧
                          </button>
                        )}
                        {participant.registration_completed && (
                          <button
                            onClick={() => handleResetRegistration(participant.id, participant.participant_name)}
                            className="px-3 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700 font-semibold"
                            title="Reset Registrazione"
                          >
                            🔄
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(participant.id, participant.participant_name)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 font-semibold"
                          title="Elimina partecipante"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advanced Edit Modal */}
      {showAdvancedEdit && advancedEditParticipant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/30 rounded-xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">⚙️ Modifica Avanzata</h3>
              <button
                onClick={() => setShowAdvancedEdit(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  👤 Nome Completo *
                </label>
                <input
                  type="text"
                  value={advancedEditData.name}
                  onChange={(e) => setAdvancedEditData({ ...advancedEditData, name: e.target.value })}
                  placeholder="Mario Rossi"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={savingAdvanced}
                />
              </div>

              {/* Codice */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  🔑 Codice Partecipante *
                </label>
                <input
                  type="text"
                  value={advancedEditData.code}
                  onChange={(e) => setAdvancedEditData({ ...advancedEditData, code: e.target.value.toUpperCase() })}
                  placeholder="ABC123"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  disabled={savingAdvanced}
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  📝 Note
                </label>
                <textarea
                  value={advancedEditData.notes}
                  onChange={(e) => setAdvancedEditData({ ...advancedEditData, notes: e.target.value })}
                  placeholder="Note aggiuntive..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={savingAdvanced}
                />
              </div>

              {/* Warning */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-300 text-xs">
                  ⚠️ <span className="font-semibold">Attenzione:</span> Modificare nome o codice può causare problemi se il partecipante ha già completato la registrazione.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAdvancedEdit(false)}
                  disabled={savingAdvanced}
                  className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition disabled:opacity-50"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSaveAdvancedEdit}
                  disabled={savingAdvanced}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
                >
                  {savingAdvanced ? 'Salvataggio...' : '💾 Salva Modifiche'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
