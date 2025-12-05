'use client'

import { useState, useEffect } from 'react'

interface TerminalWelcomeProps {
  onComplete: () => void
}

export default function TerminalWelcome({ onComplete }: TerminalWelcomeProps) {
  const [currentLine, setCurrentLine] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [showSkipButton, setShowSkipButton] = useState(false)

  const lines = [
    'Eccoti.',
    'Sei invitato a una festa.',
    'Durante la serata, un gioco coinvolgente.',
    'Dove e quando? Naviga il sito.'
  ]

  // Velocità scrittura/cancellazione
  const TYPING_SPEED = 50 // ms per carattere
  const BACKSPACE_SPEED = 30 // ms per backspace
  const PAUSE_BETWEEN_LINES = 1000 // pausa dopo completamento riga
  const FINAL_PAUSE = 2000 // pausa finale prima di fade out

  // Cursore lampeggiante
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  // Bottone skip appare dopo 2 secondi
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkipButton(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Animazione typing + backspace
  useEffect(() => {
    if (currentLine >= lines.length) {
      // Tutte le righe completate - pausa finale poi chiudi
      const timer = setTimeout(() => {
        onComplete()
      }, FINAL_PAUSE)
      return () => clearTimeout(timer)
    }

    const currentText = lines[currentLine]

    // Fase 1: Typing
    if (displayText.length < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length + 1))
      }, TYPING_SPEED)
      return () => clearTimeout(timer)
    }

    // Fase 2: Pausa dopo completamento riga
    if (displayText === currentText) {
      const timer = setTimeout(() => {
        // Passa direttamente alla riga successiva
        setCurrentLine(prev => prev + 1)
        setDisplayText('')
      }, PAUSE_BETWEEN_LINES)
      return () => clearTimeout(timer)
    }
  }, [displayText, currentLine, lines, onComplete])

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-fade-in">
      {/* Contenuto terminal */}
      <div className="text-center px-8">
        <div className="font-mono text-green-400 text-2xl md:text-4xl">
          <span>&gt; </span>
          <span>{displayText}</span>
          <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
            _
          </span>
        </div>
      </div>

      {/* Bottone Skip */}
      <button
        onClick={handleSkip}
        className={`
          fixed bottom-8 right-8
          bg-green-900/20 hover:bg-green-900/40
          border border-green-400/30 hover:border-green-400/60
          text-green-400
          p-4 rounded-full
          transition-all duration-300
          ${showSkipButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        aria-label="Skip animation"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
        </svg>
      </button>
    </div>
  )
}
