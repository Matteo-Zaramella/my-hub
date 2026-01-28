'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSamantha } from '@/contexts/SamanthaContext'

export default function LandingPage() {
  const router = useRouter()
  const samantha = useSamantha()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [welcomeShown, setWelcomeShown] = useState(false)

  // Stati per richiesta iscrizione
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestEmail, setRequestEmail] = useState('')
  const [requestMessage, setRequestMessage] = useState('')
  const [requestLoading, setRequestLoading] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [requestError, setRequestError] = useState('')

  // Blocco iscrizioni dopo le 17:00 del 24/01/2026
  const registrationDeadline = new Date('2026-01-24T17:00:00')
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false)

  useEffect(() => {
    const checkDeadline = () => {
      setIsRegistrationClosed(new Date() >= registrationDeadline)
    }
    checkDeadline()
    const interval = setInterval(checkDeadline, 60000) // Controlla ogni minuto
    return () => clearInterval(interval)
  }, [])

  // Samantha: mostra messaggio di benvenuto
  useEffect(() => {
    if (!welcomeShown) {
      const timer = setTimeout(() => {
        samantha.showPagePhrase('landing', 4000)
        setWelcomeShown(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [welcomeShown, samantha])

  // TODO: Riattivare auto-redirect dopo sviluppo
  // const [checkingSession, setCheckingSession] = useState(true)
  // useEffect(() => {
  //   async function checkExistingSession() {
  //     try {
  //       const res = await fetch('/api/game/check-session')
  //       if (res.ok) {
  //         const data = await res.json()
  //         if (data.valid) {
  //           router.push('/game/area')
  //           return
  //         }
  //       }
  //     } catch {
  //       // Ignora errori
  //     }
  //     setCheckingSession(false)
  //   }
  //   checkExistingSession()
  // }, [router])

  async function handleAccess(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) {
      samantha.showMessage('Inserisci il codice.', 'warning', 'sarcastic', 3000)
      return
    }

    setLoading(true)

    // Verifica il codice
    const res = await fetch('/api/game/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim() })
    })

    if (res.ok) {
      samantha.showEventPhrase('codeCorrect', 2000)
      setTimeout(() => router.push('/game/area'), 1000)
    } else {
      samantha.showEventPhrase('codeWrong', 3000)
      setLoading(false)
    }
  }

  async function handleRequestAccess(e: React.FormEvent) {
    e.preventDefault()
    if (!requestEmail.trim() || !requestEmail.includes('@')) {
      setRequestError('Inserisci una email valida')
      return
    }

    setRequestLoading(true)
    setRequestError('')

    try {
      const res = await fetch('/api/game/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: requestEmail.trim(),
          message: requestMessage.trim()
        })
      })

      if (res.ok) {
        setRequestSent(true)
      } else {
        setRequestError('Errore nell\'invio della richiesta')
      }
    } catch {
      setRequestError('Errore di connessione')
    }
    setRequestLoading(false)
  }

  // TODO: Riattivare dopo sviluppo
  // if (checkingSession) {
  //   return (
  //     <div className="fixed inset-0 bg-black flex items-center justify-center">
  //       <div className="text-white/50">Caricamento...</div>
  //     </div>
  //   )
  // }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Header con icona area privata */}
      <header className="w-full p-4 flex justify-end">
        <Link
          href="/private"
          className="text-white/30 hover:text-white/60 transition"
          title="Area Privata"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </header>

      {/* Contenuto centrale */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <h1 className="text-3xl font-light text-white mb-12">
            Benvenuto
          </h1>

          <form onSubmit={handleAccess} className="space-y-4">
            <div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Inserisci il tuo codice"
                suppressHydrationWarning
                className="w-full px-4 py-3 bg-transparent border border-white/20 text-white text-center placeholder:text-white/30 focus:border-white/50 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 border border-white/40 text-white hover:bg-white hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifica...' : 'Accedi'}
            </button>
          </form>

          <Link
            href="/wishlist"
            className="block mt-8 text-white/40 hover:text-white/60 text-sm transition"
          >
            Wishlist
          </Link>
        </div>
      </main>

      {/* Modal richiesta accesso */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white/20 p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-lg">Richiedi accesso</h2>
              <button
                onClick={() => {
                  setShowRequestModal(false)
                  setRequestSent(false)
                  setRequestError('')
                }}
                className="text-white/40 hover:text-white"
              >
                ✕
              </button>
            </div>

            {requestSent ? (
              <div className="text-center py-4">
                <p className="text-green-400 mb-4">Richiesta inviata!</p>
                <p className="text-white/60 text-sm">
                  Ti contatteremo se la tua richiesta verrà accettata.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestAccess} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={requestEmail}
                    onChange={(e) => setRequestEmail(e.target.value)}
                    placeholder="La tua email"
                    className="w-full px-4 py-3 bg-transparent border border-white/20 text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none transition"
                  />
                </div>

                <div>
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Messaggio (opzionale)"
                    rows={3}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none transition resize-none"
                  />
                </div>

                {requestError && (
                  <p className="text-red-400 text-sm">{requestError}</p>
                )}

                <button
                  type="submit"
                  disabled={requestLoading}
                  className="w-full px-4 py-3 border border-white/40 text-white hover:bg-white hover:text-black transition disabled:opacity-50"
                >
                  {requestLoading ? 'Invio...' : 'Invia richiesta'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
