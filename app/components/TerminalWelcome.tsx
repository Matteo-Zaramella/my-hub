'use client'

import { useState, useEffect, useRef } from 'react'
import EntityText from './EntityText'

interface TerminalWelcomeProps {
  onComplete: () => void
  daysRemaining: number
}

// Messaggio di benvenuto - 6 righe (tono misterioso/entità - neutro)
const LINES = [
  'Accesso garantito.',
  'Registrazione richiesta.',
  'Compila il modulo.',
  'Riceverai un codice: non perderlo.',
  'Tutto ciò che cerchi è all\'interno.',
  'Il gioco inizia ora.'
]

// Ritmi e velocità (in millisecondi)
const TYPING_SPEED = 60 // Velocità per ogni lettera (uguale per tutte)
const PAUSE_BETWEEN_LINES = 800 // Pausa dopo ogni riga completata prima della successiva
const FINAL_PAUSE = 2500 // Pausa finale prima di mostrare la landing page
const INITIAL_DELAY = 1500 // Schermo nero iniziale

export default function TerminalWelcome({ onComplete }: TerminalWelcomeProps) {
  const [currentText, setCurrentText] = useState('') // Testo corrente visualizzato
  const [showCursor, setShowCursor] = useState(true)
  const [animationStarted, setAnimationStarted] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentLineRef = useRef(0) // Quale riga stiamo mostrando
  const currentCharRef = useRef(0) // Quale carattere
  const isDeletingRef = useRef(false) // Sta cancellando o scrivendo
  const onCompleteRef = useRef(onComplete)

  // Aggiorna la ref quando onComplete cambia
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Avvia animazione dopo schermo nero iniziale
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setAnimationStarted(true)
    }, INITIAL_DELAY)

    return () => clearTimeout(initialTimer)
  }, [])

  // Cursore lampeggiante
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  // Animazione typing - ogni riga appare e scompare singolarmente
  useEffect(() => {
    if (!animationStarted) return

    const animate = () => {
      // Tutte le righe completate
      if (currentLineRef.current >= LINES.length) {
        timeoutRef.current = setTimeout(() => {
          onCompleteRef.current()
        }, FINAL_PAUSE)
        return
      }

      const currentLine = LINES[currentLineRef.current]
      const isDeleting = isDeletingRef.current

      // FASE SCRITTURA
      if (!isDeleting) {
        // Riga ancora da scrivere
        if (currentCharRef.current < currentLine.length) {
          setCurrentText(currentLine.slice(0, currentCharRef.current + 1))
          currentCharRef.current++
          timeoutRef.current = setTimeout(animate, TYPING_SPEED)
        }
        // Riga completata → pausa e poi inizia a cancellare
        else {
          timeoutRef.current = setTimeout(() => {
            isDeletingRef.current = true
            animate()
          }, PAUSE_BETWEEN_LINES)
        }
      }
      // FASE CANCELLAZIONE
      else {
        // Riga ancora da cancellare
        if (currentCharRef.current > 0) {
          currentCharRef.current--
          setCurrentText(currentLine.slice(0, currentCharRef.current))
          timeoutRef.current = setTimeout(animate, TYPING_SPEED)
        }
        // Riga completamente cancellata → passa alla successiva
        else {
          timeoutRef.current = setTimeout(() => {
            isDeletingRef.current = false
            currentLineRef.current++
            currentCharRef.current = 0
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

  // Funzione per saltare l'animazione (opzionale)
  const handleSkip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    onCompleteRef.current()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Contenuto terminal */}
      <div className="text-center px-8 max-w-4xl">
        <div className="font-mono text-white text-xl md:text-3xl lg:text-4xl">
          {currentText}
          {/* Cursore lampeggiante */}
          <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
            _
          </span>
        </div>
      </div>

      {/* Pulsante Skip (nascosto per ora, scommentare se necessario) */}
      {/* <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 text-white/50 hover:text-white text-sm transition"
      >
        Salta →
      </button> */}
    </div>
  )
}
