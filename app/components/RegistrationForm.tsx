'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface RegistrationFormProps {
  onSuccess: (participantCode: string) => void
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const supabase = createClient()

  // Step 1: Form dati
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    instagram: '',
    nickname: '',
    message: '',
    password: '',
    confirmPassword: '',
  })

  // OTP
  const [otp, setOtp] = useState('')
  const [pendingEmail, setPendingEmail] = useState('')
  const [participantCode, setParticipantCode] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validazione
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.nickname || !formData.password) {
      setError('Compila tutti i campi obbligatori.')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Le password non coincidono.')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password minimo 8 caratteri.')
      setLoading(false)
      return
    }

    try {
      // Invia OTP via email
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Errore invio codice')
      }

      setPendingEmail(formData.email)
      setStep('otp')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Verifica OTP
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: pendingEmail,
          otp,
          registrationData: formData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Codice errato')
      }

      // OTP corretto → partecipante creato
      setParticipantCode(data.participantCode)
      setStep('success')

      // Chiama callback dopo 3 secondi
      setTimeout(() => {
        onSuccess(data.participantCode)
      }, 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Step 1: Form registrazione
  if (step === 'form') {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Registrazione</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="Nome"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500"
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Cognome"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500"
            required
          />

          <input
            type="text"
            name="instagram"
            placeholder="Instagram (opzionale)"
            value={formData.instagram}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500"
          />

          <input
            type="text"
            name="nickname"
            placeholder="Nickname"
            value={formData.nickname}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500"
            required
          />

          <textarea
            name="message"
            placeholder="Messaggio personalizzato (opzionale)"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500 resize-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Crea password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Conferma password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500"
            required
          />

          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
          >
            {loading ? 'Invio...' : 'Registrati'}
          </button>
        </form>
      </div>
    )
  }

  // Step 2: Verifica OTP
  if (step === 'otp') {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">Verifica Email</h2>
        <p className="text-white/80 mb-6 text-center">
          Codice inviato.<br />
          Controlla {pendingEmail}
        </p>

        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <input
            type="text"
            placeholder="Inserisci codice"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white text-center text-2xl tracking-widest placeholder:text-white/40 focus:outline-none focus:border-purple-500"
            required
          />

          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
          >
            {loading ? 'Verifica...' : 'Conferma'}
          </button>
        </form>
      </div>
    )
  }

  // Step 3: Successo
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">Email verificata.</h2>
      <p className="text-white/80 mb-6">
        Il tuo codice: <span className="font-mono font-bold text-2xl text-purple-400">{participantCode}</span>
      </p>
      <p className="text-white/60 text-sm">
        Conservalo.
      </p>
    </div>
  )
}
