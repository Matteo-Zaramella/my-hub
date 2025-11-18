'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface GameSetting {
  id: number
  setting_key: string
  setting_value: boolean
  description: string | null
  updated_at: string
}

export default function SettingsTab() {
  const [settings, setSettings] = useState<GameSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const { data, error } = await supabase
      .from('game_settings')
      .select('*')
      .order('setting_key')

    if (error) {
      console.error('Error loading settings:', error)
      return
    }

    setSettings(data || [])
    setLoading(false)
  }

  async function toggleSetting(settingKey: string, currentValue: boolean) {
    setSaving(settingKey)

    const { error } = await supabase
      .from('game_settings')
      .update({ setting_value: !currentValue })
      .eq('setting_key', settingKey)

    if (error) {
      console.error('Error updating setting:', error)
      alert('Errore nel salvare l\'impostazione')
    } else {
      // Ricarica le impostazioni
      await loadSettings()
      alert('✅ Impostazione aggiornata con successo!')
    }

    setSaving(null)
  }

  const getSettingIcon = (key: string) => {
    switch(key) {
      case 'registration_enabled': return '📝'
      case 'registration_form_enabled': return '📋'
      case 'ceremony_active': return '🎉'
      case 'chat_enabled': return '💬'
      case 'clues_reveal_enabled': return '🔍'
      case 'wishlist_enabled': return '🎁'
      case 'login_enabled': return '🔐'
      case 'password_input_enabled': return '🔑'
      default: return '⚙️'
    }
  }

  const getSettingLabel = (key: string) => {
    switch(key) {
      case 'registration_enabled': return 'Registrazione Partecipanti'
      case 'registration_form_enabled': return 'Form Registrazione Homepage'
      case 'ceremony_active': return 'Cerimonia Apertura'
      case 'chat_enabled': return 'Chat di Gruppo'
      case 'clues_reveal_enabled': return 'Rivelazione Indizi Automatica'
      case 'wishlist_enabled': return 'Wishlist Pubblica'
      case 'login_enabled': return 'Pagina di Login'
      case 'password_input_enabled': return 'Barra Inserimento Password'
      default: return key
    }
  }

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
        <h2 className="text-2xl font-bold text-white mb-2">⚙️ Impostazioni Globali</h2>
        <p className="text-white/60">
          Controlla l'attivazione delle varie funzionalità del gioco. Usa questi switch per attivare/disattivare features in produzione.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-4">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between">
              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getSettingIcon(setting.setting_key)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {getSettingLabel(setting.setting_key)}
                    </h3>
                    {setting.description && (
                      <p className="text-sm text-white/50 mt-1">{setting.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-white/30">
                    Ultimo aggiornamento: {new Date(setting.updated_at).toLocaleString('it-IT')}
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="ml-6">
                <button
                  onClick={() => toggleSetting(setting.setting_key, setting.setting_value)}
                  disabled={saving === setting.setting_key}
                  className={`
                    relative inline-flex h-8 w-16 items-center rounded-full transition-colors
                    ${setting.setting_value ? 'bg-green-500' : 'bg-white/20'}
                    ${saving === setting.setting_key ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                      ${setting.setting_value ? 'translate-x-9' : 'translate-x-1'}
                    `}
                  />
                </button>

                <div className="text-center mt-2">
                  {saving === setting.setting_key ? (
                    <span className="text-xs text-white/40">Salvando...</span>
                  ) : (
                    <span className={`text-xs font-semibold ${setting.setting_value ? 'text-green-400' : 'text-white/40'}`}>
                      {setting.setting_value ? 'ATTIVO' : 'INATTIVO'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Warning per registrazione */}
            {setting.setting_key === 'registration_enabled' && setting.setting_value && (
              <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-400/80 text-sm">
                  ⚠️ <strong>Attenzione:</strong> La registrazione è ora <strong>ATTIVA</strong>.
                  Tutti i partecipanti con il link possono registrarsi.
                </p>
              </div>
            )}

            {/* Info per cerimonia */}
            {setting.setting_key === 'ceremony_active' && setting.setting_value && (
              <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <p className="text-green-400/80 text-sm">
                  🎉 <strong>La cerimonia è iniziata!</strong> La password EVOLUZIONE è ora accettata e assegna +100 punti a tutti i presenti.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-2">ℹ️ Come Funziona</h3>
        <ul className="text-white/60 text-sm space-y-2">
          <li>• <strong>Form Registrazione Homepage:</strong> Mostra/nasconde il cerchio rosso di registrazione sulla homepage</li>
          <li>• <strong>Registrazione Partecipanti:</strong> Abilita/disabilita il form di registrazione completo (2-step)</li>
          <li>• <strong>Cerimonia Apertura:</strong> Attiva la cerimonia (password EVOLUZIONE funziona e illumina i cerchi)</li>
          <li>• <strong>Barra Inserimento Password:</strong> Mostra/nasconde la barra per inserire le password degli indizi</li>
          <li>• <strong>Chat di Gruppo:</strong> Abilita la chat per i partecipanti (dopo il 26/01/2026)</li>
          <li>• <strong>Rivelazione Indizi:</strong> Abilita la rivelazione automatica degli indizi ogni sabato</li>
          <li>• <strong>Wishlist Pubblica:</strong> Mostra/nasconde il cerchio blu della wishlist sulla homepage</li>
          <li>• <strong>Pagina di Login:</strong> Abilita/disabilita l'accesso alla pagina di login per admin</li>
        </ul>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <h3 className="text-red-400 font-semibold mb-2">⚠️ Zona Pericolosa</h3>
        <p className="text-white/60 text-sm mb-4">
          Queste impostazioni influenzano l'intera esperienza di gioco per tutti i partecipanti.
          Assicurati di sapere cosa stai facendo prima di modificarle.
        </p>
        <p className="text-white/40 text-xs">
          💡 <strong>Tip:</strong> Attiva la registrazione solo quando sei pronto a inviare il link ai partecipanti.
        </p>
      </div>
    </div>
  )
}
