'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ParticipantLoginProps {
  onLoginSuccess: (participant: any) => void
}

export default function ParticipantLogin({ onLoginSuccess }: ParticipantLoginProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!code.trim()) {
      setError('Inserisci il tuo codice partecipante')
      setLoading(false)
      return
    }

    try {
      // Cerca il partecipante tramite codice
      const { data: participant, error: fetchError } = await supabase
        .from('game_participants')
        .select('*')
        .eq('participant_code', code.toUpperCase())
        .single()

      if (fetchError || !participant) {
        setError('Codice non valido. Riprova.')
        setLoading(false)
        return
      }

      // Salva il partecipante in localStorage per persistenza
      localStorage.setItem('game_participant', JSON.stringify(participant))

      // Salva anche il codice partecipante separatamente per sincronizzazione indizi
      localStorage.setItem('participantCode', participant.participant_code)

      // Callback di successo
      onLoginSuccess(participant)
    } catch (error) {
      console.error('Login error:', error)
      setError('Errore durante il login. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-sm w-full space-y-8 text-center">
        {/* Title */}
        <div>
          <h1 className="text-xl font-light text-white mb-2">
            Accesso
          </h1>
          <p className="text-white/40 text-sm">
            Inserisci il tuo codice
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="CODICE"
              className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40 text-center text-lg font-mono tracking-wider"
              maxLength={8}
              disabled={loading}
              autoComplete="off"
              suppressHydrationWarning
            />
          </div>

          {error && (
            <p className="text-white/60 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full border border-white/20 text-white px-6 py-3 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {loading ? '...' : 'Accedi'}
          </button>
        </form>

        {/* Info */}
        <p className="text-xs text-white/30">
          Il codice ti è stato inviato via email
        </p>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="text-white/30 hover:text-white/60 text-sm transition"
        >
          Torna indietro
        </button>
      </div>
    </div>
  )
}
