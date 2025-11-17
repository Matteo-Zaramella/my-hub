'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import RegistrationForm from './RegistrationForm'

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
  const [userRegistered, setUserRegistered] = useState(false) // Registrazione personale dell'utente

  // Load ceremony clues from admin panel
  const [ceremonyClues, setCeremonyClues] = useState<{ word: string; order: number }[]>([])

  // Final password to access game area (revealed when all 10 clues are found)
  const GAME_PASSWORD = 'EVOLUZIONE'

  const supabase = createClient()

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

      // Load ceremony clues from database FIRST
      await loadCeremonyClues()

      // Then load found clues from database (globale per tutti)
      await loadFoundClues()
    }

    initializeData()
  }, [])

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
      console.error('Error checking user registration:', error)
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

  // Countdown to 25/01/2026 00:00
  useEffect(() => {
    const targetDate = new Date('2026-01-25T00:00:00').getTime()
    const eventStartDate = new Date('2026-01-24T00:00:00').getTime() // Event starts 24/01/2026 00:00

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = targetDate - now

      // Check if event is active (between 24/01 00:00 and 25/01 00:00)
      setIsEventActive(now >= eventStartDate && now < targetDate)

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

    console.log('Input:', input)
    console.log('Expected password:', GAME_PASSWORD)
    console.log('Match:', input === GAME_PASSWORD)

    if (!input) return

    // First check if input is the final password EVOLUZIONE
    if (input === GAME_PASSWORD) {
      console.log('Password EVOLUZIONE correct! Redirecting to game area...')

      // Redirect all'area di gioco
      router.push('/game?password=' + encodeURIComponent(input))
      return
    }

    // If event is active and not all clues found, check if input is a clue
    // TEMPORANEO: Rimossa restrizione temporale per testing
    if (cluesFound < 10) {
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
      {/* Circle Background Grid - Nascosta quando tutti gli indizi sono trovati */}
      {cluesFound < 10 && (
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-0 p-1 sm:p-2 md:p-4 lg:p-6 xl:p-8">
          {Array.from({ length: totalCircles }, (_, index) => {
            // Calculate row and column
            const row = Math.floor(index / gridSize)
            const col = index % gridSize

            // Top left corner (position 0) - Registration form
            const isRegistration = index === 0
            // Top right corner (position 9) - Admin access
            const isAdmin = index === 9
            // Bottom right corner (position 99) - Game access
            const isGame = index === 99

            // Hide circles in the center 4x4 area (rows 3-6, cols 3-6) SOLO se il countdown non è finito
            const isInTimerArea = row >= 3 && row <= 6 && col >= 3 && col <= 6
            const countdownFinished = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

            if (isInTimerArea && !countdownFinished) {
              return <div key={index} className="flex items-center justify-center"></div>
            }

          // Determine circle fill based on clues found
          let circleFill = ''

          // Cerchio iscrizione (posizione 0) - rosso se l'utente NON ha completato la registrazione
          if (isRegistration && !userRegistered) {
            circleFill = 'bg-red-500'
          } else {
            // Illumina le colonne in base all'ordine degli indizi trovati
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
              <button
                key={index}
                onClick={() => {
                  if (isRegistration) setShowRegistrationForm(true)
                  if (isAdmin) handleAdminAccess()
                  if (isGame) handleGameAccess()
                }}
                className="flex items-center justify-center w-full h-full p-0.5 sm:p-1 md:p-1.5 lg:p-2"
              >
                <div className={`w-full h-full max-w-full max-h-full aspect-square rounded-full border border-white sm:border-2 ${circleFill} transition-colors duration-500`}></div>
              </button>
            )
          })}
        </div>
      )}

      {/* Countdown Timer - Center (4x4 circles area) - Nascosto quando countdown finito */}
      {!(timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) && cluesFound < 10 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12">
            {/* Days */}
            <div className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white">
                {String(timeLeft.days).padStart(3, '0')}
              </div>
            </div>

            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
            </div>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white">
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

      {/* Game Password Modal - Mostrato solo quando non sono stati trovati tutti gli indizi */}
      {showGamePassword && cluesFound < 10 && (
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

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <RegistrationForm
          onClose={() => setShowRegistrationForm(false)}
          onSuccess={() => {
            setUserRegistered(true)
            if (participantCode) {
              checkUserRegistration(participantCode)
            }
          }}
          participantCode={participantCode}
        />
      )}
    </div>
  )
}
