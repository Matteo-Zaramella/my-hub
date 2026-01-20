'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PrivateLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/private/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await res.json()

      if (data.success) {
        router.push('/private/dashboard')
      } else {
        setError(data.error || 'Accesso negato')
      }
    } catch {
      setError('Errore di connessione')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="w-full p-4">
        <Link href="/" className="text-white/40 hover:text-white transition" title="Home">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm px-6">
          <h1 className="text-2xl font-light text-center mb-8">Area Privata</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-transparent border border-white/30 px-4 py-3 text-center placeholder-white/30 focus:outline-none focus:border-white transition"
            autoComplete="current-password"
            autoFocus
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full border border-white/40 text-white py-3 hover:bg-white hover:text-black transition disabled:opacity-30"
          >
            {loading ? 'Accesso...' : 'Accedi'}
          </button>
        </form>
        </div>
      </div>
    </div>
  )
}
