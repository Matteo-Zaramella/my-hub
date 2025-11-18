'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function GameAreaControlTab() {
  const [systemMessage, setSystemMessage] = useState('')
  const [sending, setSending] = useState(false)
  const supabase = createClient()

  const sendSystemMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!systemMessage.trim() || sending) return

    setSending(true)

    try {
      const { error } = await supabase
        .from('game_chat_messages_v2')
        .insert({
          participant_id: 0, // System ID
          participant_name: 'Sistema',
          participant_code: 'SYSTEM',
          message: systemMessage.trim(),
          is_system_message: true,
        })

      if (error) throw error

      setSystemMessage('')
      alert('✅ Messaggio di sistema inviato con successo!')
    } catch (error) {
      console.error('Error sending system message:', error)
      alert('❌ Errore durante l\'invio del messaggio')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-white">🎮 Controllo Area di Gioco</h2>
          <a
            href="/game?password=EVOLUZIONE"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center gap-2"
          >
            🚀 Accedi all'Area di Gioco
          </a>
        </div>
        <p className="text-white/60">
          Gestisci la chat di gruppo e invia messaggi di sistema ai partecipanti.
        </p>
      </div>

      {/* Send System Message */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          📢 Invia Messaggio di Sistema
        </h3>

        <p className="text-sm text-white/60 mb-4">
          I messaggi di sistema vengono fissati in alto nella chat e sono visibili a tutti i partecipanti.
          Solo il messaggio più recente viene mostrato.
        </p>

        <form onSubmit={sendSystemMessage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Messaggio
            </label>
            <textarea
              value={systemMessage}
              onChange={(e) => setSystemMessage(e.target.value)}
              placeholder="Scrivi un messaggio importante per tutti i partecipanti..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              maxLength={500}
              disabled={sending}
            />
            <div className="mt-2 text-xs text-white/40 text-right">
              {systemMessage.length}/500 caratteri
            </div>
          </div>

          <button
            type="submit"
            disabled={!systemMessage.trim() || sending}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {sending ? 'Invio in corso...' : '📤 Invia Messaggio di Sistema'}
          </button>
        </form>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-2">ℹ️ Come Funziona</h3>
        <ul className="text-white/60 text-sm space-y-2">
          <li>• I messaggi di sistema appaiono in alto nella chat con un design speciale</li>
          <li>• Solo il messaggio più recente è visibile (gli altri sono nascosti)</li>
          <li>• Usa i messaggi di sistema per comunicazioni importanti come:</li>
          <li className="ml-6">- Annunci di nuove sfide</li>
          <li className="ml-6">- Aggiornamenti sul gioco</li>
          <li className="ml-6">- Avvisi o istruzioni urgenti</li>
          <li>• I partecipanti vedranno il messaggio appena entrano in chat</li>
        </ul>
      </div>

      {/* Examples */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-3">💡 Esempi di Messaggi</h3>
        <div className="space-y-3">
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-white/80 text-sm">
              🎉 <strong>Nuova Sfida Disponibile!</strong> La Sfida di Febbraio è ora attiva.
              Controllate la sezione Privato per i dettagli!
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-white/80 text-sm">
              ⏰ <strong>Promemoria:</strong> La sfida di questo mese termina tra 3 giorni.
              Affrettatevi a completarla per guadagnare punti!
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-white/80 text-sm">
              🏆 <strong>Classifica Aggiornata!</strong> Controllate la vostra posizione nella
              classifica generale. Complimenti ai primi 3!
            </p>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
        <h3 className="text-yellow-400 font-semibold mb-2">⚠️ Attenzione</h3>
        <p className="text-white/60 text-sm">
          I messaggi di sistema sono visibili a <strong>tutti i partecipanti</strong> immediatamente.
          Assicurati di controllare il testo prima di inviare.
        </p>
      </div>
    </div>
  )
}
