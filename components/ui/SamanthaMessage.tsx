'use client'

import { useState, useEffect, useRef } from 'react'
import { useSamanthaOptional } from '@/contexts/SamanthaContext'
import { cn } from '@/lib/utils'

interface SamanthaMessageProps {
  // Posizione del messaggio
  position?: 'top' | 'bottom' | 'center' | 'inline'
  // Stile custom
  className?: string
  // Mostra sempre il cursore lampeggiante
  showCursor?: boolean
  // Dimensione del testo
  size?: 'sm' | 'md' | 'lg'
  // Sfondo trasparente o con blur
  variant?: 'transparent' | 'blur' | 'solid'
}

export function SamanthaMessage({
  position = 'bottom',
  className,
  showCursor = true,
  size = 'md',
  variant = 'transparent'
}: SamanthaMessageProps) {
  const samantha = useSamanthaOptional()

  // Se non c'è context o messaggio, non mostrare nulla
  if (!samantha || !samantha.message || !samantha.isVisible) {
    return null
  }

  const { displayedText, isTyping, message } = samantha

  // Colori in base al tipo di messaggio
  const typeColors: Record<string, string> = {
    info: 'text-white/70',
    warning: 'text-yellow-400/90',
    error: 'text-red-400/90',
    success: 'text-green-400/90',
    mystery: 'text-purple-400/90',
    system: 'text-cyan-400/90'
  }

  // Dimensioni testo
  const sizeClasses: Record<string, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  // Varianti sfondo
  const variantClasses: Record<string, string> = {
    transparent: 'bg-transparent',
    blur: 'bg-black/50 backdrop-blur-sm',
    solid: 'bg-black/80'
  }

  // Posizione
  const positionClasses: Record<string, string> = {
    top: 'fixed top-4 left-1/2 -translate-x-1/2 z-50',
    bottom: 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
    center: 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
    inline: 'relative'
  }

  return (
    <div
      className={cn(
        positionClasses[position],
        variantClasses[variant],
        'px-4 py-2 rounded transition-opacity duration-500',
        samantha.isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <span
        className={cn(
          'font-mono',
          sizeClasses[size],
          typeColors[message.type]
        )}
      >
        {displayedText}
        {showCursor && (isTyping || displayedText.length > 0) && (
          <span className={cn(
            'ml-0.5 inline-block w-2 h-4 align-middle',
            isTyping ? 'animate-pulse bg-current' : 'bg-transparent'
          )}>
            {isTyping ? '' : '_'}
          </span>
        )}
      </span>
    </div>
  )
}

// Componente overlay a schermo intero per messaggi importanti
export function SamanthaOverlay({
  className,
  showCursor = true
}: {
  className?: string
  showCursor?: boolean
}) {
  const samantha = useSamanthaOptional()

  if (!samantha || !samantha.message || !samantha.isVisible) {
    return null
  }

  const { displayedText, isTyping, message } = samantha

  const typeColors: Record<string, string> = {
    info: 'text-white',
    warning: 'text-yellow-400',
    error: 'text-red-500',
    success: 'text-green-400',
    mystery: 'text-purple-400',
    system: 'text-cyan-400'
  }

  return (
    <div
      className={cn(
        'fixed inset-0 bg-black/90 flex items-center justify-center z-[100]',
        'transition-opacity duration-700',
        samantha.isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
        className
      )}
    >
      <div className="max-w-2xl px-8 text-center">
        <p
          className={cn(
            'font-mono text-xl md:text-2xl',
            typeColors[message.type]
          )}
        >
          {displayedText}
          {showCursor && (
            <span className={cn(
              'ml-1 inline-block w-3 h-6 align-middle',
              isTyping ? 'animate-pulse bg-current' : 'bg-transparent'
            )}>
              {!isTyping && '_'}
            </span>
          )}
        </p>
      </div>
    </div>
  )
}

// Componente footer persistente per messaggi Samantha
// Appare su tutte le pagine, ma il contenuto è filtrato dal context
export function SamanthaFooter({
  className
}: {
  className?: string
}) {
  const samantha = useSamanthaOptional()
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasTriggeredDelete = useRef(false)

  // Effetto cancellazione dopo che il typing è completato
  useEffect(() => {
    // Reset del flag quando cambia il messaggio
    if (samantha?.isTyping) {
      hasTriggeredDelete.current = false
    }

    if (samantha?.isVisible && !samantha?.isTyping && samantha?.displayedText && !hasTriggeredDelete.current) {
      hasTriggeredDelete.current = true

      // Pulisci timeout precedente
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current)
      }

      // Dopo 1 secondo di rest, inizia la cancellazione
      deleteTimeoutRef.current = setTimeout(() => {
        setIsDeleting(true)
        // Dopo 300ms di selezione, nascondi definitivamente
        setTimeout(() => {
          setIsDeleting(false)
          // Nascondi il messaggio nel context - sparisce definitivamente
          samantha?.hideMessage()
        }, 300)
      }, 1000)
    }

    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current)
      }
    }
  }, [samantha?.isVisible, samantha?.isTyping, samantha?.displayedText, samantha])

  // Reset quando arriva un nuovo messaggio
  useEffect(() => {
    if (samantha?.isTyping) {
      setIsDeleting(false)
    }
  }, [samantha?.isTyping])

  if (!samantha) {
    return null
  }

  const { displayedText, isTyping, isVisible, message } = samantha
  const hasMessage = isVisible && message

  // Non mostrare nulla se non c'è messaggio
  if (!hasMessage && !isDeleting) {
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
      <div className="relative py-4 px-4">
        <div className="flex items-center justify-center">
          {/* Messaggio */}
          <p className={cn(
            'text-sm font-mono transition-all duration-200',
            // Effetto selezione: sfondo bianco, testo nero
            isDeleting ? 'bg-white text-black px-1' : 'text-white'
          )}>
            {displayedText}
            {isTyping && (
              <span className="inline-block w-2 h-4 ml-0.5 bg-white animate-pulse" />
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

// Hook per triggering automatico basato su eventi pagina
export function useSamanthaPageEffect(
  page: string,
  options?: {
    delay?: number
    duration?: number
    showOnMount?: boolean
  }
) {
  const samantha = useSamanthaOptional()
  const { delay = 1000, duration = 5000, showOnMount = true } = options || {}

  // Mostra messaggio al mount se richiesto
  if (typeof window !== 'undefined' && showOnMount && samantha) {
    // Usa setTimeout per evitare problemi di hydration
    setTimeout(() => {
      samantha.showPagePhrase(page as keyof typeof import('@/lib/samantha-phrases').SAMANTHA_PAGE_PHRASES, duration)
    }, delay)
  }

  return samantha
}
