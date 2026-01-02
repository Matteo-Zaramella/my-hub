'use client'

import { useState, useEffect, useCallback } from 'react'

interface UndertaleEmailEntryProps {
  onComplete: (email: string) => void
  onBack?: () => void
  isLoading?: boolean
  error?: string
}

// Layout tastiera QWERTY + numeri e simboli email
const KEYBOARD_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ['@', '.', '-', '_'],
]

export default function UndertaleEmailEntry({
  onComplete,
  onBack,
  isLoading = false,
  error = ''
}: UndertaleEmailEntryProps) {
  const [email, setEmail] = useState('')
  const [selectedRow, setSelectedRow] = useState(1) // Inizia sulla riga QWERTY
  const [selectedCol, setSelectedCol] = useState(0)

  const totalRows = KEYBOARD_ROWS.length + 1 // +1 per riga azioni

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isLoading) return

    const key = e.key

    // Gestione Ctrl+V per incollare
    if ((e.ctrlKey || e.metaKey) && key.toLowerCase() === 'v') {
      e.preventDefault()
      navigator.clipboard.readText().then(text => {
        const cleanEmail = text.trim().toLowerCase().slice(0, 50)
        if (cleanEmail) {
          setEmail(cleanEmail)
        }
      }).catch(() => {})
      return
    }

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
    } else if (/^[a-zA-Z0-9@._\-]$/.test(key)) {
      e.preventDefault()
      addChar(key.toLowerCase())
    }
  }, [selectedRow, selectedCol, email, isLoading])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const addChar = (char: string) => {
    if (email.length < 50) {
      setEmail(email + char.toLowerCase())
    }
  }

  const handleBackspace = () => {
    setEmail(e => e.slice(0, -1))
  }

  const handleConfirm = () => {
    const trimmedEmail = email.trim().toLowerCase()
    if (trimmedEmail.includes('@') && trimmedEmail.includes('.')) {
      onComplete(trimmedEmail)
    }
  }

  const handleSelect = () => {
    if (selectedRow < KEYBOARD_ROWS.length) {
      const row = KEYBOARD_ROWS[selectedRow]
      if (selectedCol < row.length) {
        addChar(row[selectedCol].toLowerCase())
      }
    } else {
      if (selectedCol === 0) handleBackspace()
      else if (selectedCol === 1 && onBack) onBack()
      else if (selectedCol === 2) handleConfirm()
    }
  }

  const handleCharClick = (char: string, rowIdx: number, colIdx: number) => {
    if (isLoading) return
    setSelectedRow(rowIdx)
    setSelectedCol(colIdx)
    addChar(char.toLowerCase())
  }

  const handleActionClick = (action: 'back' | 'cancel' | 'done', colIdx: number) => {
    if (isLoading) return
    setSelectedRow(KEYBOARD_ROWS.length)
    setSelectedCol(colIdx)
    if (action === 'back') handleBackspace()
    else if (action === 'cancel' && onBack) onBack()
    else if (action === 'done') handleConfirm()
  }

  const isValidEmail = email.includes('@') && email.includes('.')
  const ACTION_SYMBOLS = ['←', '✕', '↵']

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
      {/* Email inserita */}
      <div className="mb-8 w-full max-w-lg">
        <div className="px-6 py-4 min-h-[60px] flex items-center justify-center">
          <span className="text-xl md:text-2xl font-mono tracking-wider text-white break-all">
            {email || <span className="text-white/30">email@esempio.com</span>}
            {!isLoading && <span className="animate-pulse">|</span>}
          </span>
        </div>
        {error && (
          <div className="text-red-400 text-center text-sm mt-2">{error}</div>
        )}
        {isLoading && (
          <div className="text-white/50 text-center text-sm mt-2">Invio codice...</div>
        )}
      </div>

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
                  disabled={isLoading}
                  className={`
                    w-7 h-9 md:w-9 md:h-11
                    font-mono text-base md:text-lg
                    transition-all duration-100
                    disabled:opacity-50
                    ${isSelected
                      ? 'text-white scale-125'
                      : 'text-white/50 hover:text-white'
                    }
                  `}
                >
                  {char.toLowerCase()}
                </button>
              )
            })}
          </div>
        ))}

        {/* Riga azioni: ← ✕ ↵ */}
        <div className="flex justify-center gap-8 md:gap-12 mt-6">
          {ACTION_SYMBOLS.map((symbol, colIdx) => {
            const isSelected = selectedRow === KEYBOARD_ROWS.length && selectedCol === colIdx
            const actionType = colIdx === 0 ? 'back' : colIdx === 1 ? 'cancel' : 'done'
            const isDisabled = isLoading || (colIdx === 1 && !onBack)
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
                    : colIdx === 2 && isValidEmail
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
