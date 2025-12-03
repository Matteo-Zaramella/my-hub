'use client'

import { useState } from 'react'

interface ValidateAnswerTabProps {
  participantId: number
}

export default function ValidateAnswerTab({ participantId }: ValidateAnswerTabProps) {
  const [code, setCode] = useState('')
  const [confirmCode, setConfirmCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    correct?: boolean
    points?: number
    rank?: number
    message: string
    type?: 'clue' | 'challenge'
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    // Validazione: i due codici devono coincidere
    if (code !== confirmCode) {
      setResult({
        success: false,
        message: 'I due codici non coincidono. Ricontrolla e riprova.'
      })
      setLoading(false)
      return
    }

    try {
      // Chiamata API per validare il codice
      // L'API determinerà automaticamente se è un indizio o una sfida
      const res = await fetch('/api/validate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId,
          submittedCode: code
        })
      })

      const data = await res.json()
      setResult(data)

      if (data.correct) {
        // Clear inputs on success
        setCode('')
        setConfirmCode('')

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setResult(null)
        }, 5000)
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Errore di connessione. Riprova.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-3xl font-bold mb-2">Valida Risposta</h2>
          <p className="text-white/70">
            Inserisci il codice trovato negli indizi o nelle sfide
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 mb-6">
          <p className="text-sm text-purple-200 mb-2">
            ℹ️ <strong>Come funziona:</strong>
          </p>
          <ul className="text-sm text-white/70 space-y-1 list-disc list-inside">
            <li>Risolvi gli enigmi degli indizi per trovare i codici nascosti</li>
            <li>Partecipa alle sfide mensili per ottenere i codici finali</li>
            <li>Inserisci il codice esatto (30 caratteri, case-sensitive)</li>
            <li>Ricevi punti in base all'ordine di inserimento</li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-3">
              Codice (30 caratteri)
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Inserisci il codice di 30 caratteri"
              maxLength={30}
              className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white font-mono text-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition"
              required
              disabled={loading}
              autoComplete="off"
              spellCheck="false"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-white/50">
                ⚠️ Maiuscole/minuscole e caratteri devono essere esatti
              </p>
              <p className={`text-xs font-mono ${
                code.length === 30 ? 'text-green-400' : 'text-white/50'
              }`}>
                {code.length}/30
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-3">
              Conferma Codice (30 caratteri)
            </label>
            <input
              type="text"
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
              placeholder="Reinserisci il codice per conferma"
              maxLength={30}
              className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white font-mono text-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition"
              required
              disabled={loading}
              autoComplete="off"
              spellCheck="false"
            />
            <div className="flex justify-between items-center mt-2">
              <p className={`text-xs ${
                confirmCode && code === confirmCode ? 'text-green-400' : 'text-white/50'
              }`}>
                {confirmCode && code === confirmCode ? '✓ I codici coincidono' : 'ℹ️ Inserisci nuovamente il codice'}
              </p>
              <p className={`text-xs font-mono ${
                confirmCode.length === 30 ? 'text-green-400' : 'text-white/50'
              }`}>
                {confirmCode.length}/30
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 30 || confirmCode.length !== 30}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Verifica in corso...
              </span>
            ) : (
              'Valida Risposta'
            )}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className={`mt-6 p-6 rounded-xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
            result.correct
              ? 'bg-green-500/20 border-green-500/50'
              : 'bg-red-500/20 border-red-500/50'
          }`}>
            <div className="flex items-start gap-4">
              <div className="text-4xl flex-shrink-0">
                {result.correct ? '✅' : '❌'}
              </div>
              <div className="flex-1">
                <p className={`font-bold text-lg mb-2 ${
                  result.correct ? 'text-green-300' : 'text-red-300'
                }`}>
                  {result.message}
                </p>

                {result.correct && result.points && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏆</span>
                      <span className="text-3xl font-bold text-yellow-400">
                        +{result.points} punti
                      </span>
                    </div>
                    <div className="text-sm text-white/70">
                      {result.type === 'clue' && '📍 Indizio validato'}
                      {result.type === 'challenge' && '🎯 Sfida completata'}
                      {result.rank && ` • Posizione: #${result.rank}`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-sm text-white/60 mb-2">
            💡 <strong>Suggerimenti:</strong>
          </p>
          <ul className="text-xs text-white/50 space-y-1">
            <li>• Ogni codice può essere usato una sola volta</li>
            <li>• I primi a rispondere ottengono più punti</li>
            <li>• Gli indizi vengono rivelati progressivamente ogni sabato</li>
            <li>• Le sfide si svolgono l'ultimo weekend del mese</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
