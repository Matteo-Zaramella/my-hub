'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
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
  )
}
