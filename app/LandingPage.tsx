'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import TerminalWelcome from './components/TerminalWelcome'
import UndertaleNameEntry from './components/UndertaleNameEntry'
import UndertaleEmailEntry from './components/UndertaleEmailEntry'
import UndertaleOTPEntry from './components/UndertaleOTPEntry'
import UndertaleCodeEntry from './components/UndertaleCodeEntry'

type FlowStep =
  | 'loading'           // Verifica iniziale
  | 'terminal'          // TerminalWelcome (prima visita)
  | 'name'              // Inserimento nome (prima visita)
  | 'email'             // Inserimento email (prima visita)
  | 'otp'               // Verifica OTP (prima visita)
  | 'code'              // Inserimento codice (ritorno)
  | 'main'              // Pagina principale con countdown

export default function LandingPage() {
  const router = useRouter()
  const supabase = createClient()

  // Flow state
  const [step, setStep] = useState<FlowStep>('loading')

  // User data
  const [characterName, setCharacterName] = useState('')
  const [email, setEmail] = useState('')
  const [participantCode, setParticipantCode] = useState<string | null>(null)

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Countdown
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Game settings
  const [ceremonyActive, setCeremonyActive] = useState(false)
  const [passwordInputEnabled, setPasswordInputEnabled] = useState(false)
  const [minigameButtonEnabled, setMinigameButtonEnabled] = useState(false)
  const [wishlistEnabled, setWishlistEnabled] = useState(true)

  // Clues
  const [cluesFound, setCluesFound] = useState(0)
  const [foundClueWords, setFoundClueWords] = useState<string[]>([])
  const [ceremonyClues, setCeremonyClues] = useState<{ word: string; order: number }[]>([])

  // Password modal
  const [showGamePassword, setShowGamePassword] = useState(false)
  const [gamePassword, setGamePassword] = useState('')
  const [showBonusMessage, setShowBonusMessage] = useState(false)

  const GAME_PASSWORD = 'EVOLUZIONE'

  // ===== INITIAL CHECK =====
  useEffect(() => {
    checkUserStatus()
  }, [])

  async function checkUserStatus() {
    // 1. Check if user has a valid participant code in localStorage
    const savedCode = localStorage.getItem('participantCode')

    if (savedCode) {
      // Verify code is valid in database
      const { data: participant, error } = await supabase
        .from('game_participants')
        .select('*')
        .eq('participant_code', savedCode)
        .single()

      if (participant && !error) {
        // Valid user - go directly to game area
        localStorage.setItem('game_participant', JSON.stringify(participant))
        router.replace('/game/area')
        return
      } else {
        // Invalid code - clear localStorage
        localStorage.removeItem('participantCode')
        localStorage.removeItem('game_participant')
      }
    }

    // 2. Check if user has seen terminal welcome before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')

    if (hasSeenWelcome) {
      // Returning user without valid code - show code entry
      setStep('code')
    } else {
      // New user - show terminal welcome
      setStep('terminal')
    }
  }

  // ===== GAME SETTINGS =====
  useEffect(() => {
    if (step !== 'main') return

    loadGameSettings()
    loadCeremonyClues()
    loadFoundClues()

    const interval = setInterval(loadGameSettings, 2000)
    return () => clearInterval(interval)
  }, [step])

  async function loadGameSettings() {
    const { data } = await supabase
      .from('game_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['ceremony_active', 'registration_button_enabled', 'wishlist_button_enabled', 'password_input_enabled', 'minigame_button_enabled'])

    if (data) {
      data.forEach(setting => {
        switch(setting.setting_key) {
          case 'ceremony_active':
            setCeremonyActive(setting.setting_value || false)
            break
          case 'wishlist_button_enabled':
            setWishlistEnabled(setting.setting_value ?? true)
            break
          case 'password_input_enabled':
            setPasswordInputEnabled(setting.setting_value || false)
            break
          case 'minigame_button_enabled':
            setMinigameButtonEnabled(setting.setting_value || false)
            break
        }
      })
    }
  }

  async function loadCeremonyClues() {
    const { data } = await supabase
      .from('ceremony_clue_riddles')
      .select('clue_word, order_number')
      .order('order_number')

    if (data) {
      setCeremonyClues(data.map(row => ({ word: row.clue_word, order: row.order_number })))
    }
  }

  async function loadFoundClues() {
    const { data } = await supabase
      .from('ceremony_clues_found')
      .select('clue_word')
      .eq('participant_code', 'GLOBAL')

    if (data) {
      const words = data.map(row => row.clue_word)
      setFoundClueWords(words)
      setCluesFound(words.length)
      // Non reindirizzare automaticamente - mostra la barra password
    }
  }

  // ===== COUNTDOWN =====
  useEffect(() => {
    if (step !== 'main') return

    async function initializeCountdown() {
      const { data: challenges } = await supabase
        .from('game_challenges')
        .select('challenge_number, title, start_date, end_date')
        .order('challenge_number', { ascending: true })

      const updateCountdown = () => {
        const now = new Date()
        const ceremonyStart = new Date('2026-01-25T00:00:00')
        const ceremonyEnd = new Date('2026-01-26T23:59:59')

        let targetDate: Date | null = null

        if (now < ceremonyStart) {
          targetDate = ceremonyStart
        } else if (now >= ceremonyStart && now <= ceremonyEnd) {
          targetDate = ceremonyEnd
        } else {
          const nextChallenge = challenges?.find(ch => now < new Date(ch.end_date))
          if (nextChallenge) {
            targetDate = new Date(nextChallenge.end_date)
          }
        }

        if (!targetDate) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
          return
        }

        const distance = targetDate.getTime() - now.getTime()
        if (distance < 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
          return
        }

        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }

      updateCountdown()
      const interval = setInterval(updateCountdown, 1000)
      return () => clearInterval(interval)
    }

    initializeCountdown()
  }, [step])

  // ===== HANDLERS =====

  // Terminal complete
  const handleWelcomeComplete = () => {
    localStorage.setItem('hasSeenWelcome', 'true')
    setStep('name')
  }

  // Name entry complete
  const handleNameComplete = (name: string) => {
    setCharacterName(name)
    localStorage.setItem('characterName', name)
    setStep('email')
  }

  // Email entry complete - send OTP
  const handleEmailComplete = async (enteredEmail: string) => {
    setEmail(enteredEmail)
    setIsLoading(true)
    setError('')

    console.log('Sending OTP to:', enteredEmail)

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: enteredEmail })
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        setError(data.error || 'Errore invio codice')
        setIsLoading(false)
        return
      }

      setIsLoading(false)
      setStep('otp')
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Errore di rete')
      setIsLoading(false)
    }
  }

  // OTP verification complete - create user
  const handleOTPComplete = async (otp: string) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          registrationData: {
            firstName: characterName,
            lastName: '',
            nickname: characterName,
            password: generateRandomPassword(),
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Codice errato')
        setIsLoading(false)
        return
      }

      // Success - save and redirect
      localStorage.setItem('participantCode', data.participantCode)
      localStorage.setItem('game_participant', JSON.stringify(data.participant))
      localStorage.setItem('registrationCompleted', data.participantCode)

      router.replace('/game/area')
    } catch {
      setError('Errore di rete')
      setIsLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Errore reinvio')
      }
    } catch {
      setError('Errore di rete')
    }

    setIsLoading(false)
  }

  // Code entry complete (returning user)
  const handleCodeComplete = async (code: string) => {
    setIsLoading(true)
    setError('')

    try {
      const { data: participant, error: dbError } = await supabase
        .from('game_participants')
        .select('*')
        .eq('participant_code', code.toUpperCase())
        .single()

      if (dbError || !participant) {
        setError('Codice non valido')
        setIsLoading(false)
        return
      }

      // Valid - save and redirect
      localStorage.setItem('participantCode', code.toUpperCase())
      localStorage.setItem('game_participant', JSON.stringify(participant))

      router.replace('/game/area')
    } catch {
      setError('Errore di connessione')
      setIsLoading(false)
    }
  }

  // New user from code entry screen
  const handleNewUser = () => {
    // Reset and start fresh
    localStorage.removeItem('hasSeenWelcome')
    localStorage.removeItem('characterName')
    setStep('terminal')
  }

  // Generate random password for auto-registration
  function generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'
    let password = ''
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  // Password submit handler
  const handleGamePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const input = gamePassword.trim().toUpperCase()

    if (!input) return

    if (input === GAME_PASSWORD && cluesFound >= 10) {
      // Mostra messaggio punti bonus invece di reindirizzare subito
      setShowBonusMessage(true)
      setGamePassword('')
      return
    }

    if (cluesFound < 10 && ceremonyActive) {
      const foundClue = ceremonyClues.find(clue => clue.word === input)

      if (foundClue && !foundClueWords.includes(input)) {
        const { error } = await supabase
          .from('ceremony_clues_found')
          .insert({
            participant_code: 'GLOBAL',
            clue_word: input,
          })

        if (!error) {
          const newFoundWords = [...foundClueWords, input]
          setFoundClueWords(newFoundWords)
          setCluesFound(newFoundWords.length)
        }
      }
    }

    setGamePassword('')
    setShowGamePassword(false)
  }

  // ===== RENDER =====

  // Loading state
  if (step === 'loading') {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white/50">Caricamento...</div>
      </div>
    )
  }

  // Terminal Welcome
  if (step === 'terminal') {
    return <TerminalWelcome onComplete={handleWelcomeComplete} daysRemaining={timeLeft.days} />
  }

  // Name Entry
  if (step === 'name') {
    return <UndertaleNameEntry onComplete={handleNameComplete} maxLength={20} />
  }

  // Email Entry
  if (step === 'email') {
    return (
      <UndertaleEmailEntry
        onComplete={handleEmailComplete}
        onBack={() => setStep('name')}
        isLoading={isLoading}
        error={error}
      />
    )
  }

  // OTP Entry
  if (step === 'otp') {
    return (
      <UndertaleOTPEntry
        onComplete={handleOTPComplete}
        onBack={() => { setError(''); setStep('email') }}
        onResend={handleResendOTP}
        email={email}
        isLoading={isLoading}
        error={error}
      />
    )
  }

  // Code Entry (returning user)
  if (step === 'code') {
    return (
      <UndertaleCodeEntry
        onComplete={handleCodeComplete}
        onNewUser={handleNewUser}
        isLoading={isLoading}
        error={error}
      />
    )
  }

  // Main page (should not normally reach here as users go to game area)
  const gridSize = 10
  const totalCircles = gridSize * gridSize
  const countdownFinished = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Wishlist Button - Top Left */}
      {wishlistEnabled && (
        <button
          onClick={() => router.push('/wishlist-public')}
          className="fixed top-4 left-4 bg-white/5 backdrop-blur-sm rounded-lg p-6 hover:bg-white/10 transition-all duration-300 z-40"
        >
          <div className="text-5xl">🎁</div>
        </button>
      )}

      {/* Login Button - Top Right */}
      <button
        onClick={() => router.push('/login')}
        className="fixed top-4 right-4 bg-white/5 backdrop-blur-sm rounded-lg p-6 hover:bg-white/10 transition-all duration-300 z-40"
      >
        <div className="text-5xl">👤</div>
      </button>

      {/* Minigame Button - Bottom Left */}
      {minigameButtonEnabled && (
        <button
          onClick={() => router.push('/minigames')}
          className="fixed bottom-4 left-4 bg-white/5 backdrop-blur-sm rounded-lg p-6 hover:bg-white/10 transition-all duration-300 z-40"
        >
          <div className="text-5xl">🕹️</div>
        </button>
      )}

      {/* Password Input Button - Bottom Right */}
      {passwordInputEnabled && (
        <button
          onClick={() => setShowGamePassword(true)}
          className="fixed bottom-4 right-4 bg-white/5 backdrop-blur-sm rounded-lg p-6 hover:bg-white/10 transition-all duration-300 z-40"
        >
          <div className="text-5xl">🚪</div>
        </button>
      )}

      {/* Circle Background Grid */}
      {cluesFound < 10 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full max-w-[100vh] max-h-screen grid grid-cols-10 grid-rows-10 gap-0 p-1 sm:p-2 md:p-3 lg:p-4 aspect-square">
            {Array.from({ length: totalCircles }, (_, index) => {
              const row = Math.floor(index / gridSize)
              const col = index % gridSize
              const isInTimerArea = row >= 3 && row <= 6 && col >= 3 && col <= 6

              if (isInTimerArea && !countdownFinished) {
                return <div key={index} className="flex items-center justify-center"></div>
              }

              let circleFill = ''
              if (ceremonyActive) {
                const foundOrders = foundClueWords
                  .map(word => {
                    const clue = ceremonyClues.find(c => c.word === word)
                    return clue ? clue.order - 1 : -1
                  })
                  .filter(order => order >= 0)

                if (foundOrders.includes(col)) {
                  circleFill = 'bg-white'
                }
              }

              return (
                <div key={index} className="flex items-center justify-center w-full aspect-square p-0.5 sm:p-1 md:p-1.5 lg:p-2" style={{height: 'auto'}}>
                  <div className={`w-full h-full rounded-full border border-white sm:border-2 ${circleFill} transition-colors duration-500`}></div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Countdown Timer */}
      {!countdownFinished && cluesFound < 10 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
          <div className="grid grid-cols-2 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">
                {String(timeLeft.days).padStart(3, '0')}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Final Password Bar or Bonus Message */}
      {cluesFound >= 10 && !showBonusMessage && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
          <div className="w-full max-w-md mx-4">
            <p className="text-white/50 text-center mb-4 text-sm">Hai trovato tutti gli indizi! Inserisci la parola chiave finale.</p>
            <form onSubmit={handleGamePasswordSubmit} className="flex gap-3">
              <input
                type="text"
                value={gamePassword}
                onChange={(e) => setGamePassword(e.target.value)}
                className="flex-1 px-6 py-4 bg-transparent border-2 border-white rounded-lg text-white focus:outline-none text-center text-xl uppercase"
                placeholder="PAROLA CHIAVE"
                autoFocus
              />
              <button type="submit" className="w-16 h-16 bg-white rounded-lg hover:bg-white/90 transition" />
            </form>
          </div>
        </div>
      )}

      {/* Bonus Points Message */}
      {showBonusMessage && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
          <div className="w-full max-w-lg mx-4 text-center space-y-8">
            {/* Check Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-5xl text-white">✓</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              EVOLUZIONE
            </h1>

            {/* Points */}
            <div className="space-y-2">
              <p className="text-white/70 text-lg">Tutti i partecipanti guadagnano</p>
              <div className="border-2 border-white rounded-lg py-6 px-8 inline-block">
                <span className="text-5xl md:text-6xl font-bold text-white">+50 PUNTI</span>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => router.push('/game/area')}
              className="mt-8 px-12 py-4 border-2 border-white text-white text-xl font-medium rounded-lg hover:bg-white hover:text-black transition-all duration-300"
            >
              CONTINUA
            </button>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showGamePassword && cluesFound < 10 && passwordInputEnabled && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
          <div className="w-full max-w-md mx-4">
            <form onSubmit={handleGamePasswordSubmit} className="flex gap-3">
              <input
                type="text"
                value={gamePassword}
                onChange={(e) => setGamePassword(e.target.value)}
                className="flex-1 px-6 py-4 bg-transparent border-2 border-white rounded-lg text-white focus:outline-none text-center text-xl"
                autoFocus
              />
              <button type="submit" className="w-16 h-16 bg-white rounded-lg hover:bg-white/90 transition" />
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
