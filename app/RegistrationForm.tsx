'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface RegistrationFormProps {
  onClose: () => void
  onSuccess: () => void
  participantCode: string | null
}

export default function RegistrationForm({ onClose, onSuccess, participantCode }: RegistrationFormProps) {
  const supabase = createClient()

  // Form step: 'identity' per verifica, 'data' per inserimento dati
  const [step, setStep] = useState<'identity' | 'data'>('identity')

  // Dati form
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [instagram, setInstagram] = useState('')
  const [email, setEmail] = useState('')

  // Stati
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [foundParticipant, setFoundParticipant] = useState<any>(null)
  const [countdown, setCountdown] = useState(10) // Timer 10 secondi
  const [canSubmit, setCanSubmit] = useState(false) // Può inviare solo dopo 10 secondi

  // Timer countdown quando si arriva allo step 2
  useEffect(() => {
    if (step === 'data' && !canSubmit) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setCanSubmit(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [step, canSubmit])

  // Step 1: Verifica identità
  const handleIdentitySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Costruisci il nome completo
      const fullName = middleName
        ? `${firstName} ${middleName} ${lastName}`
        : `${firstName} ${lastName}`

      // Cerca il partecipante nel database
      const { data, error: searchError } = await supabase
        .from('game_participants')
        .select('*')
        .ilike('participant_name', fullName)
        .single()

      if (searchError || !data) {
        setError('Nome non trovato. Verifica di aver inserito il nome corretto come registrato.')
        setLoading(false)
        return
      }

      // Partecipante trovato!
      setFoundParticipant(data)

      // Verifica se ha già completato la registrazione
      if (data.registration_completed) {
        setError('Hai già completato la registrazione. I dati non possono essere modificati.')
        setLoading(false)
        return
      }

      // NON pre-compilare i dati - l'utente deve inserirli da zero
      // Passa allo step 2
      setStep('data')
    } catch (err) {
      console.error('Error verifying identity:', err)
      setError('Errore nella verifica. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Salva dati
  const handleDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validazione - TUTTI i campi sono obbligatori
    if (!phone || !instagram || !email) {
      setError('Tutti i campi sono obbligatori: telefono, Instagram ed email')
      setLoading(false)
      return
    }

    try {
      // Aggiorna i dati nel database
      const { error: updateError } = await supabase
        .from('game_participants')
        .update({
          phone_number: phone.trim() || null,
          instagram_handle: instagram.trim() || null,
          email: email.trim() || null,
          registration_completed: true
        })
        .eq('id', foundParticipant.id)

      if (updateError) {
        console.error('Error updating data:', updateError)
        setError('Errore nel salvare i dati. Riprova.')
        setLoading(false)
        return
      }

      // Successo! Salva il codice partecipante in localStorage
      if (foundParticipant?.participant_code) {
        localStorage.setItem('registrationCompleted', foundParticipant.participant_code)
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error saving data:', err)
      setError('Errore nel salvare i dati. Riprova.')
      setLoading(false)
    }
  }

  return (
    <div className="absolute inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-2 border-red-500 rounded-2xl p-6 md:p-8 my-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">📝 Iscrizione</h2>
            <p className="text-white/60 text-sm mt-1">
              {step === 'identity' ? 'Step 1/2: Verifica identità' : 'Step 2/2: I tuoi dati'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Step 1: Verifica Identità */}
        {step === 'identity' && (
          <form onSubmit={handleIdentitySubmit} className="space-y-4">
            <p className="text-white/80 text-sm mb-4">
              Inserisci il tuo nome come registrato per verificare la tua identità:
            </p>

            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Nome *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Mario"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Secondo Nome */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Secondo Nome <span className="text-white/40">(se presente)</span>
              </label>
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                placeholder="Giovanni"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Cognome */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Cognome *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Rossi"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !firstName || !lastName}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Verifica in corso...' : 'Continua →'}
            </button>
          </form>
        )}

        {/* Step 2: Inserimento Dati */}
        {step === 'data' && foundParticipant && (
          <form onSubmit={handleDataSubmit} className="space-y-4">
            {/* Conferma identità */}
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-4">
              <p className="text-green-300 font-semibold">
                ✅ Identità verificata: {foundParticipant.participant_name}
              </p>
            </div>

            <p className="text-white/80 text-sm mb-4">
              Inserisci i tuoi dati di contatto:
            </p>

            {/* Telefono */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Numero di Cellulare *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+39 123 456 7890"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Username Instagram *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-white/5 border border-r-0 border-white/20 rounded-l-lg text-white/60">
                  @
                </span>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="username"
                  required
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-r-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Indirizzo Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@email.com"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Countdown Warning */}
            {!canSubmit && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-300 font-semibold text-center mb-2">
                  ⚠️ Attenzione: L'iscrizione è DEFINITIVA
                </p>
                <p className="text-yellow-200 text-sm text-center mb-2">
                  Una volta salvata, non potrai più modificare i tuoi dati.
                  Controlla attentamente tutte le informazioni inserite.
                </p>
                <p className="text-yellow-100 text-lg font-bold text-center">
                  {countdown} secondi
                </p>
              </div>
            )}

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-blue-200 text-xs">
                💡 Tutti i campi sono obbligatori per completare l'iscrizione
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep('identity')
                  setError('')
                }}
                className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition"
              >
                ← Indietro
              </button>
              <button
                type="submit"
                disabled={loading || !canSubmit}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Salvataggio...' : !canSubmit ? `Attendi ${countdown}s...` : '✓ Completa Iscrizione'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
