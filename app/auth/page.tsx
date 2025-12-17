'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Login form
  const [loginData, setLoginData] = useState({
    identifier: '', // nickname o email
    password: '',
  })

  // Register form
  const [registerData, setRegisterData] = useState({
    name: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Cerca partecipante per nickname o email
      const { data: participant, error: fetchError } = await supabase
        .from('game_participants')
        .select('*')
        .or(`nickname.eq.${loginData.identifier},email.eq.${loginData.identifier}`)
        .single()

      if (fetchError || !participant) {
        setError('Credenziali non valide')
        setLoading(false)
        return
      }

      // Verifica password (per ora confronto diretto, in produzione usare bcrypt)
      if (participant.password !== loginData.password) {
        setError('Credenziali non valide')
        setLoading(false)
        return
      }

      // Salva sessione in localStorage
      localStorage.setItem('participant_session', JSON.stringify({
        id: participant.id,
        name: participant.name,
        nickname: participant.nickname,
        code: participant.participant_code,
      }))

      // Redirect to countdown/landing
      router.push('/')
    } catch (err) {
      console.error('Login error:', err)
      setError('Errore durante il login')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validazione
    if (!registerData.name || !registerData.nickname || !registerData.email || !registerData.password) {
      setError('Compila tutti i campi obbligatori')
      setLoading(false)
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Le password non coincidono')
      setLoading(false)
      return
    }

    if (registerData.password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri')
      setLoading(false)
      return
    }

    try {
      // Genera codice partecipante (3 lettere + 3 numeri)
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const numbers = '0123456789'
      const code =
        Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('') +
        Array.from({ length: 3 }, () => numbers[Math.floor(Math.random() * numbers.length)]).join('')

      // Crea partecipante
      const { data: newParticipant, error: insertError } = await supabase
        .from('game_participants')
        .insert({
          name: registerData.name,
          nickname: registerData.nickname,
          email: registerData.email,
          password: registerData.password, // In produzione: bcrypt.hash(registerData.password, 10)
          participant_code: code,
          registration_completed: true,
          points: 0,
        })
        .select()
        .single()

      if (insertError) {
        if (insertError.code === '23505') { // Unique constraint violation
          setError('Nickname o email già registrati')
        } else {
          setError('Errore durante la registrazione')
        }
        setLoading(false)
        return
      }

      // Auto-login dopo registrazione
      localStorage.setItem('participant_session', JSON.stringify({
        id: newParticipant.id,
        name: newParticipant.name,
        nickname: newParticipant.nickname,
        code: newParticipant.participant_code,
      }))

      // Redirect to countdown/landing
      router.push('/')
    } catch (err) {
      console.error('Registration error:', err)
      setError('Errore durante la registrazione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Toggle Login/Register */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => {
              setIsLogin(true)
              setError('')
            }}
            className={`w-32 h-32 border-4 transition ${
              isLogin
                ? 'border-white'
                : 'border-white/30 hover:border-white/50'
            }`}
          />
          <button
            onClick={() => {
              setIsLogin(false)
              setError('')
            }}
            className={`w-32 h-32 border-4 transition ${
              !isLogin
                ? 'border-white'
                : 'border-white/30 hover:border-white/50'
            }`}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-400 text-center mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        {isLogin && (
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="text"
              value={loginData.identifier}
              onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
              className="w-full bg-transparent text-white px-6 py-4 border-4 border-white focus:outline-none text-lg"
              placeholder="NICKNAME O EMAIL"
              required
            />

            <input
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className="w-full bg-transparent text-white px-6 py-4 border-4 border-white focus:outline-none text-lg"
              placeholder="PASSWORD"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-32 h-32 border-4 border-white hover:bg-white/10 disabled:opacity-50 transition mx-auto block"
            />
          </form>
        )}

        {/* Register Form */}
        {!isLogin && (
          <form onSubmit={handleRegister} className="space-y-6">
            <input
              type="text"
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              className="w-full bg-transparent text-white px-6 py-4 border-4 border-white focus:outline-none text-lg"
              placeholder="NOME COMPLETO"
              required
            />

            <input
              type="text"
              value={registerData.nickname}
              onChange={(e) => setRegisterData({ ...registerData, nickname: e.target.value })}
              className="w-full bg-transparent text-white px-6 py-4 border-4 border-white focus:outline-none text-lg"
              placeholder="NICKNAME"
              required
            />

            <input
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              className="w-full bg-transparent text-white px-6 py-4 border-4 border-white focus:outline-none text-lg"
              placeholder="EMAIL"
              required
            />

            <input
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              className="w-full bg-transparent text-white px-6 py-4 border-4 border-white focus:outline-none text-lg"
              placeholder="PASSWORD"
              required
            />

            <input
              type="password"
              value={registerData.confirmPassword}
              onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              className="w-full bg-transparent text-white px-6 py-4 border-4 border-white focus:outline-none text-lg"
              placeholder="CONFERMA PASSWORD"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-32 h-32 border-4 border-white hover:bg-white/10 disabled:opacity-50 transition mx-auto block"
            />
          </form>
        )}
      </div>
    </div>
  )
}
