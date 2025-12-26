'use client'

import { useState } from 'react'

interface RegistrationFormProps {
  onSuccess: (participantCode: string, participant: any) => void
  onBack?: () => void
}

type Step =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'instagram'
  | 'nickname'
  | 'message'
  | 'password'
  | 'confirmPassword'
  | 'otp'
  | 'success'

const STEPS: Step[] = [
  'firstName',
  'lastName',
  'email',
  'instagram',
  'nickname',
  'message',
  'password', // password e confirmPassword insieme
]

const STEP_LABELS: Record<Step, string> = {
  firstName: 'Nome',
  lastName: 'Cognome',
  email: 'Email',
  instagram: 'Instagram (opzionale)',
  nickname: 'Nickname',
  message: 'Messaggio personale (opzionale)',
  password: 'Password',
  confirmPassword: 'Conferma password',
  otp: 'Codice OTP',
  success: ''
}

const STEP_TYPES: Record<Step, string> = {
  firstName: 'text',
  lastName: 'text',
  email: 'email',
  instagram: 'text',
  nickname: 'text',
  message: 'text',
  password: 'password',
  confirmPassword: 'password',
  otp: 'text',
  success: 'text'
}

export default function RegistrationForm({ onSuccess, onBack }: RegistrationFormProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left')
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

  const currentStep = STEPS[currentStepIndex] as Step

  const handleNext = async () => {
    setError('')

    // Se è lo step password (ultimo), valida entrambe le password
    if (currentStep === 'password') {
      if (!formData.password || formData.password.length < 8) {
        setError('Password minimo 8 caratteri')
        return
      }
      if (!formData.confirmPassword) {
        setError('Conferma la password')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Le password non coincidono')
        return
      }
      // Invia OTP
      await sendOTP()
      return
    }

    // Validazioni per altri step
    const value = formData[currentStep as keyof typeof formData]

    // Campi obbligatori
    if (currentStep !== 'instagram' && currentStep !== 'message' && !value) {
      setError('Campo obbligatorio')
      return
    }

    // Validazione email
    if (currentStep === 'email' && !value.includes('@')) {
      setError('Email non valida')
      return
    }

    // Procedi al prossimo step
    setSlideDirection('left')
    setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1)
    }, 100)
  }

  const handleBack = () => {
    if (currentStepIndex === 0 && onBack) {
      // Prima slide - torna alla scelta auth
      onBack()
    } else if (currentStepIndex > 0) {
      // Slide successive - torna indietro
      setSlideDirection('right')
      setError('')
      setTimeout(() => {
        setCurrentStepIndex(prev => prev - 1)
      }, 100)
    }
  }

  const sendOTP = async () => {
    setIsSubmitting(true)
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

      // Vai allo step OTP
      setSlideDirection('left')
      setTimeout(() => {
        setCurrentStepIndex(STEPS.length) // OTP step
        setIsSubmitting(false)
      }, 100)
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

      // Success!
      setParticipantCode(data.participantCode)
      setSlideDirection('left')
      setTimeout(() => {
        setCurrentStepIndex(STEPS.length + 1) // Success step
        setIsSubmitting(false)
        setTimeout(() => {
          onSuccess(data.participantCode, data.participant)
        }, 3000)
      }, 100)
    } catch (err) {
      setError('Errore di rete')
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (currentStepIndex === STEPS.length) {
      // Step OTP
      verifyOTP()
    } else {
      handleNext()
    }
  }

  const handleChange = (value: string) => {
    if (currentStepIndex === STEPS.length) {
      // OTP step
      setOtp(value)
    } else {
      setFormData(prev => ({
        ...prev,
        [currentStep]: value
      }))
    }
    setError('')
  }

  // Rendering dello step corrente
  const renderStep = () => {
    // Success screen
    if (currentStepIndex === STEPS.length + 1) {
      return (
        <div className="text-center w-full">
          <div className="text-6xl mb-8">✓</div>
          <div className="text-2xl text-white mb-4">Registrazione completata</div>
          <div className="text-white/60 mb-2">Il tuo codice:</div>
          <div className="text-4xl font-bold text-white">{participantCode}</div>
        </div>
      )
    }

    // OTP step
    if (currentStepIndex === STEPS.length) {
      return (
        <>
          <input
            type="text"
            value={otp}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={STEP_LABELS.otp}
            maxLength={6}
            className="flex-1 px-4 py-3 md:px-8 md:py-6 bg-transparent text-white text-lg md:text-2xl focus:outline-none placeholder:text-white/30 text-center tracking-widest"
            autoFocus
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-white/50 hover:text-white transition disabled:opacity-50"
          >
            <span className="text-2xl md:text-4xl">→</span>
          </button>
        </>
      )
    }

    // Step password (ultimo) - due input insieme
    if (currentStep === 'password') {
      return (
        <div className="flex flex-col md:flex-row gap-3 md:gap-6 w-full items-center">
          {/* Freccia indietro */}
          <button
            type="button"
            onClick={handleBack}
            className="text-white/50 hover:text-white transition self-start md:self-auto"
          >
            <span className="text-2xl md:text-4xl">←</span>
          </button>

          {/* Password */}
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Password"
            className="w-full md:flex-1 px-4 py-3 md:px-8 md:py-6 bg-transparent text-white text-base md:text-2xl focus:outline-none placeholder:text-white/30"
            autoFocus
          />

          {/* Conferma password */}
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            placeholder="Conferma password"
            className="w-full md:flex-1 px-4 py-3 md:px-8 md:py-6 bg-transparent text-white text-base md:text-2xl focus:outline-none placeholder:text-white/30"
          />

          {/* Pulsante INVIA - solo testo */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-white/50 hover:text-white transition disabled:opacity-50 text-lg md:text-xl font-bold"
          >
            INVIA
          </button>
        </div>
      )
    }

    // Input step normale
    const currentValue = formData[currentStep as keyof typeof formData]

    return (
      <>
        {/* Freccia indietro (sempre visibile se c'è onBack o se non è la prima slide) */}
        {(currentStepIndex > 0 || onBack) && (
          <button
            type="button"
            onClick={handleBack}
            className="text-white/50 hover:text-white transition"
          >
            <span className="text-2xl md:text-4xl">←</span>
          </button>
        )}

        <input
          type={STEP_TYPES[currentStep]}
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={STEP_LABELS[currentStep]}
          className="flex-1 px-4 py-3 md:px-8 md:py-6 bg-transparent text-white text-base md:text-2xl focus:outline-none placeholder:text-white/30"
          autoFocus
        />

        {/* Freccia avanti */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-white/50 hover:text-white transition disabled:opacity-50"
        >
          <span className="text-2xl md:text-4xl">→</span>
        </button>
      </>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <form onSubmit={handleSubmit} className="flex gap-3 md:gap-6 items-center">
          <div
            className={`flex-1 flex gap-3 md:gap-6 transition-all duration-500 ${
              slideDirection === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right'
            }`}
            key={currentStepIndex}
          >
            {renderStep()}
          </div>
        </form>

        {/* Errore */}
        {error && (
          <div className="mt-4 md:mt-6 text-red-400 text-center text-sm md:text-lg">
            {error}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in-left {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slide-in-right {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
