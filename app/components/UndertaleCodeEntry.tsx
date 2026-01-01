'use client'

import { useState, useEffect, useCallback } from 'react'

interface UndertaleCodeEntryProps {
  onComplete: (code: string) => void
  onNewUser?: () => void
  isLoading?: boolean
  error?: string
}

// Layout tastiera alfanumerica
const KEYBOARD_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

export default function UndertaleCodeEntry({
  onComplete,
  onNewUser,
  isLoading = false,
  error = ''
}: UndertaleCodeEntryProps) {
  const [code, setCode] = useState('')
  const [selectedRow, setSelectedRow] = useState(1)
  const [selectedCol, setSelectedCol] = useState(0)

  const totalRows = KEYBOARD_ROWS.length + 1

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isLoading) return

    const key = e.key.toUpperCase()

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
        : 2
      setSelectedCol(c => Math.min(maxCol, c + 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleConfirm()
    } else if (e.key === 'Backspace') {
      e.preventDefault()
      handleBackspace()
    } else if (/^[A-Z0-9]$/.test(key) && code.length < 8) {
      e.preventDefault()
      addChar(key)
    }
  }, [selectedRow, selectedCol, code, isLoading])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const addChar = (char: string) => {
    if (code.length < 8) {
      setCode(code + char.toUpperCase())
    }
  }

  const handleBackspace = () => {
    setCode(c => c.slice(0, -1))
  }

  const handleConfirm = () => {
    if (code.length === 8) {
      onComplete(code)
    }
  }

  const handleCharClick = (char: string, rowIdx: number, colIdx: number) => {
    if (isLoading) return
    setSelectedRow(rowIdx)
    setSelectedCol(colIdx)
    addChar(char)
  }

  const handleActionClick = (action: 'back' | 'new' | 'done', colIdx: number) => {
    if (isLoading) return
    setSelectedRow(KEYBOARD_ROWS.length)
    setSelectedCol(colIdx)
    if (action === 'back') handleBackspace()
    else if (action === 'new' && onNewUser) onNewUser()
    else if (action === 'done') handleConfirm()
  }

  const ACTION_SYMBOLS = ['←', '+', '↵']

  // Visualizza codice come caselle
  const codeDisplay = Array(8).fill('').map((_, i) => code[i] || '')

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
      {/* Titolo */}
      <div className="mb-6 text-white/70 text-center">
        <p className="text-lg">Inserisci il tuo codice</p>
      </div>

      {/* Code Display */}
      <div className="mb-8 flex gap-2">
        {codeDisplay.map((char, i) => (
          <div
            key={i}
            className={`
              w-8 h-11 md:w-10 md:h-14
              border-b-2
              flex items-center justify-center
              font-mono text-xl md:text-2xl
              ${char ? 'text-white border-white' : 'text-white/30 border-white/30'}
              ${i === code.length && !isLoading ? 'border-yellow-400' : ''}
            `}
          >
            {char || (i === code.length && !isLoading ? <span className="animate-pulse">_</span> : '')}
          </div>
        ))}
      </div>

      {error && (
        <div className="text-red-400 text-center text-sm mb-4">{error}</div>
      )}
      {isLoading && (
        <div className="text-white/50 text-center text-sm mb-4">Verifica...</div>
      )}

      {/* Tastiera */}
      <div className="space-y-3">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-2 md:gap-3">
            {row.map((char, colIdx) => {
              const isSelected = selectedRow === rowIdx && selectedCol === colIdx
              return (
                <button
                  key={`${rowIdx}-${colIdx}`}
                  onClick={() => handleCharClick(char, rowIdx, colIdx)}
                  disabled={isLoading || code.length >= 8}
                  className={`
                    w-7 h-9 md:w-8 md:h-10
                    font-mono text-base md:text-lg
                    transition-all duration-100
                    disabled:opacity-50
                    ${isSelected
                      ? 'text-white scale-125'
                      : 'text-white/50 hover:text-white'
                    }
                  `}
                >
                  {char}
                </button>
              )
            })}
          </div>
        ))}

        {/* Riga azioni: ← + ↵ */}
        <div className="flex justify-center gap-8 md:gap-12 mt-6">
          {ACTION_SYMBOLS.map((symbol, colIdx) => {
            const isSelected = selectedRow === KEYBOARD_ROWS.length && selectedCol === colIdx
            const actionType = colIdx === 0 ? 'back' : colIdx === 1 ? 'new' : 'done'
            const isDisabled = isLoading || (colIdx === 1 && !onNewUser)
            return (
              <button
                key={symbol}
                onClick={() => handleActionClick(actionType, colIdx)}
                disabled={isDisabled}
                className={`
                  text-2xl md:text-3xl
                  transition-all duration-100
                  disabled:opacity-30
                  ${isSelected
                    ? 'text-white scale-125'
                    : colIdx === 2 && code.length === 8
                      ? 'text-yellow-400 hover:text-yellow-300'
                      : colIdx === 1
                        ? 'text-purple-400 hover:text-purple-300'
                        : 'text-white/50 hover:text-white'
                  }
                `}
              >
                {symbol}
              </button>
            )
          })}
        </div>

        {/* Legenda */}
        <div className="flex justify-center gap-8 mt-2 text-xs text-white/30">
          <span>cancella</span>
          <span>nuovo</span>
          <span>conferma</span>
        </div>
      </div>
    </div>
  )
}
