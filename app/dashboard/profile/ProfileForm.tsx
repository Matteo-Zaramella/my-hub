'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ProfileFormProps {
  currentEmail: string
}

export default function ProfileForm({ currentEmail }: ProfileFormProps) {
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!newEmail || newEmail === currentEmail) {
      setMessage({ type: 'error', text: 'Inserisci una nuova email diversa da quella attuale' })
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      })

      if (error) throw error

      setMessage({
        type: 'success',
        text: 'Email di conferma inviata! Controlla la tua nuova email per confermare il cambio.'
      })
      setNewEmail('')
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Errore durante il cambio email' })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!newPassword || newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La password deve essere lunga almeno 6 caratteri' })
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Le password non coincidono' })
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setMessage({
        type: 'success',
        text: 'Password aggiornata con successo! ✅'
      })
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Errore durante il cambio password' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{message.type === 'success' ? '✅' : '⚠️'}</span>
            <p className="text-sm">{message.text}</p>
          </div>
        </div>
      )}

      {/* Email Change Form */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📧 Cambia Email</h3>
        <form onSubmit={handleEmailChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nuova Email
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="nuova.email@example.com"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Riceverai un&apos;email di conferma al nuovo indirizzo
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !newEmail}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Invio in corso...' : '📧 Cambia Email'}
          </button>
        </form>
      </div>

      {/* Password Change Form */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🔑 Cambia Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nuova Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="Almeno 6 caratteri"
              disabled={loading}
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conferma Nuova Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="Ripeti la password"
              disabled={loading}
              minLength={6}
            />
          </div>

          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <p className="text-sm text-red-600">⚠️ Le password non coincidono</p>
          )}

          {newPassword && confirmPassword && newPassword === confirmPassword && (
            <p className="text-sm text-green-600">✅ Le password coincidono</p>
          )}

          <button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Aggiornamento...' : '🔑 Cambia Password'}
          </button>
        </form>
      </div>

      {/* Security Info */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span>🔐</span> Sicurezza
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Le tue credenziali sono crittografate da Supabase</li>
          <li>• Nessuno può vedere la tua password, nemmeno gli admin</li>
          <li>• I tuoi dati (pasti, allenamenti, wishlist, game) sono collegati al tuo User ID, non all&apos;email</li>
          <li>• Cambiare email o password NON cancella i tuoi dati</li>
        </ul>
      </div>
    </div>
  )
}
