'use client'

import { useState, useEffect, useRef } from 'react'

interface EntityTextProps {
  children: string
  className?: string
}

export default function EntityText({ children, className = '' }: EntityTextProps) {
  const [chars, setChars] = useState<{ char: string; isGlitching: boolean }[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Inizializza array di caratteri
  useEffect(() => {
    if (children) {
      setChars(children.split('').map(char => ({ char, isGlitching: false })))
    }
  }, [children])

  // Effetto glitch casuale
  useEffect(() => {
    if (chars.length === 0) return

    intervalRef.current = setInterval(() => {
      setChars(prevChars => {
        if (prevChars.length === 0) return prevChars

        const newChars = [...prevChars]

        // Scegli random 1-4 caratteri da trasformare
        const numGlitch = Math.floor(Math.random() * 4) + 1
        const indices: number[] = []

        // Seleziona indici casuali (solo lettere/numeri, no spazi)
        for (let i = 0; i < numGlitch; i++) {
          let randomIndex
          let attempts = 0
          do {
            randomIndex = Math.floor(Math.random() * newChars.length)
            attempts++
          } while (
            (newChars[randomIndex].char === ' ' ||
             newChars[randomIndex].char === '.' ||
             newChars[randomIndex].char === ',' ||
             newChars[randomIndex].char === ':' ||
             newChars[randomIndex].char === '\'' ||
             indices.includes(randomIndex)) &&
            attempts < 50
          )

          if (attempts < 50) {
            indices.push(randomIndex)
          }
        }

        // Attiva glitch per i caratteri selezionati
        indices.forEach(idx => {
          newChars[idx].isGlitching = true
        })

        // Dopo 150ms disattiva glitch
        setTimeout(() => {
          setChars(prevChars => {
            const resetChars = [...prevChars]
            indices.forEach(idx => {
              if (resetChars[idx]) {
                resetChars[idx].isGlitching = false
              }
            })
            return resetChars
          })
        }, 150)

        return newChars
      })
    }, Math.random() * 2000 + 1000) // Ogni 1-3 secondi

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [chars.length])

  if (!children) return null

  return (
    <span className={`entity-text-wrapper ${className}`}>
      {chars.map((item, index) => (
        <span
          key={`${index}-${item.char}`}
          className={item.isGlitching ? 'entity-char-glitching' : 'entity-char'}
          style={{
            fontFamily: item.isGlitching ? 'Wingdings, sans-serif' : 'inherit',
            display: item.char === ' ' ? 'inline' : 'inline-block',
            whiteSpace: item.char === ' ' ? 'pre' : 'normal',
          }}
        >
          {item.char === ' ' ? '\u00A0' : item.char}
        </span>
      ))}

      <style jsx global>{`
        .entity-text-wrapper {
          position: relative;
          display: inline-block;
          animation: entity-glitch-text 3s infinite;
        }

        @keyframes entity-glitch-text {
          0%, 90%, 100% {
            text-shadow:
              0 0 1px rgba(255, 255, 255, 0.3),
              0 0 2px rgba(168, 85, 247, 0.2);
          }
          92% {
            text-shadow:
              -2px 0 rgba(255, 0, 0, 0.5),
              2px 0 rgba(0, 255, 255, 0.5),
              0 0 5px rgba(168, 85, 247, 0.5);
            transform: skewX(-2deg);
          }
          94% {
            text-shadow:
              2px 0 rgba(255, 0, 0, 0.5),
              -2px 0 rgba(0, 255, 255, 0.5),
              0 0 5px rgba(168, 85, 247, 0.5);
            transform: skewX(2deg);
          }
          96% {
            text-shadow:
              -1px 0 rgba(255, 0, 0, 0.5),
              1px 0 rgba(0, 255, 255, 0.5);
            transform: skewX(-1deg);
          }
        }

        .entity-char {
          transition: none;
        }

        .entity-char-glitching {
          animation: entity-char-glitch 150ms ease-in-out;
          text-shadow:
            -1px -1px 0 rgba(255, 0, 0, 0.8),
            1px 1px 0 rgba(0, 255, 255, 0.8),
            0 0 3px rgba(168, 85, 247, 1) !important;
        }

        @keyframes entity-char-glitch {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          25% {
            transform: translate(-2px, 1px) scale(1.05);
            opacity: 0.8;
          }
          50% {
            transform: translate(2px, -1px) scale(0.95);
            opacity: 1;
          }
          75% {
            transform: translate(-1px, -1px) scale(1.02);
            opacity: 0.9;
          }
        }
      `}</style>
    </span>
  )
}
