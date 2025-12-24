'use client'

export default function SettingsTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">⚙️ Impostazioni Gioco</h2>
        <p className="text-white/60">
          Gestisci le impostazioni del gioco
        </p>
      </div>

      {/* Placeholder - altre impostazioni future */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
        <div className="text-white/40 text-lg">
          Nessuna impostazione disponibile al momento
        </div>
      </div>
    </div>
  )
}
