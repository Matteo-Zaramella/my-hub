'use client'

import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react'
import {
  SAMANTHA_BLOCKED_PHRASES,
  SAMANTHA_PAGE_PHRASES,
  SAMANTHA_EVENT_PHRASES,
  type SamanthaMessageType,
  type SamanthaMood
} from '@/lib/samantha-phrases'

// Re-export dei tipi per comodità
export type { SamanthaMessageType, SamanthaMood }

interface SamanthaMessage {
  text: string
  type: SamanthaMessageType
  mood?: SamanthaMood
}

interface SamanthaContextType {
  // Stato corrente
  message: SamanthaMessage | null
  isVisible: boolean
  isTyping: boolean
  displayedText: string

  // Metodi per mostrare messaggi
  showMessage: (text: string, type?: SamanthaMessageType, mood?: SamanthaMood, duration?: number) => void
  showRandomPhrase: (category: 'blocked' | 'welcome' | 'error' | 'success' | 'idle', duration?: number) => void
  showPagePhrase: (page: keyof typeof SAMANTHA_PAGE_PHRASES, duration?: number) => void
  showEventPhrase: (event: keyof typeof SAMANTHA_EVENT_PHRASES, duration?: number) => void

  // Metodi per nascondere
  hideMessage: () => void

  // Configurazione
  setTypingSpeed: (speed: number) => void
}

const SamanthaContext = createContext<SamanthaContextType | null>(null)

interface SamanthaProviderProps {
  children: ReactNode
  defaultTypingSpeed?: number
}

export function SamanthaProvider({ children, defaultTypingSpeed = 30 }: SamanthaProviderProps) {
  const [message, setMessage] = useState<SamanthaMessage | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [typingSpeed, setTypingSpeed] = useState(defaultTypingSpeed)

  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentIndexRef = useRef(0)

  // Cleanup degli interval/timeout
  const cleanup = useCallback(() => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
      typingIntervalRef.current = null
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }, [])

  // Effetto typing
  useEffect(() => {
    if (!message || !isVisible) return

    cleanup()
    setDisplayedText('')
    currentIndexRef.current = 0
    setIsTyping(true)

    typingIntervalRef.current = setInterval(() => {
      if (currentIndexRef.current < message.text.length) {
        setDisplayedText(message.text.slice(0, currentIndexRef.current + 1))
        currentIndexRef.current++
      } else {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current)
          typingIntervalRef.current = null
        }
        setIsTyping(false)
      }
    }, typingSpeed)

    return cleanup
  }, [message, isVisible, typingSpeed, cleanup])

  // Mostra un messaggio personalizzato
  const showMessage = useCallback((
    text: string,
    type: SamanthaMessageType = 'info',
    mood: SamanthaMood = 'neutral',
    duration?: number
  ) => {
    cleanup()

    setMessage({ text, type, mood })
    setIsVisible(true)

    if (duration && duration > 0) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => setMessage(null), 500) // Aspetta fade out
      }, duration)
    }
  }, [cleanup])

  // Mostra una frase random da una categoria
  const showRandomPhrase = useCallback((
    category: 'blocked' | 'welcome' | 'error' | 'success' | 'idle',
    duration?: number
  ) => {
    let phrases: string[]
    let type: SamanthaMessageType = 'info'
    let mood: SamanthaMood = 'neutral'

    switch (category) {
      case 'blocked':
        phrases = SAMANTHA_BLOCKED_PHRASES
        type = 'mystery'
        mood = 'mysterious'
        break
      case 'welcome':
        phrases = SAMANTHA_EVENT_PHRASES.welcome || []
        type = 'info'
        mood = 'helpful'
        break
      case 'error':
        phrases = SAMANTHA_EVENT_PHRASES.error || []
        type = 'error'
        mood = 'sarcastic'
        break
      case 'success':
        phrases = SAMANTHA_EVENT_PHRASES.success || []
        type = 'success'
        mood = 'helpful'
        break
      case 'idle':
        phrases = SAMANTHA_EVENT_PHRASES.idle || []
        type = 'mystery'
        mood = 'mysterious'
        break
      default:
        phrases = []
    }

    if (phrases.length > 0) {
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)]
      showMessage(randomPhrase, type, mood, duration)
    }
  }, [showMessage])

  // Mostra frase specifica per pagina
  const showPagePhrase = useCallback((
    page: keyof typeof SAMANTHA_PAGE_PHRASES,
    duration?: number
  ) => {
    const pageConfig = SAMANTHA_PAGE_PHRASES[page]
    if (pageConfig && pageConfig.phrases.length > 0) {
      const randomPhrase = pageConfig.phrases[Math.floor(Math.random() * pageConfig.phrases.length)]
      showMessage(randomPhrase, pageConfig.type, pageConfig.mood, duration)
    }
  }, [showMessage])

  // Mostra frase per evento
  const showEventPhrase = useCallback((
    event: keyof typeof SAMANTHA_EVENT_PHRASES,
    duration?: number
  ) => {
    const phrases = SAMANTHA_EVENT_PHRASES[event]
    if (phrases && phrases.length > 0) {
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)]
      showMessage(randomPhrase, 'info', 'neutral', duration)
    }
  }, [showMessage])

  // Nascondi messaggio
  const hideMessage = useCallback(() => {
    cleanup()
    setIsVisible(false)
    setTimeout(() => setMessage(null), 500)
  }, [cleanup])

  const value: SamanthaContextType = {
    message,
    isVisible,
    isTyping,
    displayedText,
    showMessage,
    showRandomPhrase,
    showPagePhrase,
    showEventPhrase,
    hideMessage,
    setTypingSpeed
  }

  return (
    <SamanthaContext.Provider value={value}>
      {children}
    </SamanthaContext.Provider>
  )
}

// Hook per usare Samantha
export function useSamantha() {
  const context = useContext(SamanthaContext)
  if (!context) {
    throw new Error('useSamantha must be used within a SamanthaProvider')
  }
  return context
}

// Hook opzionale che non lancia errori se usato fuori dal provider
export function useSamanthaOptional() {
  return useContext(SamanthaContext)
}
