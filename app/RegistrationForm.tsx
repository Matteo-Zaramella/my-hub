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

  // Form step: 'identity' per verifica, 'warning' per countdown, 'data' per inserimento dati, 'already_registered' per utenti già registrati
  const [step, setStep] = useState<'identity' | 'warning' | 'data' | 'already_registered'>('identity')

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
  const [warningCountdown, setWarningCountdown] = useState(10) // Timer 10 secondi schermata gialla
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

  // Timer countdown schermata gialla (warning)
  useEffect(() => {
    if (step === 'warning') {
      const timer = setInterval(() => {
        setWarningCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setStep('data')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [step])


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
        setStep('already_registered')
        setLoading(false)
        return
      }

      // NON pre-compilare i dati - l'utente deve inserirli da zero
      // Passa alla schermata warning (countdown 10 secondi)
      setStep('warning')
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
      <div className="absolute inset-0 flex items-center justify-center z-50" style={{ backgroundColor: '#000000' }}>
        <div className="text-white/60">Caricamento...</div>
      </div>
    )
  }

  // Registrazione disabilitata
  if (!registrationEnabled) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: '#000000' }}>
        {/* Logo Fenice in alto a destra - Cliccabile per aprire mappa */}
        <button
          onClick={() => window.open('/mappa-fenice.jpg', '_blank')}
          className="absolute top-8 right-8 w-24 h-24 md:w-32 md:h-32 bg-contain bg-center bg-no-repeat opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          style={{
            backgroundImage: 'url(/fenice-verde.png)'
          }}
          aria-label="Apri mappa Fenice Green Energy Park"
        />

        <div className="relative w-full max-w-md">
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white/40 hover:text-white text-xl transition-colors"
          >
            ✕
          </button>

          <p className="text-white text-xl text-center">
            REGISTRAZIONE NON DISPONIBILE
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto" style={{ backgroundColor: '#000000' }}>
      {/* Logo Fenice in alto a destra - Cliccabile per aprire mappa */}
      <button
        onClick={() => window.open('/mappa-fenice.jpg', '_blank')}
        className="absolute top-8 right-8 w-24 h-24 md:w-32 md:h-32 bg-contain bg-center bg-no-repeat opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
        style={{
          backgroundImage: 'url(/fenice-verde.png)'
        }}
        aria-label="Apri mappa Fenice Green Energy Park"
      />

      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/40 hover:text-white text-xl transition-colors"
        >
          ✕
        </button>

        {/* Step 1: Verifica Identità */}
        {step === 'identity' && (
          <form onSubmit={handleIdentitySubmit} className="flex flex-col gap-3">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="NOME"
              required
              className="w-full px-6 py-4 bg-transparent border border-white/40 rounded-lg text-white text-center text-xl placeholder-white/30 focus:outline-none transition-colors uppercase"
            />

            <input
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="SECONDO NOME"
              className="w-full px-6 py-4 bg-transparent border border-white/40 rounded-lg text-white text-center text-xl placeholder-white/30 focus:outline-none transition-colors uppercase"
            />

            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="COGNOME"
              required
              className="w-full px-6 py-4 bg-transparent border border-white/40 rounded-lg text-white text-center text-xl placeholder-white/30 focus:outline-none transition-colors uppercase"
            />

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !firstName || !lastName}
              className="w-16 h-16 bg-white rounded-lg hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition mx-auto"
            />
          </form>
        )}

        {/* Schermata Warning - Countdown 10 secondi */}
        {step === 'warning' && (
          <div className="w-full max-w-md bg-yellow-400 rounded-lg p-8 text-center">
            <p className="text-black text-xl font-bold mb-4 uppercase">
              ⚠️ ATTENZIONE
            </p>
            <p className="text-black text-lg mb-6">
              L'iscrizione è DEFINITIVA
            </p>
            <p className="text-black text-base mb-4">
              Una volta salvata, non potrai più modificare i tuoi dati
            </p>
            <p className="text-black text-6xl font-bold">
              {warningCountdown}
            </p>
          </div>
        )}

        {/* Schermata Già Registrato */}
        {step === 'already_registered' && (
          <div className="w-full max-w-md text-center">
            <p className="text-white text-xl uppercase">
              PARTECIPANTE REGISTRATO CON SUCCESSO
            </p>
          </div>
        )}

        {/* Step 2: Inserimento Dati */}
        {step === 'data' && foundParticipant && (
          <form onSubmit={handleDataSubmit} className="flex flex-col gap-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="TELEFONO"
              required
              className="w-full px-6 py-4 bg-transparent border border-white/40 rounded-lg text-white text-center text-xl placeholder-white/30 focus:outline-none focus:border-white/60 transition-colors uppercase"
            />

            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="INSTAGRAM"
              required
              className="w-full px-6 py-4 bg-transparent border border-white/40 rounded-lg text-white text-center text-xl placeholder-white/30 focus:outline-none focus:border-white/60 transition-colors uppercase"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL"
              required
              className="w-full px-6 py-4 bg-transparent border border-white/40 rounded-lg text-white text-center text-xl placeholder-white/30 focus:outline-none focus:border-white/60 transition-colors uppercase"
            />

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !phone || !instagram || !email}
              className="w-16 h-16 bg-white rounded-lg hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all mx-auto mt-3"
            />
          </form>
        )}
      </div>
    </div>
  )
}
