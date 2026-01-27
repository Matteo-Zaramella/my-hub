'use client'
import { useState, useEffect, useRef } from 'react'
import { useSamanthaOptional } from '@/contexts/SamanthaContext'
import { cn } from '@/lib/utils'

interface SamanthaMessageProps {
  position?: 'top' | 'bottom' | 'center' | 'inline'
  className?: string
  variant?: 'solid' | 'blur' | 'transparent'
  size?: 'sm' | 'md' | 'lg'
}

export function SamanthaMessage({
  position = 'top',
  className,
  variant = 'blur',
  size = 'md'
}: SamanthaMessageProps) {
  const samantha = useSamanthaOptional()

  if (!samantha || !samantha.message || !samantha.isVisible) {
    return null
  }

  const { displayedText, isTyping, message } = samantha

  const positionClasses = {
    top: 'fixed top-0 left-0 right-0 pt-4 pb-8',
    bottom: 'fixed bottom-0 left-0 right-0 pb-4 pt-8',
    center: 'fixed inset-0 flex items-center justify-center',
    inline: 'relative'
  }

  const variantClasses = {
    solid: 'bg-black',
    blur: 'bg-black/60 backdrop-blur-sm',
    transparent: 'bg-transparent'
  }

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const typeColors: Record<string, string> = {
    info: 'text-white/70',
    warning: 'text-yellow-400',
    error: 'text-red-400',
    success: 'text-green-400',
    mystery: 'text-purple-400',
    system: 'text-cyan-400'
  }

  return (
    <div
      className={cn(
        positionClasses[position],
        variantClasses[variant],
        'z-50 transition-opacity duration-300',
        samantha.isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <div className="max-w-xl mx-auto px-4">
        <p className={cn(
          'font-mono text-center',
          sizeClasses[size],
          typeColors[message.type]
        )}>
          {displayedText}
          {isTyping && (
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-current animate-pulse" />
          )}
        </p>
      </div>
    </div>
  )
}

export function SamanthaFooter({ className }: { className?: string }) {
  const samantha = useSamanthaOptional()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showText, setShowText] = useState(true)
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const prevIsTypingRef = useRef(true)

  // Effetto di cancellazione dopo 1 secondo dal completamento della digitazione
  useEffect(() => {
    if (!samantha) return

    const { isTyping, displayedText } = samantha

    // Quando la digitazione finisce (isTyping passa da true a false)
    if (prevIsTypingRef.current && !isTyping && displayedText) {
      // Pulisci timeout precedenti
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current)
      }

      setShowText(true)
      setIsDeleting(false)

      // Dopo 1 secondo, inizia l'animazione di selezione
      deleteTimeoutRef.current = setTimeout(() => {
        setIsDeleting(true)

        // Dopo 600ms di selezione, nascondi il testo
        setTimeout(() => {
          setIsDeleting(false)
          setShowText(false)
        }, 600)
      }, 1000)
    }

    // Quando inizia una nuova digitazione, mostra il testo
    if (isTyping) {
      setShowText(true)
      setIsDeleting(false)
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current)
      }
    }

    prevIsTypingRef.current = isTyping

    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current)
      }
    }
  }, [samantha?.isTyping, samantha?.displayedText])

  if (!samantha) {
    return null
  }

  const { displayedText, isTyping, isVisible, message } = samantha
  const hasMessage = isVisible && message && showText

  // Non mostrare niente se non c'è messaggio
  if (!hasMessage) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'pointer-events-none',
        className
      )}
    >
      {/* Gradiente di sfondo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

      {/* Contenuto */}
      <div className="relative py-3 px-4">
        <div className="flex items-center justify-center">
          {/* Messaggio */}
          <p className={cn(
            'text-sm font-mono transition-all duration-300 text-white',
            isDeleting && 'bg-white text-black px-1'
          )}>
            {displayedText}
            {isTyping && (
              <span className="inline-block w-1.5 h-4 ml-0.5 bg-white animate-pulse" />
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export function SamanthaOverlay({ className }: { className?: string }) {
  const samantha = useSamanthaOptional()

  if (!samantha || !samantha.message || !samantha.isVisible) {
    return null
  }

  const { displayedText, isTyping, message } = samantha

  return (
    <div
      className={cn(
        'fixed inset-0 bg-black/90 z-50 flex items-center justify-center',
        'transition-opacity duration-500',
        samantha.isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <div className="max-w-2xl mx-auto px-8">
        <p className="font-mono text-lg md:text-xl text-center text-white leading-relaxed">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-2 h-5 ml-1 bg-white animate-pulse" />
          )}
        </p>
      </div>
    </div>
  )
}
