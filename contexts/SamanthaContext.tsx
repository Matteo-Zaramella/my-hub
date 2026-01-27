'use client'
import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react'
import {
  SAMANTHA_PAGE_PHRASES,
  SAMANTHA_EVENT_PHRASES,
  type SamanthaMessageType,
  type SamanthaMood
} from '@/lib/samantha-phrases'

// Re-export dei tipi per comodita
export type { SamanthaMessageType, SamanthaMood }

interface SamanthaMessage {
  text: string
  type: SamanthaMessageType
  mood: SamanthaMood
}

interface SamanthaContextType {
  message: SamanthaMessage | null
  isVisible: boolean
  isTyping: boolean
  displayedText: string
  showMessage: (text: string, type?: SamanthaMessageType, mood?: SamanthaMood, duration?: number) => void
  showPagePhrase: (page: string, duration?: number) => void
  showEventPhrase: (event: string, duration?: number) => void
  hideMessage: () => void
}

const SamanthaContext = createContext<SamanthaContextType | null>(null)

interface SamanthaProviderProps {
  children: ReactNode
  defaultTypingSpeed?: number
}

export function SamanthaProvider({ children, defaultTypingSpeed = 35 }: SamanthaProviderProps) {
  const [message, setMessage] = useState<SamanthaMessage | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [displayedText, setDisplayedText] = useState('')

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const typingRef = useRef<NodeJS.Timeout | null>(null)

  // Effetto typing
  useEffect(() => {
    if (!message) {
      setDisplayedText('')
      return
    }

    const text = message.text
    let charIndex = 0
    setDisplayedText('')
    setIsTyping(true)

    const typeNextChar = () => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1))
        charIndex++
        typingRef.current = setTimeout(typeNextChar, defaultTypingSpeed)
      } else {
        setIsTyping(false)
      }
    }

    typeNextChar()

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current)
    }
  }, [message, defaultTypingSpeed])

  const showMessage = useCallback((
    text: string,
    type: SamanthaMessageType = 'info',
    mood: SamanthaMood = 'neutral',
    duration?: number
  ) => {
    // Pulisci timeout precedenti
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (typingRef.current) clearTimeout(typingRef.current)

    setMessage({ text, type, mood })
    setIsVisible(true)

    if (duration) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => setMessage(null), 300)
      }, duration)
    }
  }, [])

  const showPagePhrase = useCallback((page: string, duration?: number) => {
    const config = SAMANTHA_PAGE_PHRASES[page]
    if (!config) return

    const phrase = config.phrases[Math.floor(Math.random() * config.phrases.length)]
    showMessage(phrase, config.type, config.mood, duration)
  }, [showMessage])

  const showEventPhrase = useCallback((event: string, duration?: number) => {
    const phrases = SAMANTHA_EVENT_PHRASES[event]
    if (!phrases) return

    const phrase = phrases[Math.floor(Math.random() * phrases.length)]
    showMessage(phrase, 'info', 'neutral', duration)
  }, [showMessage])

  const hideMessage = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
    setTimeout(() => setMessage(null), 300)
  }, [])

  return (
    <SamanthaContext.Provider value={{
      message,
      isVisible,
      isTyping,
      displayedText,
      showMessage,
      showPagePhrase,
      showEventPhrase,
      hideMessage
    }}>
      {children}
    </SamanthaContext.Provider>
  )
}

export function useSamantha() {
  const context = useContext(SamanthaContext)
  if (!context) {
    throw new Error('useSamantha must be used within a SamanthaProvider')
  }
  return context
}

export function useSamanthaOptional() {
  return useContext(SamanthaContext)
}
