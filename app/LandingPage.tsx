'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import RegistrationForm from './components/RegistrationForm'
import TerminalWelcome from './components/TerminalWelcome'
import UndertaleNameEntry from './components/UndertaleNameEntry'

export default function LandingPage() {
  const router = useRouter()
  const [showGamePassword, setShowGamePassword] = useState(false)
  const [gamePassword, setGamePassword] = useState('')
  const [cluesFound, setCluesFound] = useState(0)
  const [foundClueWords, setFoundClueWords] = useState<string[]>([]) // Traccia quali parole sono state trovate
  const [isEventActive, setIsEventActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [participantCode, setParticipantCode] = useState<string | null>(null)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [loginCode, setLoginCode] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [userRegistered, setUserRegistered] = useState(false) // Registrazione personale dell'utente
  const [showAuthChoice, setShowAuthChoice] = useState(false) // Scelta tra registrati/accedi
  const [ceremonyActive, setCeremonyActive] = useState(false) // Controllo se la cerimonia è attiva
  const [registrationFormEnabled, setRegistrationFormEnabled] = useState(true) // Form registrazione homepage (default true)
  const [wishlistEnabled, setWishlistEnabled] = useState(true) // Wishlist pubblica
  const [passwordInputEnabled, setPasswordInputEnabled] = useState(false) // Barra inserimento password
  const [minigameButtonEnabled, setMinigameButtonEnabled] = useState(false) // Cerchio 95 Saetta McQueen

  // Terminal welcome animation
  const [showTerminalWelcome, setShowTerminalWelcome] = useState(true) // Inizia sempre mostrando il welcome
  const [welcomeCompleted, setWelcomeCompleted] = useState(false)

  // Undertale name entry
  const [showNameEntry, setShowNameEntry] = useState(false)
  const [characterName, setCharacterName] = useState('')

  // Load ceremony clues from admin panel
  const [ceremonyClues, setCeremonyClues] = useState<{ word: string; order: number }[]>([])

  // Final password to access game area (revealed when all 10 clues are found)
  const GAME_PASSWORD = 'EVOLUZIONE'

  const supabase = createClient()

  // Check localStorage on client mount
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
    const savedCharName = localStorage.getItem('characterName')
    if (hasSeenWelcome) {
      setShowTerminalWelcome(false)
      setWelcomeCompleted(true)
      if (savedCharName) {
        setCharacterName(savedCharName)
        setShowAuthChoice(true)
      } else {
        setShowNameEntry(true)
      }
    }
  }, [])

  // Handle welcome animation completion
  const handleWelcomeComplete = () => {
    localStorage.setItem('hasSeenWelcome', 'true')
    setShowTerminalWelcome(false)
    setWelcomeCompleted(true)
    setShowNameEntry(true) // Mostra selezione nome personaggio
  }

  // Handle name entry completion
  const handleNameEntryComplete = (name: string) => {
    localStorage.setItem('characterName', name)
    setCharacterName(name)
    setShowNameEntry(false)
    setShowAuthChoice(true) // Dopo il nome, mostra registrazione
  }

  // Load participant code and clues from database
  useEffect(() => {
    async function initializeData() {
      // Load participant code from localStorage (set after login)
      const savedCode = localStorage.getItem('participantCode')
      setParticipantCode(savedCode)

      // Check se la registrazione è stata completata (salvato dopo form registrazione)
      const registrationCode = localStorage.getItem('registrationCompleted')
      if (registrationCode) {
        // Verifica che la registrazione sia ancora valida nel database
        await checkUserRegistration(registrationCode)
      } else if (savedCode) {
        // Se loggato ma non ha il flag registrationCompleted, verifica comunque
        await checkUserRegistration(savedCode)
      }

      // Check if ceremony is active
      await checkCeremonyStatus()

      // Load ceremony clues from database FIRST
      await loadCeremonyClues()

      // Then load found clues from database (globale per tutti)
      await loadFoundClues()
    }

    initializeData()

    // Poll settings every 2 seconds to detect admin changes
    const settingsInterval = setInterval(() => {
      checkCeremonyStatus()
    }, 2000)

    return () => clearInterval(settingsInterval)
  }, [])

  // Check all game settings from database
  async function checkCeremonyStatus() {
    try {
      // Load all settings from game_settings table
      const { data: settingsData, error: settingsError } = await supabase
        .from('game_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['ceremony_active', 'registration_button_enabled', 'wishlist_button_enabled', 'password_input_enabled', 'minigame_button_enabled'])

      if (settingsError) {
        console.error('Error checking game settings:', settingsError)
      } else if (settingsData) {
        settingsData.forEach(setting => {
          switch(setting.setting_key) {
            case 'ceremony_active':
              setCeremonyActive(setting.setting_value || false)
              break
            case 'registration_button_enabled':
              setRegistrationFormEnabled(setting.setting_value ?? true)
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
    } catch (err) {
      console.error('Error:', err)
    }
  }

  // Load ceremony clues from database
  async function loadCeremonyClues() {
    const { data, error } = await supabase
      .from('ceremony_clue_riddles')
      .select('clue_word, order_number')
      .order('order_number')

    if (error) {
      console.error('Error loading ceremony clues:', error)
      return
    }

    if (data) {
      const clues = data.map(row => ({ word: row.clue_word, order: row.order_number }))
      setCeremonyClues(clues)
    }
  }

  // Check if current user completed registration
  async function checkUserRegistration(code: string) {
    const { data, error } = await supabase
      .from('game_participants')
      .select('registration_completed')
      .eq('participant_code', code)
      .single()

    if (error) {
      // Silently ignore "no rows found" errors (user not logged in or invalid code)
      if (error.code !== 'PGRST116') {
        console.error('Error checking user registration:', error)
      }
      return
    }

    if (data) {
      setUserRegistered(data.registration_completed === true)
    }
  }

  // Load found clues from database
  async function loadFoundClues() {
    const { data, error } = await supabase
      .from('ceremony_clues_found')
      .select('clue_word')
      .eq('participant_code', 'GLOBAL') // Carica gli indizi trovati globalmente

    if (error) {
      console.error('Error loading found clues:', error)
      return
    }

    if (data) {
      const words = data.map((row) => row.clue_word)
      setFoundClueWords(words)
      setCluesFound(words.length)

      // Se ha trovato tutti e 10 gli indizi, reindirizza automaticamente all'area di gioco
      if (words.length >= 10) {
        router.push('/game?password=' + encodeURIComponent(GAME_PASSWORD))
      }
    }
  }

  // Dynamic countdown - always points to next deadline
  useEffect(() => {
    async function initializeCountdown() {
      // Carica tutte le sfide dal database
      const { data: challenges, error } = await supabase
        .from('game_challenges')
        .select('challenge_number, title, start_date, end_date')
        .order('challenge_number', { ascending: true })

      if (error) {
        console.error('Error loading challenges:', error)
        return
      }

      const updateCountdown = () => {
        const now = new Date()

        // Cerimonia di apertura: 24/01/2026 → 26/01/2026 23:59
        const ceremonyStart = new Date('2026-01-25T00:00:00') // Mezzanotte tra 24 e 25
        const ceremonyEnd = new Date('2026-01-26T23:59:59')

        let targetDate: Date | null = null
        let eventStartDate: Date | null = null

        // Se non è ancora iniziata la cerimonia
        if (now < ceremonyStart) {
          targetDate = ceremonyStart // Countdown punta all'inizio (25/01 00:00)
          eventStartDate = ceremonyStart
        }
        // Se la cerimonia è in corso
        else if (now >= ceremonyStart && now <= ceremonyEnd) {
          targetDate = ceremonyEnd
          eventStartDate = ceremonyStart
          setIsEventActive(true)
        }
        // Cerimonia finita - cerca la prossima sfida
        else {
          // Trova la prossima sfida che deve ancora finire
          const nextChallenge = challenges?.find(ch => {
            const endDate = new Date(ch.end_date)
            return now < endDate
          })

          if (nextChallenge) {
            targetDate = new Date(nextChallenge.end_date)
            eventStartDate = new Date(nextChallenge.start_date)

            // Check if this challenge is currently active
            setIsEventActive(now >= eventStartDate && now <= targetDate)
          } else {
            // Tutte le sfide sono finite
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
            setIsEventActive(false)
            return
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
  }, [])

  // Create grid of circles (10x10)
  const gridSize = 10
  const totalCircles = gridSize * gridSize

  const handleAdminAccess = () => {
    router.push('/login')
  }

  const handleGameAccess = () => {
    setShowGamePassword(true)
  }

  const handleGamePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const input = gamePassword.trim().toUpperCase() // Converti in MAIUSCOLO

    if (!input) return

    // First check if input is the final password EVOLUZIONE
    if (input === GAME_PASSWORD) {
      // Redirect all'area di gioco
      router.push('/game?password=' + encodeURIComponent(input))
      return
    }

    // If event is active and not all clues found, check if input is a clue
    // TEMPORANEO: Rimossa restrizione temporale per testing
    if (cluesFound < 10 && ceremonyActive) {
      // Trova l'indizio corrispondente
      const foundClue = ceremonyClues.find(clue => clue.word === input)

      // Verifica se l'indizio è valido E non è già stato trovato
      if (foundClue && !foundClueWords.includes(input)) {
        // Salva nel database usando il codice dell'indizio come identificatore globale
        const { error } = await supabase
          .from('ceremony_clues_found')
          .insert({
            participant_code: 'GLOBAL', // Tutti i visitatori condividono lo stesso stato
            clue_word: input,
          })

        if (error) {
          console.error('Error saving clue:', error)
          console.error('Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          })
          // Se errore UNIQUE constraint = già trovato, ignora silenziosamente
          if (error.code === '23505') {
            setGamePassword('')
            setShowGamePassword(false)
            return
          }
          // Altri errori - chiudi modal comunque
          setGamePassword('')
          setShowGamePassword(false)
          return
        }

        // Aggiorna stato locale
        const newFoundWords = [...foundClueWords, input]
        setFoundClueWords(newFoundWords)
        setCluesFound(newFoundWords.length)
        setGamePassword('') // Clear input
        setShowGamePassword(false) // Close modal
        return
      }

      // Indizio già trovato o parola errata - chiudi modal e pulisci input
      setGamePassword('')
      setShowGamePassword(false)
      return
    }

    // If password is wrong and no clue match, close modal
    setShowGamePassword(false)
    setGamePassword('')
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Terminal Welcome Animation - First visit only */}
      {showTerminalWelcome && <TerminalWelcome onComplete={handleWelcomeComplete} daysRemaining={timeLeft.days} />}

      {/* Undertale Name Entry - After welcome */}
      {showNameEntry && (
        <UndertaleNameEntry
          onComplete={handleNameEntryComplete}
          title="Scegli un nome."
          maxLength={12}
        />
      )}

      {/* Wishlist Button - Top Left */}
      {!showTerminalWelcome && welcomeCompleted && !showNameEntry && !showAuthChoice && wishlistEnabled && (
        <button
          onClick={() => router.push('/wishlist-public')}
          className="fixed top-4 left-4 bg-white/5 backdrop-blur-sm rounded-lg p-6 hover:bg-white/10 transition-all duration-300 z-40"
        >
          <div className="text-5xl">🎁</div>
        </button>
      )}

      {/* Login Button - Top Right */}
      {!showTerminalWelcome && welcomeCompleted && !showNameEntry && !showAuthChoice && (
        <button
          onClick={handleAdminAccess}
          className="fixed top-4 right-4 bg-white/5 backdrop-blur-sm rounded-lg p-6 hover:bg-white/10 transition-all duration-300 z-40"
        >
          <div className="text-5xl">👤</div>
        </button>
      )}

      {/* Minigame Button - Bottom Left */}
      {!showTerminalWelcome && welcomeCompleted && !showNameEntry && !showAuthChoice && minigameButtonEnabled && (
        <button
          onClick={() => router.push('/minigames')}
          className="fixed bottom-4 left-4 bg-white/5 backdrop-blur-sm rounded-lg p-6 hover:bg-white/10 transition-all duration-300 z-40"
        >
          <div className="text-5xl">🕹️</div>
        </button>
      )}

      {/* Password Input Button - Bottom Right */}
      {!showTerminalWelcome && welcomeCompleted && !showNameEntry && !showAuthChoice && passwordInputEnabled && (
        <button
          onClick={handleGameAccess}
          className="fixed bottom-4 right-4 bg-white/5 backdrop-blur-sm rounded-lg p-6 hover:bg-white/10 transition-all duration-300 z-40"
        >
          <div className="text-5xl">🚪</div>
        </button>
      )}


      {/* Circle Background Grid - Nascosta quando tutti gli indizi sono trovati O quando terminal è visibile O scelta auth */}
      {cluesFound < 10 && !showTerminalWelcome && welcomeCompleted && !showNameEntry && !showAuthChoice && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full max-w-[100vh] max-h-screen grid grid-cols-10 grid-rows-10 gap-0 p-1 sm:p-2 md:p-3 lg:p-4 aspect-square">
          {Array.from({ length: totalCircles }, (_, index) => {
            // Calculate row and column
            const row = Math.floor(index / gridSize)
            const col = index % gridSize

            // INDEX 9 (top right corner) - Admin access (always visible)
            const isAdmin = index === 9

            // Hide circles in the center 4x4 area (rows 3-6, cols 3-6) SOLO se il countdown non è finito
            const isInTimerArea = row >= 3 && row <= 6 && col >= 3 && col <= 6
            const countdownFinished = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

            if (isInTimerArea && !countdownFinished) {
              return <div key={index} className="flex items-center justify-center"></div>
            }

          // Determine circle fill
          let circleFill = ''

          if (ceremonyActive) {
            // Illumina le colonne SOLO se la cerimonia è attiva
            // Per ogni parola trovata, trova il suo order_number e illumina quella colonna
            const foundOrders = foundClueWords
              .map(word => {
                const clue = ceremonyClues.find(c => c.word === word)
                return clue ? clue.order - 1 : -1 // order - 1 perché le colonne vanno da 0 a 9
              })
              .filter(order => order >= 0)

            // Illumina la colonna se il suo indice è tra gli ordini trovati
            if (foundOrders.includes(col)) {
              circleFill = 'bg-white'
            }
          }

            return (
              <div
                key={index}
                className="flex items-center justify-center w-full aspect-square p-0.5 sm:p-1 md:p-1.5 lg:p-2" style={{height: 'auto'}}
              >
                <div className={`w-full h-full rounded-full border border-white sm:border-2 ${circleFill} transition-colors duration-500 flex items-center justify-center`}>
                </div>
              </div>
            )
          })}
          </div>
        </div>
      )}

      {/* Countdown Timer - Center (4x4 circles area) - Nascosto quando countdown finito O terminal visibile O scelta auth */}
      {!(timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) && cluesFound < 10 && !showTerminalWelcome && welcomeCompleted && !showNameEntry && !showAuthChoice && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
          <div className="grid grid-cols-2 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
            {/* Days */}
            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">
                {String(timeLeft.days).padStart(3, '0')}
              </div>
            </div>

            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
            </div>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barra di inserimento finale - Mostrata quando tutti e 10 gli indizi sono trovati */}
      {cluesFound >= 10 && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
          <div className="w-full max-w-md mx-4">
            <form onSubmit={handleGamePasswordSubmit} className="flex gap-3">
              <input
                type="text"
                value={gamePassword}
                onChange={(e) => setGamePassword(e.target.value)}
                className="flex-1 px-6 py-4 bg-transparent border-2 border-white rounded-lg text-white focus:outline-none text-center text-xl"
                placeholder="PAROLA CHIAVE FINALE"
                autoFocus
              />
              <button
                type="submit"
                className="w-16 h-16 bg-white rounded-lg hover:bg-white/90 transition"
              />
            </form>
          </div>
        </div>
      )}

      {/* Game Password Modal - Mostrato solo quando non sono stati trovati tutti gli indizi E password_input è abilitato */}
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
              <button
                type="submit"
                className="w-16 h-16 bg-white rounded-lg hover:bg-white/90 transition"
              />
            </form>
          </div>
        </div>
      )}

      {/* Auth Choice - Registrati o Accedi */}
      {!showTerminalWelcome && showAuthChoice && !showRegistrationForm && !showLoginForm && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full justify-center items-center">
            {/* REGISTRATI */}
            <button
              onClick={() => {
                setShowAuthChoice(false)
                setShowRegistrationForm(true)
              }}
              className="entity-text-static hover:opacity-80 transition-opacity"
            >
              <span className="text-white text-2xl md:text-4xl font-bold tracking-wider">REGISTRATI</span>
            </button>

            {/* ACCEDI */}
            <button
              onClick={() => {
                setShowAuthChoice(false)
                setShowLoginForm(true)
              }}
              className="entity-text-static hover:opacity-80 transition-opacity"
            >
              <span className="text-white text-2xl md:text-4xl font-bold tracking-wider">ACCEDI</span>
            </button>
          </div>

          <style jsx>{`
            .entity-text-static {
              text-shadow:
                -1px 0 #ff0040,
                1px 0 #00ffff,
                0 0 8px #a855f7,
                0 0 16px #a855f7;
            }
          `}</style>
        </div>
      )}

      {/* Registration Form */}
      {showRegistrationForm && (
        <RegistrationForm
          onSuccess={(code, participant) => {
            // Salva i dati completi del partecipante per la game area
            localStorage.setItem('game_participant', JSON.stringify(participant))
            localStorage.setItem('participantCode', code)
            localStorage.setItem('registrationCompleted', code)
            setUserRegistered(true)
            // Redirect diretto senza flash (replace per evitare back)
            router.replace('/game/area')
          }}
          onBack={() => {
            setShowRegistrationForm(false)
            setShowAuthChoice(true)
          }}
        />
      )}

      {/* Login Form - Solo codice 8 caratteri */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-4xl">
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setLoginError('')

                if (loginCode.length !== 8) return

                setLoginLoading(true)
                try {
                  // Verifica codice direttamente nel database
                  const { data: participant, error } = await supabase
                    .from('game_participants')
                    .select('*')
                    .eq('participant_code', loginCode.toUpperCase())
                    .single()

                  if (error || !participant) {
                    setLoginError('Codice non valido')
                    setLoginLoading(false)
                    return
                  }

                  // Salva dati partecipante e reindirizza
                  localStorage.setItem('game_participant', JSON.stringify(participant))
                  localStorage.setItem('participantCode', loginCode.toUpperCase())
                  router.replace('/game/area')
                } catch {
                  setLoginError('Errore di connessione')
                } finally {
                  setLoginLoading(false)
                }
              }}
              className="flex flex-col gap-4 md:gap-6"
            >
              <div className="flex gap-3 md:gap-6 items-center">
                {/* Freccia indietro */}
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginForm(false)
                    setShowAuthChoice(true)
                    setLoginCode('')
                    setLoginError('')
                  }}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <span className="text-2xl md:text-4xl">←</span>
                </button>

                <input
                  type="text"
                  value={loginCode}
                  onChange={(e) => setLoginCode(e.target.value.toUpperCase())}
                  placeholder="Codice 8 caratteri"
                  maxLength={8}
                  className="flex-1 px-4 py-3 md:px-8 md:py-6 bg-transparent text-white text-base md:text-2xl focus:outline-none placeholder:text-white/30 uppercase text-center tracking-widest"
                  autoFocus
                />

                <button
                  type="submit"
                  disabled={loginLoading || loginCode.length !== 8}
                  className="text-white/50 hover:text-white transition-colors disabled:opacity-30"
                >
                  <span className="text-2xl md:text-4xl">{loginLoading ? '...' : '→'}</span>
                </button>
              </div>

              {/* Error message */}
              {loginError && (
                <div className="text-red-500 text-center text-sm md:text-lg">{loginError}</div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
