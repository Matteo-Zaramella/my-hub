'use client'

import { useState, useEffect } from 'react'

interface Variazione {
  id: string;
  timestamp: string;
  tipo: 'alimentazione' | 'palestra';
  testo: string;
  processato: boolean;
}

export default function VariazioniPage() {
  const [tipo, setTipo] = useState<'alimentazione' | 'palestra'>('alimentazione')
  const [testo, setTesto] = useState('')
  const [variazioni, setVariazioni] = useState<Variazione[]>([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  // Carica variazioni esistenti
  useEffect(() => {
    fetchVariazioni()
  }, [])

  const fetchVariazioni = async () => {
    try {
      const res = await fetch('/api/private/variazioni')
      const data = await res.json()
      setVariazioni(data.variazioni || [])
    } catch (e) {
      console.error('Errore caricamento:', e)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!testo.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/private/variazioni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, testo: testo.trim() })
      })

      if (res.ok) {
        setTesto('')
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
        fetchVariazioni()
      }
    } catch (e) {
      console.error('Errore salvataggio:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/private/variazioni?id=${id}`, { method: 'DELETE' })
      fetchVariazioni()
    } catch (e) {
      console.error('Errore eliminazione:', e)
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const variazioniPending = variazioni.filter(v => !v.processato)

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-light mb-2">Variazioni</h1>
      <p className="text-white/40 text-sm mb-6">
        Inserisci variazioni da pasti o allenamenti. Verranno processate quando torni a casa.
      </p>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="mb-8">
        {/* Tipo selector */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setTipo('alimentazione')}
            className={`flex-1 py-3 text-sm font-medium transition ${
              tipo === 'alimentazione'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 border'
                : 'bg-white/5 border-white/20 text-white/60 border hover:bg-white/10'
            }`}
          >
            Alimentazione
          </button>
          <button
            type="button"
            onClick={() => setTipo('palestra')}
            className={`flex-1 py-3 text-sm font-medium transition ${
              tipo === 'palestra'
                ? 'bg-orange-500/20 border-orange-500 text-orange-400 border'
                : 'bg-white/5 border-white/20 text-white/60 border hover:bg-white/10'
            }`}
          >
            Palestra
          </button>
        </div>

        {/* Textarea */}
        <textarea
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          placeholder={tipo === 'alimentazione'
            ? "Es: Pranzo - mangiato pasta invece di riso, cena saltata..."
            : "Es: Panca 4x10 a 80kg, saltato tricipiti..."
          }
          className="w-full h-32 bg-white/5 border border-white/20 p-4 text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-white/40"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !testo.trim()}
          className={`w-full mt-3 py-3 font-medium transition ${
            saved
              ? 'bg-emerald-500 text-black'
              : 'bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {saved ? '✓ Salvato!' : loading ? 'Salvataggio...' : 'Salva Variazione'}
        </button>
      </form>

      {/* Lista variazioni pending */}
      {variazioniPending.length > 0 && (
        <div>
          <h2 className="text-lg font-light mb-3 text-white/60">
            Da processare ({variazioniPending.length})
          </h2>
          <div className="space-y-2">
            {variazioniPending.map((v) => (
              <div
                key={v.id}
                className={`border p-4 ${
                  v.tipo === 'alimentazione'
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-orange-500/30 bg-orange-500/5'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      v.tipo === 'alimentazione'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {v.tipo}
                    </span>
                    <span className="text-white/40 text-xs">
                      {formatDate(v.timestamp)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="text-white/30 hover:text-red-400 text-sm"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-white/80 text-sm whitespace-pre-wrap">{v.testo}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {variazioniPending.length === 0 && (
        <div className="text-center py-8 text-white/30">
          Nessuna variazione in attesa
        </div>
      )}

      {/* Istruzioni */}
      <div className="mt-8 p-4 border border-white/10 bg-white/5 text-sm text-white/40">
        <p className="mb-2">Quando torni a casa, dimmi:</p>
        <p className="text-white/60 italic">"Controlla le variazioni"</p>
        <p className="mt-2">e aggiornerò automaticamente i log.</p>
      </div>
    </div>
  )
}
