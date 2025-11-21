'use client'

import { useState } from 'react'

export default function SettingsTab() {
  const [loading] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white/60">Caricamento impostazioni...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">⚙️ Impostazioni</h2>
        <p className="text-white/60">
          Questa sezione è riservata per future impostazioni di configurazione del gioco.
        </p>
      </div>

      {/* Placeholder */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
        <div className="text-white/40 text-lg mb-2">📋 Nessuna impostazione configurata</div>
        <p className="text-white/30 text-sm">
          Le impostazioni verranno aggiunte qui quando necessario
        </p>
      </div>
    </div>
  )
}
