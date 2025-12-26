'use client'

import { useState, useEffect, useCallback } from 'react'

interface UndertaleNameEntryProps {
  onComplete: (name: string) => void
  onBack?: () => void
  title?: string
  maxLength?: number
}

// Nomi speciali che triggerano effetti
const SPECIAL_NAMES: Record<string, 'gaster' | 'other'> = {
  'GASTER': 'gaster',
  'DR GASTER': 'gaster',
  'WD GASTER': 'gaster',
  'W.D. GASTER': 'gaster',
  'W D GASTER': 'gaster',
}

// Layout tastiera QWERTY
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

export default function UndertaleNameEntry({
  onComplete,
  onBack,
  title = 'Scegli un nome.',
  maxLength = 12
}: UndertaleNameEntryProps) {
  const [name, setName] = useState('')
  const [selectedRow, setSelectedRow] = useState(0)
  const [selectedCol, setSelectedCol] = useState(0)
  const [isGasterEffect, setIsGasterEffect] = useState(false)

  // Calcola la riga corrente (include riga speciale per SPAZIO/CANC/FATTO)
  const totalRows = KEYBOARD_ROWS.length + 1 // +1 per riga azioni

  // Gestione tasti fisici
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isGasterEffect) return

    const key = e.key.toUpperCase()

    // Navigazione con frecce
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedRow(r => Math.max(0, r - 1))
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedRow(r => Math.min(totalRows - 1, r + 1))
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setSelectedCol(c => Math.max(0, c - 1))
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      const maxCol = selectedRow < KEYBOARD_ROWS.length
        ? KEYBOARD_ROWS[selectedRow].length - 1
        : 2 // 3 pulsanti nell'ultima riga
      setSelectedCol(c => Math.min(maxCol, c + 1))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect()
    } else if (e.key === 'Backspace') {
      e.preventDefault()
      handleBackspace()
    } else if (/^[A-Z]$/.test(key) && name.length < maxLength) {
      // Digitazione diretta da tastiera fisica
      addLetter(key)
    }
  }, [selectedRow, selectedCol, name, isGasterEffect, maxLength])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Aggiungi lettera
  const addLetter = (letter: string) => {
    if (name.length < maxLength) {
      const newName = name + letter
      setName(newName)
      checkSpecialName(newName)
    }
  }

  // Backspace
  const handleBackspace = () => {
    setName(n => n.slice(0, -1))
  }

  // Spazio
  const handleSpace = () => {
    if (name.length < maxLength && name.length > 0 && !name.endsWith(' ')) {
      const newName = name + ' '
      setName(newName)
      checkSpecialName(newName)
    }
  }

  // Conferma nome
  const handleConfirm = () => {
    const trimmedName = name.trim()
    if (trimmedName.length > 0) {
      // Controllo finale per nomi speciali
      const upperName = trimmedName.toUpperCase()
      if (SPECIAL_NAMES[upperName] === 'gaster') {
        triggerGasterEffect()
        return
      }
      onComplete(trimmedName)
    }
  }

  // Controlla nomi speciali durante la digitazione
  const checkSpecialName = (currentName: string) => {
    const upperName = currentName.trim().toUpperCase()
    if (SPECIAL_NAMES[upperName] === 'gaster') {
      triggerGasterEffect()
    }
  }

  // Effetto Gaster - cancella tutto
  const triggerGasterEffect = () => {
    setIsGasterEffect(true)
    // Effetto glitch rapido poi cancella
    setTimeout(() => {
      setName('')
      setIsGasterEffect(false)
    }, 500)
  }

  // Gestione selezione con click/enter
  const handleSelect = () => {
    if (selectedRow < KEYBOARD_ROWS.length) {
      // Riga lettere
      const row = KEYBOARD_ROWS[selectedRow]
      if (selectedCol < row.length) {
        addLetter(row[selectedCol])
      }
    } else {
      // Riga azioni
      if (selectedCol === 0) handleBackspace()
      else if (selectedCol === 1) handleSpace()
      else if (selectedCol === 2) handleConfirm()
    }
  }

  // Click su lettera
  const handleLetterClick = (letter: string, rowIdx: number, colIdx: number) => {
    setSelectedRow(rowIdx)
    setSelectedCol(colIdx)
    addLetter(letter)
  }

  // Click su azione
  const handleActionClick = (action: 'back' | 'space' | 'done', colIdx: number) => {
    setSelectedRow(KEYBOARD_ROWS.length)
    setSelectedCol(colIdx)
    if (action === 'back') handleBackspace()
    else if (action === 'space') handleSpace()
    else if (action === 'done') handleConfirm()
  }

  return (
    <div className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4 ${isGasterEffect ? 'gaster-effect' : ''}`}>
      {/* Titolo */}
      <div className="text-white text-xl md:text-2xl mb-8 font-mono">
        {title}
      </div>

      {/* Nome inserito */}
      <div className="mb-8 w-full max-w-md">
        <div className="bg-white/5 border-2 border-white/30 rounded px-6 py-4 min-h-[60px] flex items-center justify-center">
          <span className={`text-3xl md:text-4xl font-mono tracking-wider ${isGasterEffect ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            {name || <span className="text-white/30">_</span>}
            <span className="animate-pulse">|</span>
          </span>
        </div>
        <div className="text-center text-white/40 text-sm mt-2">
          {name.length}/{maxLength}
        </div>
      </div>

      {/* Tastiera */}
      <div className="space-y-2">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-1 md:gap-2">
            {row.map((letter, colIdx) => {
              const isSelected = selectedRow === rowIdx && selectedCol === colIdx
              return (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter, rowIdx, colIdx)}
                  className={`
                    w-8 h-10 md:w-10 md:h-12
                    font-mono text-lg md:text-xl font-bold
                    border-2 rounded
                    transition-all duration-100
                    ${isSelected
                      ? 'bg-white text-black border-white scale-110'
                      : 'bg-transparent text-white/80 border-white/30 hover:border-white/60 hover:text-white'
                    }
                  `}
                >
                  {letter}
                </button>
              )
            })}
          </div>
        ))}

        {/* Riga azioni: CANC - SPAZIO - FATTO */}
        <div className="flex justify-center gap-2 md:gap-4 mt-4">
          {['CANC', 'SPAZIO', 'FATTO'].map((action, colIdx) => {
            const isSelected = selectedRow === KEYBOARD_ROWS.length && selectedCol === colIdx
            const actionType = colIdx === 0 ? 'back' : colIdx === 1 ? 'space' : 'done'
            return (
              <button
                key={action}
                onClick={() => handleActionClick(actionType, colIdx)}
                className={`
                  px-4 py-2 md:px-6 md:py-3
                  font-mono text-sm md:text-base font-bold
                  border-2 rounded
                  transition-all duration-100
                  ${isSelected
                    ? 'bg-white text-black border-white scale-105'
                    : action === 'FATTO' && name.trim().length > 0
                      ? 'bg-transparent text-yellow-400 border-yellow-400/50 hover:border-yellow-400'
                      : 'bg-transparent text-white/60 border-white/30 hover:border-white/60 hover:text-white'
                  }
                `}
              >
                {action}
              </button>
            )
          })}
        </div>
      </div>

      {/* Istruzioni */}
      <div className="mt-8 text-white/40 text-xs md:text-sm text-center font-mono">
        Usa le frecce per navigare, INVIO per selezionare
      </div>

      <style jsx>{`
        .gaster-effect {
          animation: gaster-glitch 0.1s infinite;
        }

        @keyframes gaster-glitch {
          0%, 100% { filter: none; }
          25% { filter: hue-rotate(90deg) saturate(200%); }
          50% { filter: invert(1); }
          75% { filter: hue-rotate(-90deg) saturate(200%); }
        }
      `}</style>
    </div>
  )
}
