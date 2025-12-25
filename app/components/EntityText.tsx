'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { charToWingdings, WINGDINGS_SYMBOLS } from '@/lib/wingdings'

interface EntityTextProps {
  children: string
  className?: string
  // Se true, usa la mappatura esatta (A→✌, B→👌, ecc.)
  // Se false, usa simboli Wingdings casuali
  useExactMapping?: boolean
}

interface GlitchChar {
  index: number
  symbol: string
}

export default function EntityText({
  children,
  className = '',
  useExactMapping = false
}: EntityTextProps) {
  const [glitchingChars, setGlitchingChars] = useState<GlitchChar[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isActiveRef = useRef(true)

  // Ottieni simbolo Wingdings per un carattere
  const getGlitchSymbol = useCallback((char: string): string => {
    if (useExactMapping) {
      // Usa la mappatura esatta Wingdings
      return charToWingdings(char)
    } else {
      // Usa un simbolo Wingdings casuale
      return WINGDINGS_SYMBOLS[Math.floor(Math.random() * WINGDINGS_SYMBOLS.length)]
    }
  }, [useExactMapping])

  // Funzione per triggerare un glitch
  const triggerGlitch = useCallback(() => {
    if (!isActiveRef.current || !children || children.length === 0) return

    // Scegli 1-4 caratteri casuali da glitchare
    const numGlitch = Math.floor(Math.random() * 4) + 1
    const validIndices: number[] = []

    // Trova indici validi (no spazi, punteggiatura base)
    for (let i = 0; i < children.length; i++) {
      const char = children[i]
      if (char !== ' ') {
        validIndices.push(i)
      }
    }

    if (validIndices.length === 0) {
      scheduleNextGlitch()
      return
    }

    // Seleziona indici casuali con simboli Wingdings
    const selectedChars: GlitchChar[] = []
    const usedIndices = new Set<number>()

    for (let i = 0; i < Math.min(numGlitch, validIndices.length); i++) {
      let randomIdx: number
      let attempts = 0
      do {
        randomIdx = validIndices[Math.floor(Math.random() * validIndices.length)]
        attempts++
      } while (usedIndices.has(randomIdx) && attempts < 20)

      if (!usedIndices.has(randomIdx)) {
        usedIndices.add(randomIdx)
        const originalChar = children[randomIdx]
        selectedChars.push({
          index: randomIdx,
          symbol: getGlitchSymbol(originalChar)
        })
      }
    }

    // Attiva glitch
    setGlitchingChars(selectedChars)

    // Disattiva dopo 100-200ms
    const glitchDuration = Math.random() * 100 + 100
    setTimeout(() => {
      if (isActiveRef.current) {
        setGlitchingChars([])
      }
    }, glitchDuration)

    // Schedula prossimo glitch
    scheduleNextGlitch()
  }, [children, getGlitchSymbol])

  // Schedula il prossimo glitch con delay casuale
  const scheduleNextGlitch = useCallback(() => {
    if (!isActiveRef.current) return

    const delay = Math.random() * 1000 + 500 // 0.5-1.5 secondi
    timeoutRef.current = setTimeout(triggerGlitch, delay)
  }, [triggerGlitch])

  // Avvia il ciclo di glitch
  useEffect(() => {
    isActiveRef.current = true

    // Primo glitch dopo 0.3-1 secondi
    const initialDelay = Math.random() * 700 + 300
    timeoutRef.current = setTimeout(triggerGlitch, initialDelay)

    return () => {
      isActiveRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [children, triggerGlitch])

  if (!children) return null

  // Crea mappa per lookup veloce
  const glitchMap = new Map<number, string>()
  glitchingChars.forEach(gc => glitchMap.set(gc.index, gc.symbol))

  return (
    <span className={`entity-text-wrapper ${className}`}>
      {children.split('').map((char, index) => {
        const glitchSymbol = glitchMap.get(index)
        const isGlitching = glitchSymbol !== undefined

        return (
          <span
            key={index}
            className={isGlitching ? 'entity-char-glitching' : 'entity-char'}
            data-char={char}
          >
            {char === ' ' ? '\u00A0' : (isGlitching ? glitchSymbol : char)}
          </span>
        )
      })}

      <style jsx global>{`
        .entity-text-wrapper {
          position: relative;
          display: inline;
        }

        .entity-char {
          display: inline;
          position: relative;
        }

        .entity-char-glitching {
          display: inline;
          position: relative;
          color: #fff;
          text-shadow:
            -2px 0 #ff0040,
            2px 0 #00ffff,
            0 0 8px #a855f7,
            0 0 16px #a855f7;
          animation: entity-char-glitch 100ms steps(2) infinite;
        }

        @keyframes entity-char-glitch {
          0%, 100% {
            opacity: 1;
            transform: translateX(0) skewX(0deg);
          }
          25% {
            opacity: 0.9;
            transform: translateX(-2px) skewX(-5deg);
          }
          50% {
            opacity: 1;
            transform: translateX(2px) skewX(5deg);
          }
          75% {
            opacity: 0.85;
            transform: translateX(-1px) skewX(-2deg);
          }
        }
      `}</style>
    </span>
  )
}
