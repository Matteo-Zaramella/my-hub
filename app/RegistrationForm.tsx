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
  const [loading, setLoading] = useState(true) // Inizia come loading per check settings
  const [error, setError] = useState('')
  const [foundParticipant, setFoundParticipant] = useState<any>(null)
  const [countdown, setCountdown] = useState(10) // Timer 10 secondi
  const [canSubmit, setCanSubmit] = useState(false) // Può inviare solo dopo 10 secondi
  const [registrationEnabled, setRegistrationEnabled] = useState(false)

  // Check se la registrazione è abilitata
  useEffect(() => {
    checkRegistrationStatus()
  }, [])

  async function checkRegistrationStatus() {
    try {
      const { data, error } = await supabase
        .from('game_settings')
        .select('setting_value')
        .eq('setting_key', 'registration_enabled')
        .single()

      if (error) {
        console.error('Error checking registration status:', error)
        setRegistrationEnabled(false)
      } else {
        setRegistrationEnabled(data?.setting_value || false)
      }
    } catch (err) {
      console.error('Error:', err)
      setRegistrationEnabled(false)
    } finally {
      setLoading(false)
    }
  }

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

      // Successo! Invia email di conferma
      try {
        await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            name: foundParticipant.participant_name,
            participantCode: foundParticipant.participant_code
          })
        })
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError)
        // Non bloccare la registrazione se l'email fallisce
      }

      // Salva il codice partecipante in localStorage
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

  // Loading state
  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-50" style={{ backgroundColor: '#0a2818' }}>
        <div className="text-white/60">Caricamento...</div>
      </div>
    )
  }

  // Registrazione disabilitata
  if (!registrationEnabled) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: '#0a2818' }}>
        {/* Sfondo Fenice Verde */}
        <div
          className="absolute inset-y-0 left-0 bg-contain bg-left bg-no-repeat opacity-30"
          style={{
            backgroundImage: 'url(/fenice-verde-full.jpg)',
            width: '50%',
            maxWidth: '800px'
          }}
        />

        <div className="relative w-full max-w-md bg-black/60 backdrop-blur-md border border-white/20 rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">⏸️ Registrazione Non Disponibile</h2>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white text-xl transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-white/70">
              La registrazione non è ancora aperta.
            </p>
            <p className="text-white/50 text-sm">
              Riceverai un link quando sarà possibile registrarsi per Il Castello di Zara.
            </p>
            <p className="text-green-400/70 text-sm font-medium mt-6">
              Resta sintonizzato! 🎮
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto" style={{ backgroundColor: '#0a2818' }}>
      {/* Sfondo Fenice Verde - Posizionata a Sinistra */}
      <div
        className="absolute inset-y-0 left-0 bg-contain bg-left bg-no-repeat opacity-30"
        style={{
          backgroundImage: 'url(/fenice-verde-full.jpg)',
          width: '50%',
          maxWidth: '800px'
        }}
      />

      <div className="relative w-full max-w-md bg-black/60 backdrop-blur-md border border-white/20 rounded-lg p-8 my-8">
        {/* Header Minimale */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">📝 Iscrizione</h2>
            <p className="text-white/40 text-sm mt-1">
              {step === 'identity' ? 'Step 1/2: Verifica identità' : 'Step 2/2: I tuoi dati'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Step 1: Verifica Identità */}
        {step === 'identity' && (
          <form onSubmit={handleIdentitySubmit} className="space-y-6">
            <p className="text-white/60 text-sm">
              Inserisci il tuo nome come registrato per verificare la tua identità:
            </p>

            {/* Nome */}
            <div>
              <label className="block text-xs text-white/40 mb-2">
                Nome *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Mario"
                required
                className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>

            {/* Secondo Nome */}
            <div>
              <label className="block text-xs text-white/40 mb-2">
                Secondo Nome <span className="text-white/30">(solo se hai un doppio nome)</span>
              </label>
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                placeholder="es: Francesco"
                className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
              />
              <p className="text-xs text-white/30 mt-1">
                💡 Es: Giovanni Francesco Rossi → secondo nome = "Francesco"
              </p>
            </div>

            {/* Cognome */}
            <div>
              <label className="block text-xs text-white/40 mb-2">
                Cognome Completo *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="es: De Sandre"
                required
                className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
              />
              <p className="text-xs text-white/30 mt-1">
                💡 Includi "De", "Della", "Di" ecc. nel cognome
              </p>
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
              className="w-full bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Verifica in corso...' : 'Continua →'}
            </button>
          </form>
        )}

        {/* Step 2: Inserimento Dati */}
        {step === 'data' && foundParticipant && (
          <form onSubmit={handleDataSubmit} className="space-y-6">
            {/* Conferma identità */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-white/80 text-sm">
                ✅ Identità verificata: <span className="font-semibold">{foundParticipant.participant_name}</span>
              </p>
            </div>

            <p className="text-white/60 text-sm">
              Inserisci i tuoi dati di contatto:
            </p>

            {/* Telefono */}
            <div>
              <label className="block text-xs text-white/40 mb-2">
                Numero di Cellulare *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+39 123 456 7890"
                required
                className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-xs text-white/40 mb-2">
                Username Instagram *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-transparent border border-r-0 border-white/20 rounded-l-lg text-white/40">
                  @
                </span>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="username"
                  required
                  className="flex-1 px-4 py-3 bg-transparent border border-white/20 rounded-r-lg text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-white/40 mb-2">
                Indirizzo Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@email.com"
                required
                className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
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
