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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center border-4 border-purple-500">
              <span className="text-6xl">🔐</span>
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Accesso
            </h1>
            <p className="text-white/70">
              Inserisci il tuo codice
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Codice (es. ABC123)"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-xl font-mono tracking-wider"
                maxLength={8}
                disabled={loading}
                autoComplete="off"
                suppressHydrationWarning
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </button>
          </form>

          {/* Info */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-sm text-white/50">
              💡 Il codice ti è stato inviato via email
            </p>
          </div>

          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="text-white/60 hover:text-white text-sm underline"
          >
            ← Torna indietro
          </button>
        </div>
      </div>
    </div>
  )
}
