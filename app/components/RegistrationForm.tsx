'use client'

import { useState } from 'react'

interface RegistrationFormProps {
  onSuccess: (participantCode: string, participant: any) => void
  onBack?: () => void
}

export default function RegistrationForm({ onSuccess, onBack }: RegistrationFormProps) {
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form')
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
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [participantCode, setParticipantCode] = useState('')

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('Nome obbligatorio')
      return false
    }
    if (!formData.lastName.trim()) {
      setError('Cognome obbligatorio')
      return false
    }
    if (!formData.email.includes('@')) {
      setError('Email non valida')
      return false
    }
    if (!formData.nickname.trim()) {
      setError('Nickname obbligatorio')
      return false
    }
    if (!formData.password || formData.password.length < 8) {
      setError('Password minimo 8 caratteri')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Le password non coincidono')
      return false
    }
    return true
  }

  const sendOTP = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Errore invio OTP')
        setIsSubmitting(false)
        return
      }

      setStep('otp')
      setIsSubmitting(false)
    } catch (err) {
      setError('Errore di rete')
      setIsSubmitting(false)
    }
  }

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Inserisci un codice a 6 cifre')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp,
          registrationData: formData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Codice errato')
        setIsSubmitting(false)
        return
      }

      setParticipantCode(data.participantCode)
      setStep('success')
      setIsSubmitting(false)

      setTimeout(() => {
        onSuccess(data.participantCode, data.participant)
      }, 3000)
    } catch (err) {
      setError('Errore di rete')
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 'form') {
      sendOTP()
    } else if (step === 'otp') {
      verifyOTP()
    }
  }

  // Success screen
  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-8">✓</div>
          <div className="text-2xl text-white mb-4">Registrazione completata</div>
          <div className="text-white/60 mb-2">Il tuo codice:</div>
          <div className="text-4xl font-bold text-white">{participantCode}</div>
        </div>
      </div>
    )
  }

  // OTP screen
  if (step === 'otp') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-white mb-2">Verifica Email</h2>
              <p className="text-white/60">
                Inserisci il codice inviato a {formData.email}
              </p>
            </div>

            <input
              type="text"
              value={otp}
              onChange={(e) => { setOtp(e.target.value); setError('') }}
              placeholder="Codice OTP"
              maxLength={6}
              className="w-full px-6 py-4 bg-transparent text-white text-2xl focus:outline-none placeholder:text-white/30 text-center tracking-widest border-b border-white/20"
              autoFocus
            />

            {error && (
              <div className="text-red-400 text-center text-sm">{error}</div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="flex-1 py-3 text-white/50 hover:text-white transition"
              >
                ← Indietro
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 text-white/50 hover:text-white transition disabled:opacity-50 font-bold"
              >
                {isSubmitting ? '...' : 'VERIFICA'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Main form - tutti i campi insieme
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg my-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="text-white/50 hover:text-white transition"
              >
                <span className="text-2xl">←</span>
              </button>
            )}
            <h2 className="text-xl text-white flex-1 text-center">Registrazione</h2>
            {onBack && <div className="w-6"></div>}
          </div>

          {/* Campi form */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="Nome *"
                className="flex-1 px-4 py-3 bg-transparent text-white focus:outline-none placeholder:text-white/30 border-b border-white/20"
              />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Cognome *"
                className="flex-1 px-4 py-3 bg-transparent text-white focus:outline-none placeholder:text-white/30 border-b border-white/20"
              />
            </div>

            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Email *"
              className="w-full px-4 py-3 bg-transparent text-white focus:outline-none placeholder:text-white/30 border-b border-white/20"
            />

            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => handleChange('nickname', e.target.value)}
              placeholder="Nickname *"
              className="w-full px-4 py-3 bg-transparent text-white focus:outline-none placeholder:text-white/30 border-b border-white/20"
            />

            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
              placeholder="Instagram (opzionale)"
              className="w-full px-4 py-3 bg-transparent text-white focus:outline-none placeholder:text-white/30 border-b border-white/20"
            />

            <input
              type="text"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Messaggio personale (opzionale)"
              className="w-full px-4 py-3 bg-transparent text-white focus:outline-none placeholder:text-white/30 border-b border-white/20"
            />

            <div className="flex gap-3">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Password *"
                className="flex-1 px-4 py-3 bg-transparent text-white focus:outline-none placeholder:text-white/30 border-b border-white/20"
              />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="Conferma *"
                className="flex-1 px-4 py-3 bg-transparent text-white focus:outline-none placeholder:text-white/30 border-b border-white/20"
              />
            </div>
          </div>

          {/* Errore */}
          {error && (
            <div className="text-red-400 text-center text-sm">{error}</div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 mt-6 text-white/50 hover:text-white transition disabled:opacity-50 font-bold text-lg"
          >
            {isSubmitting ? 'Invio in corso...' : 'REGISTRATI'}
          </button>

          <p className="text-white/30 text-xs text-center">
            * Campi obbligatori
          </p>
        </form>
      </div>
    </div>
  )
}
