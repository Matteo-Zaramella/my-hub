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
  maxLength = 20
}: UndertaleNameEntryProps) {
  const [name, setName] = useState('')
  const [selectedRow, setSelectedRow] = useState(0)
  const [selectedCol, setSelectedCol] = useState(0)

  // Calcola la riga corrente (include riga speciale per SPAZIO/CANC/FATTO)
  const totalRows = KEYBOARD_ROWS.length + 1 // +1 per riga azioni

  // Gestione tasti fisici
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
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
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSelect()
    } else if (e.key === ' ') {
      // Spazio fisico aggiunge spazio
      e.preventDefault()
      handleSpace()
    } else if (e.key === 'Backspace') {
      e.preventDefault()
      handleBackspace()
    } else if (/^[A-Z]$/.test(key) && name.length < maxLength) {
      // Digitazione diretta da tastiera fisica
      addLetter(key)
    }
  }, [selectedRow, selectedCol, name, maxLength])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Aggiungi lettera
  const addLetter = (letter: string) => {
    if (name.length < maxLength) {
      setName(name + letter)
    }
  }

  // Backspace
  const handleBackspace = () => {
    setName(n => n.slice(0, -1))
  }

  // Spazio
  const handleSpace = () => {
    if (name.length < maxLength && name.length > 0 && !name.endsWith(' ')) {
      setName(name + ' ')
    }
  }

  // Conferma nome
  const handleConfirm = () => {
    const trimmedName = name.trim()
    if (trimmedName.length > 0) {
      // Controllo per nomi speciali - cancella silenziosamente
      const upperName = trimmedName.toUpperCase()
      if (SPECIAL_NAMES[upperName] === 'gaster') {
        setName('')
        return
      }
      onComplete(trimmedName)
    }
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

  // Simboli azioni
  const ACTION_SYMBOLS = ['⌫', '␣', '↵']

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
      {/* Nome inserito */}
      <div className="mb-12 w-full max-w-md">
        <div className="px-6 py-4 min-h-[60px] flex items-center justify-center">
          <span className="text-3xl md:text-4xl font-mono tracking-wider text-white">
            {name || <span className="text-white/30">_</span>}
            <span className="animate-pulse">|</span>
          </span>
        </div>
      </div>

      {/* Tastiera */}
      <div className="space-y-4">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-3 md:gap-4">
            {row.map((letter, colIdx) => {
              const isSelected = selectedRow === rowIdx && selectedCol === colIdx
              return (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter, rowIdx, colIdx)}
                  className={`
                    w-8 h-10 md:w-10 md:h-12
                    font-mono text-lg md:text-xl
                    transition-all duration-100
                    ${isSelected
                      ? 'text-white scale-125'
                      : 'text-white/50 hover:text-white'
                    }
                  `}
                >
                  {letter}
                </button>
              )
            })}
          </div>
        ))}

        {/* Riga azioni: ⌫ - ␣ - ↵ */}
        <div className="flex justify-center gap-8 md:gap-12 mt-6">
          {ACTION_SYMBOLS.map((symbol, colIdx) => {
            const isSelected = selectedRow === KEYBOARD_ROWS.length && selectedCol === colIdx
            const actionType = colIdx === 0 ? 'back' : colIdx === 1 ? 'space' : 'done'
            return (
              <button
                key={symbol}
                onClick={() => handleActionClick(actionType, colIdx)}
                className={`
                  text-2xl md:text-3xl
                  transition-all duration-100
                  ${isSelected
                    ? 'text-white scale-125'
                    : colIdx === 2 && name.trim().length > 0
                      ? 'text-yellow-400 hover:text-yellow-300'
                      : 'text-white/50 hover:text-white'
                  }
                `}
              >
                {symbol}
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}
