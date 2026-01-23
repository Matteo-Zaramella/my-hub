'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LandingPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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
      setError('Inserisci il tuo codice')
      return
    }

    setLoading(true)
    setError('')

    // Verifica il codice
    const res = await fetch('/api/game/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim() })
    })

    if (res.ok) {
      router.push('/game/area')
    } else {
      setError('Codice non valido')
      setLoading(false)
    }
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

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

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
    </div>
  )
}
