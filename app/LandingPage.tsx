'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const [showGamePassword, setShowGamePassword] = useState(false)
  const [gamePassword, setGamePassword] = useState('')
  const [cluesFound, setCluesFound] = useState(0)
  const [isEventActive, setIsEventActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Load ceremony clues from admin panel
  const [ceremonyClues, setCeremonyClues] = useState<string[]>([])

  // Final password to access game area (revealed when all 10 clues are found)
  const GAME_PASSWORD = 'EVOLUZIONE'

  // Load clues configuration and progress from localStorage
  useEffect(() => {
    // Load clues found progress
    const savedProgress = localStorage.getItem('cluesFound')
    if (savedProgress) {
      setCluesFound(parseInt(savedProgress))
    }

    // Load ceremony clues solutions from admin panel
    const savedClues = localStorage.getItem('ceremonyClues')
    if (savedClues) {
      const parsed = JSON.parse(savedClues)
      // Extract only solutions
      const solutions = parsed.map((clue: { solution: string; instagramHint: string }) => clue.solution)
      setCeremonyClues(solutions)
    } else {
      // Default clues if not set
      setCeremonyClues([
        'indizio1',
        'indizio2',
        'indizio3',
        'indizio4',
        'indizio5',
        'indizio6',
        'indizio7',
        'indizio8',
        'indizio9',
        'indizio10',
      ])
    }
  }, [])

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

  const handleGamePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const input = gamePassword.trim()

    console.log('Input:', input)
    console.log('Expected password:', GAME_PASSWORD)
    console.log('Match:', input === GAME_PASSWORD)

    if (!input) return

    // First check if input is the final password
    if (input === GAME_PASSWORD) {
      console.log('Password correct! Redirecting...')
      router.push('/game?password=' + encodeURIComponent(input))
      return
    }

    // If event is active and not all clues found, check if input is a clue
    if (isEventActive && cluesFound < 10) {
      if (ceremonyClues.includes(input)) {
        const newCluesFound = cluesFound + 1
        setCluesFound(newCluesFound)
        localStorage.setItem('cluesFound', newCluesFound.toString())
        setGamePassword('') // Clear input after correct clue
        return
      }
      // Wrong clue - do nothing, don't clear input
      return
    }

    // If password is wrong and no clue match, close modal
    console.log('Password incorrect, closing modal')
    setShowGamePassword(false)
    setGamePassword('')
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Circle Background Grid */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-0 p-8">
        {Array.from({ length: totalCircles }, (_, index) => {
          // Calculate row and column
          const row = Math.floor(index / gridSize)
          const col = index % gridSize

          // Top right corner (position 9) - Admin access
          const isAdmin = index === 9
          // Bottom right corner (position 99) - Game access
          const isGame = index === 99

          // Hide circles in the center 4x4 area (rows 3-6, cols 3-6)
          const isInTimerArea = row >= 3 && row <= 6 && col >= 3 && col <= 6

          if (isInTimerArea) {
            return <div key={index} className="flex items-center justify-center"></div>
          }

          // Determine circle fill based on clues found
          let circleFill = ''
          if (isEventActive && col < cluesFound) {
            // Columns with found clues are filled white
            circleFill = 'bg-white'
          }

          return (
            <button
              key={index}
              onClick={() => {
                if (isAdmin) handleAdminAccess()
                if (isGame) handleGameAccess()
              }}
              className="flex items-center justify-center"
            >
              <div className={`w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border-2 border-white ${circleFill} transition-colors duration-500`}></div>
            </button>
          )
        })}
      </div>

      {/* Countdown Timer - Center (4x4 circles area) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="grid grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="text-5xl md:text-7xl lg:text-8xl font-bold text-white">
              {String(timeLeft.days).padStart(3, '0')}
            </div>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="text-5xl md:text-7xl lg:text-8xl font-bold text-white">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="text-5xl md:text-7xl lg:text-8xl font-bold text-white">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="text-5xl md:text-7xl lg:text-8xl font-bold text-white">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Game Password Modal */}
      {showGamePassword && (
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
    </div>
  )
}
