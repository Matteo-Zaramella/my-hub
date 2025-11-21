'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestingTab() {
  const [resetting, setResetting] = useState(false)
  const supabase = createClient()

  async function resetCeremonyClues() {
    const confirm1 = window.confirm(
      '⚠️ ATTENZIONE!\n\n' +
      'Stai per CANCELLARE tutti gli indizi trovati e resettare il bonus cerimonia.\n\n' +
      'Questa operazione:\n' +
      '- Cancella tutti i record da ceremony_clues_found\n' +
      '- Resetta opening_bonus_awarded a false per tutti i partecipanti\n\n' +
      'Vuoi continuare?'
    )

    if (!confirm1) return

    setResetting(true)

    try {
      // 1. Cancella tutti gli indizi trovati usando SQL raw
      console.log('🗑️ Step 1: Deleting all ceremony clues...')
      const { error: deleteError } = await supabase.rpc('delete_all_ceremony_clues')

      if (deleteError) {
        // Se la funzione RPC non esiste, proviamo con query diretta
        console.log('⚠️ RPC function not found, trying direct query...')
        const { error: directDeleteError } = await supabase
          .from('ceremony_clues_found')
          .delete()
          .gte('id', '00000000-0000-0000-0000-000000000000')

        if (directDeleteError) {
          throw new Error('Errore cancellazione indizi: ' + directDeleteError.message)
        }
      }

      console.log('✅ Step 1 completed: All clues deleted')

      // 2. Resetta opening_bonus_awarded per tutti i partecipanti
      console.log('🔄 Step 2: Resetting opening bonus flags...')
      const { error: updateError } = await supabase
        .from('game_participants')
        .update({ opening_bonus_awarded: false })
        .eq('opening_bonus_awarded', true)

      if (updateError) {
        throw new Error('Errore reset bonus: ' + updateError.message)
      }

      console.log('✅ Step 2 completed: Bonus flags reset')

      alert(
        '✅ Reset completato!\n\n' +
        '🗑️ Indizi cancellati\n' +
        '🔄 Bonus cerimonia resettato\n\n' +
        'Ricarica la homepage per vedere le modifiche.'
      )
    } catch (err) {
      console.error('❌ Error during reset:', err)
      alert('❌ Errore: ' + (err as Error).message + '\n\nProva a eseguire manualmente su Supabase SQL Editor:\n\nDELETE FROM ceremony_clues_found;\nUPDATE game_participants SET opening_bonus_awarded = false;')
    }

    setResetting(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">🧪 Gestione Test</h2>
        <p className="text-white/60">
          Strumenti per testare il gioco con utenti esterni. Usa questi comandi per resettare lo stato del sistema dopo i test.
        </p>
      </div>

      {/* Reset Ceremony Button */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-red-400 mb-2">🗑️ Reset Cerimonia Apertura</h3>
          <p className="text-white/60 text-sm mb-3">
            Cancella tutti gli indizi trovati e resetta il bonus cerimonia per tutti i partecipanti.
            Utile dopo aver fatto testare il sistema a utenti esterni.
          </p>
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 mb-4">
            <p className="text-red-300/80 text-xs">
              ⚠️ <strong>Cosa fa questo comando:</strong>
            </p>
            <ul className="text-red-300/60 text-xs mt-2 space-y-1 ml-4">
              <li>• Cancella TUTTI i record dalla tabella <code className="bg-black/30 px-1 rounded">ceremony_clues_found</code></li>
              <li>• Resetta <code className="bg-black/30 px-1 rounded">opening_bonus_awarded = false</code> per tutti i partecipanti</li>
              <li>• Le colonne sulla homepage torneranno spente</li>
              <li>• I partecipanti potranno ricevere di nuovo il bonus +100 punti</li>
            </ul>
          </div>
        </div>

        <button
          onClick={resetCeremonyClues}
          disabled={resetting}
          className={`
            w-full px-6 py-4 rounded-lg font-semibold transition-colors
            ${resetting
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : 'bg-red-500 text-white hover:bg-red-600'}
          `}
        >
          {resetting ? '⏳ Resettando...' : '🗑️ Reset Cerimonia Apertura'}
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-2">💡 Quando Usare Questo Reset</h3>
        <ul className="text-white/60 text-sm space-y-2">
          <li>• <strong>Dopo test con utenti esterni:</strong> Quando fai provare il sito a qualcuno per verificare l'UX</li>
          <li>• <strong>Prima della cerimonia vera:</strong> Per partire con il sistema pulito il 24/01/2026</li>
          <li>• <strong>Durante lo sviluppo:</strong> Se vuoi testare di nuovo il flow completo degli indizi</li>
        </ul>
      </div>

      {/* Alternative SQL */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
        <h3 className="text-yellow-400 font-semibold mb-2">🔧 Alternativa Manuale (SQL)</h3>
        <p className="text-white/60 text-sm mb-3">
          Se il pulsante sopra non funziona, puoi eseguire questi comandi direttamente su{' '}
          <a
            href="https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Supabase SQL Editor
          </a>:
        </p>
        <div className="bg-black/30 rounded-lg p-4 font-mono text-xs text-green-400">
          <div>-- Cancella tutti gli indizi</div>
          <div>DELETE FROM ceremony_clues_found;</div>
          <div className="mt-2">-- Resetta bonus cerimonia</div>
          <div>UPDATE game_participants SET opening_bonus_awarded = false;</div>
        </div>
      </div>
    </div>
  )
}
