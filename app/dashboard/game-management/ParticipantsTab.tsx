'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Participant {
  id: number
  user_id: string | null
  participant_name: string
  email: string | null
  phone_number: string | null
  instagram_handle: string | null
  nickname: string | null
  participant_code: string
  notes: string | null
  category: string | null
  partner_name: string | null
  is_couple: boolean
  current_points: number
  registration_completed: boolean
  participant_type: string
  created_at: string
}

export default function ParticipantsTab() {
  const supabase = createClient()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<Participant>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newParticipant, setNewParticipant] = useState({
    participant_name: '',
    email: '',
    nickname: '',
    instagram_handle: '',
    phone_number: '',
    notes: '',
    category: '',
    participant_type: 'principale'
  })

  useEffect(() => {
    loadParticipants()
  }, [])

  async function loadParticipants() {
    setLoading(true)
    const { data, error } = await supabase
      .from('game_participants')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading participants:', error)
    } else {
      setParticipants(data || [])
    }
    setLoading(false)
  }

  // Generate unique participant code
  function generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  // Add new participant
  async function handleAddParticipant() {
    if (!newParticipant.participant_name) {
      alert('Nome obbligatorio')
      return
    }

    const { error } = await supabase.from('game_participants').insert({
      ...newParticipant,
      participant_code: generateCode(),
      registration_completed: false,
      current_points: 0,
      is_couple: false
    })

    if (error) {
      console.error('Error adding participant:', error)
      alert('Errore: ' + error.message)
    } else {
      setShowAddModal(false)
      setNewParticipant({
        participant_name: '',
        email: '',
        nickname: '',
        instagram_handle: '',
        phone_number: '',
        notes: '',
        category: '',
        participant_type: 'principale'
      })
      loadParticipants()
    }
  }

  // Start editing
  function startEdit(participant: Participant) {
    setEditingId(participant.id)
    setEditForm({
      participant_name: participant.participant_name,
      email: participant.email,
      nickname: participant.nickname,
      instagram_handle: participant.instagram_handle,
      phone_number: participant.phone_number,
      notes: participant.notes,
      category: participant.category,
      current_points: participant.current_points,
      participant_type: participant.participant_type,
      is_couple: participant.is_couple,
      partner_name: participant.partner_name
    })
  }

  // Save edit
  async function saveEdit() {
    if (!editingId) return

    const { error } = await supabase
      .from('game_participants')
      .update(editForm)
      .eq('id', editingId)

    if (error) {
      console.error('Error updating participant:', error)
      alert('Errore: ' + error.message)
    } else {
      setEditingId(null)
      setEditForm({})
      loadParticipants()
    }
  }

  // Delete participant
  async function handleDelete(id: number, name: string) {
    if (!confirm(`Eliminare ${name}?`)) return

    const { error } = await supabase
      .from('game_participants')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting participant:', error)
      alert('Errore: ' + error.message)
    } else {
      loadParticipants()
    }
  }

  // Filter participants
  const filteredParticipants = participants.filter(p =>
    p.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.participant_code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              👥 Gestione Partecipanti
            </h2>
            <p className="text-white/60 mt-1">
              {participants.length} partecipanti totali
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium"
          >
            + Aggiungi Partecipante
          </button>
        </div>

        {/* Search */}
        <div className="mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cerca per nome, email, nickname o codice..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40"
          />
        </div>
      </div>

      {/* Participants List */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/60">Caricamento...</div>
        ) : filteredParticipants.length === 0 ? (
          <div className="p-8 text-center text-white/60">
            {searchTerm ? 'Nessun risultato trovato' : 'Nessun partecipante'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-white/80 font-medium">Nome</th>
                  <th className="px-4 py-3 text-left text-white/80 font-medium">Codice</th>
                  <th className="px-4 py-3 text-left text-white/80 font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-white/80 font-medium">Nickname</th>
                  <th className="px-4 py-3 text-left text-white/80 font-medium">Punti</th>
                  <th className="px-4 py-3 text-left text-white/80 font-medium">Stato</th>
                  <th className="px-4 py-3 text-right text-white/80 font-medium">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredParticipants.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5">
                    {editingId === p.id ? (
                      // Edit mode
                      <>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editForm.participant_name || ''}
                            onChange={(e) => setEditForm({ ...editForm, participant_name: e.target.value })}
                            className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 font-mono text-purple-400">{p.participant_code}</td>
                        <td className="px-4 py-3">
                          <input
                            type="email"
                            value={editForm.email || ''}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editForm.nickname || ''}
                            onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                            className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={editForm.current_points || 0}
                            onChange={(e) => setEditForm({ ...editForm, current_points: parseInt(e.target.value) || 0 })}
                            className="w-20 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${p.registration_completed ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {p.registration_completed ? 'Registrato' : 'Incompleto'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={saveEdit}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm mr-2 hover:bg-green-700"
                          >
                            Salva
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-white/10 text-white rounded text-sm hover:bg-white/20"
                          >
                            Annulla
                          </button>
                        </td>
                      </>
                    ) : (
                      // View mode
                      <>
                        <td className="px-4 py-3 text-white font-medium">{p.participant_name}</td>
                        <td className="px-4 py-3 font-mono text-purple-400">{p.participant_code}</td>
                        <td className="px-4 py-3 text-white/70">{p.email || '-'}</td>
                        <td className="px-4 py-3 text-white/70">{p.nickname || '-'}</td>
                        <td className="px-4 py-3 text-white font-medium">{p.current_points}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${p.registration_completed ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {p.registration_completed ? 'Registrato' : 'Incompleto'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => startEdit(p)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm mr-2 hover:bg-blue-700"
                          >
                            Modifica
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.participant_name)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            Elimina
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold text-white mb-4">Aggiungi Partecipante</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-1">Nome completo *</label>
                <input
                  type="text"
                  value={newParticipant.participant_name}
                  onChange={(e) => setNewParticipant({ ...newParticipant, participant_name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={newParticipant.email}
                  onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-1">Nickname</label>
                <input
                  type="text"
                  value={newParticipant.nickname}
                  onChange={(e) => setNewParticipant({ ...newParticipant, nickname: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-1">Instagram</label>
                  <input
                    type="text"
                    value={newParticipant.instagram_handle}
                    onChange={(e) => setNewParticipant({ ...newParticipant, instagram_handle: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1">Telefono</label>
                  <input
                    type="tel"
                    value={newParticipant.phone_number}
                    onChange={(e) => setNewParticipant({ ...newParticipant, phone_number: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-1">Categoria</label>
                <input
                  type="text"
                  value={newParticipant.category}
                  onChange={(e) => setNewParticipant({ ...newParticipant, category: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  placeholder="es. Arcella, Centro, ..."
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-1">Note</label>
                <textarea
                  value={newParticipant.notes}
                  onChange={(e) => setNewParticipant({ ...newParticipant, notes: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white h-20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
              >
                Annulla
              </button>
              <button
                onClick={handleAddParticipant}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
              >
                Aggiungi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
