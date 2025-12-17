'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const AI_MESSAGES = [
  "Il sistema non è ancora attivo.",
  "Stai arrivando troppo presto.",
  "Il tempo non è ancora giunto.",
  "L'accesso è temporaneamente negato.",
  "Il progetto è in fase di preparazione.",
  "Non tutto è pronto. Torna più tardi.",
  "L'inizializzazione è in corso.",
  "Il tuo momento non è adesso.",
  "Sto ancora configurando il sistema.",
  "La serata non è ancora iniziata."
]

const TYPING_SPEED = 50 // ms per carattere
const PAUSE_AFTER_TYPING = 2000 // pausa dopo completamento scrittura
const BACKSPACE_DELAY = 200 // pausa prima di iniziare a cancellare

export default function MaintenanceScreen() {
  const router = useRouter()
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const charIndexRef = useRef(0)
  const isTypingRef = useRef(true)
  const selectedMessageRef = useRef('')

  // Check participant session - redirect to auth if not logged in
  useEffect(() => {
    const session = localStorage.getItem('participant_session')
    if (!session) {
      router.push('/auth')
      return
    }
  }, [router])

  useEffect(() => {
    // Select random message once
    const randomIndex = Math.floor(Math.random() * AI_MESSAGES.length)
    selectedMessageRef.current = AI_MESSAGES[randomIndex]

    // Cursor blinking
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => {
      clearInterval(cursorInterval)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Typing and backspace animation
  useEffect(() => {
    const message = selectedMessageRef.current
    if (!message) return

    const animate = () => {
      if (isTypingRef.current) {
        // Fase TYPING
        if (charIndexRef.current < message.length) {
          setDisplayText(message.slice(0, charIndexRef.current + 1))
          charIndexRef.current++
          timeoutRef.current = setTimeout(animate, TYPING_SPEED)
        } else {
          // Fine typing, pausa prima di cancellare
          timeoutRef.current = setTimeout(() => {
            isTypingRef.current = false
            animate()
          }, PAUSE_AFTER_TYPING)
        }
      } else {
        // Fase BACKSPACE: cancella carattere per carattere
        if (charIndexRef.current > 0) {
          charIndexRef.current--
          setDisplayText(message.slice(0, charIndexRef.current))
          timeoutRef.current = setTimeout(animate, TYPING_SPEED)
        }
        // Quando charIndexRef.current === 0, l'animazione termina
      }
    }

    timeoutRef.current = setTimeout(animate, 1000) // Initial delay

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Wishlist Button - Top Left */}
      <button
        onClick={() => router.push('/wishlist-public')}
        className="fixed top-4 left-4 bg-white/5 backdrop-blur-sm rounded-lg p-6 hover:bg-white/10 transition-all duration-300 z-40"
      >
        <div className="text-5xl">🎁</div>
      </button>

      <div className="text-center px-8">
        <div className="font-mono text-white text-2xl md:text-4xl">
          <span>{displayText}</span>
          <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
            _
          </span>
        </div>
      </div>
    </div>
  )
}
