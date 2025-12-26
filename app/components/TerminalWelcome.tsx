'use client'

import { useState, useEffect, useRef } from 'react'

interface TerminalWelcomeProps {
  onComplete: () => void
  daysRemaining: number
}

// Messaggio di benvenuto - 4 righe (tono misterioso/accogliente)
const LINES = [
  'Salve.',
  'Sembra tutto vuoto qui, vero?',
  'Rilassati, non preoccuparti.',
  'Scegli chi vuoi diventare.'
]

// Ritmi e velocità (in millisecondi)
const TYPING_SPEED = 60
const PAUSE_BETWEEN_LINES = 800
const INITIAL_DELAY = 1500
const GLITCH_DURATION = 500 // Durata glitch finale

export default function TerminalWelcome({ onComplete }: TerminalWelcomeProps) {
  const [currentText, setCurrentText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [animationStarted, setAnimationStarted] = useState(false)
  const [isLastLine, setIsLastLine] = useState(false)
  const [showFinalGlitch, setShowFinalGlitch] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentLineRef = useRef(0)
  const currentCharRef = useRef(0)
  const isDeletingRef = useRef(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setAnimationStarted(true)
    }, INITIAL_DELAY)
    return () => clearTimeout(initialTimer)
  }, [])

  // Cursore lampeggiante (solo se non è il glitch finale)
  useEffect(() => {
    if (showFinalGlitch) return
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [showFinalGlitch])

  useEffect(() => {
    if (!animationStarted) return

    const animate = () => {
      // Tutte le righe completate - attiva glitch finale
      if (currentLineRef.current >= LINES.length) {
        setShowFinalGlitch(true)
        setShowCursor(false)
        // Dopo il glitch, passa alla schermata successiva
        timeoutRef.current = setTimeout(() => {
          onCompleteRef.current()
        }, GLITCH_DURATION)
        return
      }

      const currentLine = LINES[currentLineRef.current]
      const isDeleting = isDeletingRef.current
      const isLast = currentLineRef.current === LINES.length - 1

      // Aggiorna flag ultima riga
      if (isLast && !isLastLine) {
        setIsLastLine(true)
      }

      // FASE SCRITTURA
      if (!isDeleting) {
        if (currentCharRef.current < currentLine.length) {
          setCurrentText(currentLine.slice(0, currentCharRef.current + 1))
          currentCharRef.current++
          timeoutRef.current = setTimeout(animate, TYPING_SPEED)
        } else {
          // Riga completata
          if (isLast) {
            // Ultima riga: piccola pausa poi glitch
            timeoutRef.current = setTimeout(() => {
              currentLineRef.current++
              animate()
            }, 300)
          } else {
            // Altre righe: pausa e cancella
            timeoutRef.current = setTimeout(() => {
              isDeletingRef.current = true
              animate()
            }, PAUSE_BETWEEN_LINES)
          }
        }
      }
      // FASE CANCELLAZIONE (solo per righe non finali)
      else {
        if (currentCharRef.current > 0) {
          currentCharRef.current--
          setCurrentText(currentLine.slice(0, currentCharRef.current))
          timeoutRef.current = setTimeout(animate, TYPING_SPEED)
        } else {
          timeoutRef.current = setTimeout(() => {
            isDeletingRef.current = false
            currentLineRef.current++
            currentCharRef.current = 0
            setIsLastLine(false)
            animate()
          }, PAUSE_BETWEEN_LINES)
        }
      }
    }

    animate()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [animationStarted])

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="text-center px-8 max-w-4xl">
        <div className="font-mono text-white text-xl md:text-3xl lg:text-4xl">
          {showFinalGlitch ? (
            // Glitch finale su tutte le lettere
            <span className="final-glitch-text">
              {currentText.split('').map((char, i) => (
                <span key={i} className="glitch-char">
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          ) : (
            // Testo normale
            <>
              {currentText}
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
                _
              </span>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .final-glitch-text {
          display: inline-block;
          animation: screen-shake 0.1s infinite;
        }

        .glitch-char {
          display: inline-block;
          position: relative;
          animation: char-glitch 0.1s infinite;
          text-shadow:
            -3px 0 #ff0040,
            3px 0 #00ffff;
        }

        .glitch-char::before,
        .glitch-char::after {
          content: attr(data-char);
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0.8;
        }

        .glitch-char::before {
          color: #ff0040;
          animation: glitch-red 0.1s infinite;
          clip-path: inset(0 0 50% 0);
        }

        .glitch-char::after {
          color: #00ffff;
          animation: glitch-blue 0.1s infinite;
          clip-path: inset(50% 0 0 0);
        }

        @keyframes screen-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          50% { transform: translateX(2px); }
          75% { transform: translateX(-1px); }
        }

        @keyframes char-glitch {
          0%, 100% { transform: translateX(0) skewX(0deg); }
          20% { transform: translateX(-2px) skewX(-5deg); }
          40% { transform: translateX(2px) skewX(5deg); }
          60% { transform: translateX(-1px) skewX(-2deg); }
          80% { transform: translateX(1px) skewX(2deg); }
        }

        @keyframes glitch-red {
          0%, 100% { transform: translateX(-3px); }
          50% { transform: translateX(-5px); }
        }

        @keyframes glitch-blue {
          0%, 100% { transform: translateX(3px); }
          50% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  )
}
