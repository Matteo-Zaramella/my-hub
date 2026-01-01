'use client'

import { useState, useEffect, useCallback } from 'react'

interface UndertaleOTPEntryProps {
  onComplete: (otp: string) => void
  onBack?: () => void
  onResend?: () => void
  email: string
  isLoading?: boolean
  error?: string
}

// Solo numeri per OTP
const KEYBOARD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', ''],
]

export default function UndertaleOTPEntry({
  onComplete,
  onBack,
  onResend,
  email,
  isLoading = false,
  error = ''
}: UndertaleOTPEntryProps) {
  const [otp, setOtp] = useState('')
  const [selectedRow, setSelectedRow] = useState(0)
  const [selectedCol, setSelectedCol] = useState(1) // Centro

  const totalRows = KEYBOARD_ROWS.length + 1

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isLoading) return

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
      setSelectedCol(c => Math.min(2, c + 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleConfirm()
    } else if (e.key === 'Backspace') {
      e.preventDefault()
      handleBackspace()
    } else if (/^[0-9]$/.test(e.key) && otp.length < 6) {
      e.preventDefault()
      addDigit(e.key)
    }
  }, [selectedRow, selectedCol, otp, isLoading])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const addDigit = (digit: string) => {
    if (otp.length < 6) {
      const newOtp = otp + digit
      setOtp(newOtp)
      // Auto-submit quando arriva a 6 cifre
      if (newOtp.length === 6) {
        setTimeout(() => onComplete(newOtp), 100)
      }
    }
  }

  const handleBackspace = () => {
    setOtp(o => o.slice(0, -1))
  }

  const handleConfirm = () => {
    if (otp.length === 6) {
      onComplete(otp)
    }
  }

  const handleDigitClick = (digit: string, rowIdx: number, colIdx: number) => {
    if (isLoading || !digit) return
    setSelectedRow(rowIdx)
    setSelectedCol(colIdx)
    addDigit(digit)
  }

  const handleActionClick = (action: 'back' | 'resend' | 'done', colIdx: number) => {
    if (isLoading) return
    setSelectedRow(KEYBOARD_ROWS.length)
    setSelectedCol(colIdx)
    if (action === 'back') handleBackspace()
    else if (action === 'resend' && onResend) onResend()
    else if (action === 'done') handleConfirm()
  }

  const ACTION_SYMBOLS = ['←', '↻', '↵']

  // Visualizza OTP come caselle
  const otpDisplay = Array(6).fill('').map((_, i) => otp[i] || '')

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
      {/* Info email */}
      <div className="mb-4 text-white/50 text-sm text-center">
        Codice inviato a {email}
      </div>

      {/* OTP Display */}
      <div className="mb-8 flex gap-3">
        {otpDisplay.map((digit, i) => (
          <div
            key={i}
            className={`
              w-10 h-14 md:w-12 md:h-16
              border-b-2
              flex items-center justify-center
              font-mono text-2xl md:text-3xl
              ${digit ? 'text-white border-white' : 'text-white/30 border-white/30'}
              ${i === otp.length && !isLoading ? 'border-yellow-400' : ''}
            `}
          >
            {digit || (i === otp.length && !isLoading ? <span className="animate-pulse">_</span> : '')}
          </div>
        ))}
      </div>

      {error && (
        <div className="text-red-400 text-center text-sm mb-4">{error}</div>
      )}
      {isLoading && (
        <div className="text-white/50 text-center text-sm mb-4">Verifica in corso...</div>
      )}

      {/* Tastiera numerica */}
      <div className="space-y-3">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-6 md:gap-8">
            {row.map((digit, colIdx) => {
              const isSelected = selectedRow === rowIdx && selectedCol === colIdx
              if (!digit) {
                return <div key={colIdx} className="w-12 h-12 md:w-14 md:h-14" />
              }
              return (
                <button
                  key={digit}
                  onClick={() => handleDigitClick(digit, rowIdx, colIdx)}
                  disabled={isLoading || otp.length >= 6}
                  className={`
                    w-12 h-12 md:w-14 md:h-14
                    font-mono text-2xl md:text-3xl
                    transition-all duration-100
                    disabled:opacity-50
                    ${isSelected
                      ? 'text-white scale-125'
                      : 'text-white/50 hover:text-white'
                    }
                  `}
                >
                  {digit}
                </button>
              )
            })}
          </div>
        ))}

        {/* Riga azioni */}
        <div className="flex justify-center gap-8 md:gap-12 mt-6">
          {ACTION_SYMBOLS.map((symbol, colIdx) => {
            const isSelected = selectedRow === KEYBOARD_ROWS.length && selectedCol === colIdx
            const actionType = colIdx === 0 ? 'back' : colIdx === 1 ? 'resend' : 'done'
            return (
              <button
                key={symbol}
                onClick={() => handleActionClick(actionType, colIdx)}
                disabled={isLoading}
                className={`
                  text-2xl md:text-3xl
                  transition-all duration-100
                  disabled:opacity-50
                  ${isSelected
                    ? 'text-white scale-125'
                    : colIdx === 2 && otp.length === 6
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

      {/* Torna indietro */}
      {onBack && (
        <button
          onClick={onBack}
          disabled={isLoading}
          className="mt-8 text-white/30 hover:text-white/50 text-sm transition"
        >
          Cambia email
        </button>
      )}
    </div>
  )
}
