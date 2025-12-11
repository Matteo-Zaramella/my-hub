'use client'

import { useState, useEffect, useRef } from 'react'

interface TerminalWelcomeProps {
  onComplete: () => void
  daysRemaining: number
}

// Funzione per generare i messaggi dinamicamente
const getLines = (days: number) => [
  'Ti ho selezionato.',
  `Hai ${days} giorni per scoprire il mio segreto.`,
  'Le tue azioni determineranno l\'esito.',
  'Non tutto ti sarà rivelato.'
]

// Velocità e pause
const TYPING_SPEED = 50 // ms per carattere
const PAUSE_AFTER_LINE = 1500 // pausa dopo completamento riga
const BACKSPACE_DELAY = 200 // pausa prima di iniziare a cancellare
const FINAL_PAUSE = 1000 // pausa finale

export default function TerminalWelcome({ onComplete, daysRemaining }: TerminalWelcomeProps) {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [animationStarted, setAnimationStarted] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lineIndexRef = useRef(0)
  const charIndexRef = useRef(0)
  const isTypingRef = useRef(true)
  const onCompleteRef = useRef(onComplete)
  const LINES = getLines(daysRemaining)

  // Aggiorna la ref quando onComplete cambia
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Avvia animazione dopo 2 secondi di schermo nero
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      setAnimationStarted(true)
    }, 2000)

    return () => clearTimeout(initialDelay)
  }, [])

  // Cursore lampeggiante
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  // Animazione typing con refs per evitare re-render
  useEffect(() => {
    if (!animationStarted) return

    const animate = () => {
      // Tutte le righe completate
      if (lineIndexRef.current >= LINES.length) {
        timeoutRef.current = setTimeout(() => {
          onCompleteRef.current()
        }, FINAL_PAUSE)
        return
      }

      const currentLine = LINES[lineIndexRef.current]

      if (isTypingRef.current) {
        // Fase TYPING
        if (charIndexRef.current < currentLine.length) {
          setDisplayText(currentLine.slice(0, charIndexRef.current + 1))
          charIndexRef.current++
          timeoutRef.current = setTimeout(animate, TYPING_SPEED)
        } else {
          // Fine typing, pausa prima di cancellare
          timeoutRef.current = setTimeout(() => {
            isTypingRef.current = false
            animate()
          }, PAUSE_AFTER_LINE)
        }
      } else {
        // Fase BACKSPACE: cancella carattere per carattere
        if (charIndexRef.current > 0) {
          charIndexRef.current--
          setDisplayText(currentLine.slice(0, charIndexRef.current))
          timeoutRef.current = setTimeout(animate, TYPING_SPEED)
        } else {
          // Testo completamente cancellato, passa alla riga successiva
          lineIndexRef.current++
          isTypingRef.current = true
          timeoutRef.current = setTimeout(animate, BACKSPACE_DELAY)
        }
      }
    }

    animate()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [animationStarted]) // Esegui quando animazione parte

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-fade-in">
      {/* Contenuto terminal */}
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
