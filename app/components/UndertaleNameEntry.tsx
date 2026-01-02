'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

interface UndertaleNameEntryProps {
  onComplete: (name: string) => void
  onBack?: () => void
  title?: string
  maxLength?: number
}

// Nomi speciali che triggerano effetti (cancella il nome)
const SPECIAL_NAMES: Record<string, 'gaster' | 'other'> = {
  'GASTER': 'gaster',
  'DR GASTER': 'gaster',
  'WD GASTER': 'gaster',
  'W.D. GASTER': 'gaster',
  'W D GASTER': 'gaster',
}

// Pattern di bestemmie da bloccare (case insensitive)
const BLASPHEMY_PATTERNS = [
  // DIO + insulto
  /\bporco\s*dio\b/i,
  /\bdio\s*porco\b/i,
  /\bdio\s*cane\b/i,
  /\bdio\s*boia\b/i,
  /\bdio\s*maiale\b/i,
  /\bdio\s*ladro\b/i,
  /\bdio\s*bestia\b/i,
  /\bdio\s*santo\b/i,
  /\bdio\s*merda\b/i,
  /\bdio\s*fa\b/i,
  /\bdiocane\b/i,
  /\bdioporco\b/i,
  /\bporcodio\b/i,
  /\bdioboia\b/i,
  /\bdiomaiale\b/i,
  /\bdioladro\b/i,
  /\bdiobestia\b/i,
  /\bdiomerda\b/i,
  // MADONNA + insulto
  /\bporca\s*madonna\b/i,
  /\bmadonna\s*puttana\b/i,
  /\bmadonna\s*troia\b/i,
  /\bmadonna\s*ladra\b/i,
  /\bmadonna\s*maiala\b/i,
  /\bporcamadonna\b/i,
  /\bmadonnaputtana\b/i,
  /\bmadonnatroia\b/i,
  // CRISTO + insulto
  /\bporco\s*cristo\b/i,
  /\bcristo\s*porco\b/i,
  /\bcristo\s*cane\b/i,
  /\bcristo\s*dio\b/i,
  /\bporcocristo\b/i,
  /\bcristoporco\b/i,
  /\bcristocane\b/i,
  // GESÙ/GESU + insulto
  /\bporco\s*ges[uù]\b/i,
  /\bges[uù]\s*porco\b/i,
  /\bges[uù]\s*cane\b/i,
  /\bporcogesu\b/i,
  // Altri pattern comuni
  /\bostia\b/i,
  /\bmannaggia\s*la\s*madonna\b/i,
  /\bmannaggia\s*dio\b/i,
  /\bsanto\s*dio\b/i,
]

// Funzione per controllare se il nome contiene bestemmie
const containsBlasphemy = (name: string): boolean => {
  const normalized = name.toUpperCase()
  return BLASPHEMY_PATTERNS.some(pattern => pattern.test(normalized))
}

// Commenti di Samantha basati sul nome inserito
const NAME_COMMENTS: Record<string, string> = {
  // Creatore
  'MATTEO': 'Il creatore.',
  'ZARA': 'Il creatore.',
  'ZARAMELLA': 'Il creatore.',

  // Samantha
  'SAMANTHA': 'Quel nome è già in uso.',

  // Easter egg Undertale
  'GASTER': '',

  // Easter egg
  'PALLE': 'PALLE.',
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

  // Commento di Samantha basato sul nome corrente
  const samanthaComment = useMemo(() => {
    const trimmedName = name.trim()
    // Prima controlla le bestemmie
    if (containsBlasphemy(trimmedName)) {
      return 'Inaccettabile.'
    }
    const upperName = trimmedName.toUpperCase()
    return NAME_COMMENTS[upperName] || null
  }, [name])

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
        : 1 // 2 pulsanti nell'ultima riga (← e ↵)
      setSelectedCol(c => Math.min(maxCol, c + 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleConfirm()
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

  // Conferma nome
  const handleConfirm = () => {
    const trimmedName = name.trim()
    if (trimmedName.length > 0) {
      // Controllo per bestemmie - blocca silenziosamente
      if (containsBlasphemy(trimmedName)) {
        return
      }
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
      else if (selectedCol === 1) handleConfirm()
    }
  }

  // Click su lettera
  const handleLetterClick = (letter: string, rowIdx: number, colIdx: number) => {
    setSelectedRow(rowIdx)
    setSelectedCol(colIdx)
    addLetter(letter)
  }

  // Click su azione
  const handleActionClick = (action: 'back' | 'done', colIdx: number) => {
    setSelectedRow(KEYBOARD_ROWS.length)
    setSelectedCol(colIdx)
    if (action === 'back') handleBackspace()
    else if (action === 'done') handleConfirm()
  }

  // Simboli azioni: backspace e conferma
  const ACTION_SYMBOLS = ['←', '↵']

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
      {/* Commento di Samantha */}
      <div className="absolute top-8 left-0 right-0 flex justify-center">
        <div className="min-h-[40px] px-6">
          {samanthaComment && (
            <p className="font-mono text-white/70 text-sm md:text-base animate-pulse">
              {samanthaComment}
            </p>
          )}
        </div>
      </div>

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

        {/* Riga azioni: ← e ↵ */}
        <div className="flex justify-center gap-12 mt-6">
          {ACTION_SYMBOLS.map((symbol, colIdx) => {
            const isSelected = selectedRow === KEYBOARD_ROWS.length && selectedCol === colIdx
            const actionType = colIdx === 0 ? 'back' : 'done'
            return (
              <button
                key={symbol}
                onClick={() => handleActionClick(actionType, colIdx)}
                className={`
                  text-2xl md:text-3xl
                  transition-all duration-100
                  ${isSelected
                    ? 'text-white scale-125'
                    : colIdx === 1 && name.trim().length > 0
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
