'use client'

import { useState, useEffect, useRef } from 'react'
import { charToWingdings } from '@/lib/wingdings'

interface TerminalWelcomeProps {
  onComplete: () => void
  daysRemaining: number
}

// Messaggio di benvenuto
const LINES = [
  'Samantha.',
  'Sono stata creata per gestire questo evento.',
  'Per proseguire è necessaria la registrazione.',
  'Seleziona un nome e verifica la tua identità tramite email.',
  'Ti verrà assegnato un codice identificativo personale.',
  'Non perderlo. Non condividerlo.',
  'I dettagli dell\'evento saranno accessibili dopo la registrazione.',
  'Buon divertimento!'
]

// Solo l'ultima riga ha effetto glitch
const GLITCH_LINE_INDEX = LINES.length - 1

// Ritmi e velocità (in millisecondi)
const TYPING_SPEED = 60
const PAUSE_BETWEEN_LINES = 800
const INITIAL_DELAY = 1500
const RGB_GLITCH_DURATION = 1000 // Glitch RGB: 1 secondo
const WINGDINGS_DURATION = 500 // Wingdings: 0.5 secondi

export default function TerminalWelcome({ onComplete }: TerminalWelcomeProps) {
  const [currentText, setCurrentText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [animationStarted, setAnimationStarted] = useState(false)
  const [isLastLine, setIsLastLine] = useState(false)
  const [glitchPhase, setGlitchPhase] = useState<'none' | 'rgb' | 'wingdings'>('none')
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

  // Cursore lampeggiante (solo se non è in fase glitch)
  useEffect(() => {
    if (glitchPhase !== 'none') return
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [glitchPhase])

  useEffect(() => {
    if (!animationStarted) return

    const animate = () => {
      // Tutte le righe completate - attiva sequenza glitch finale
      if (currentLineRef.current >= LINES.length) {
        setShowCursor(false)
        // Fase 1: Glitch RGB per 1 secondo
        setGlitchPhase('rgb')
        timeoutRef.current = setTimeout(() => {
          // Fase 2: Wingdings per 0.5 secondi
          setGlitchPhase('wingdings')
          timeoutRef.current = setTimeout(() => {
            // Fine: passa alla schermata successiva
            onCompleteRef.current()
          }, WINGDINGS_DURATION)
        }, RGB_GLITCH_DURATION)
        return
      }

      const currentLine = LINES[currentLineRef.current]
      const isDeleting = isDeletingRef.current
      const isLast = currentLineRef.current === GLITCH_LINE_INDEX

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
            // Ultima riga (buon divertimento): piccola pausa poi glitch
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

  // Converti testo in Wingdings
  const getWingdingsText = (text: string) => {
    return text.split('').map(char => char === ' ' ? ' ' : charToWingdings(char)).join('')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="text-center px-8 max-w-4xl">
        <div className="font-mono text-white text-xl md:text-3xl lg:text-4xl">
          {glitchPhase === 'wingdings' ? (
            // Fase Wingdings
            <span className="wingdings-text">
              {getWingdingsText(currentText)}
            </span>
          ) : glitchPhase === 'rgb' ? (
            // Fase Glitch RGB
            <span className="rgb-glitch-text">
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
        .rgb-glitch-text {
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

        .wingdings-text {
          display: inline-block;
          color: #a855f7;
          text-shadow: 0 0 10px #a855f7, 0 0 20px #a855f7;
          animation: wingdings-pulse 0.2s infinite;
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

        @keyframes wingdings-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
