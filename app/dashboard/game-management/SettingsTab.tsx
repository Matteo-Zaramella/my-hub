'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SettingsTab() {
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [participantAuthEnabled, setParticipantAuthEnabled] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // Load maintenance mode setting
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('game_settings')
        .select('setting_value')
        .eq('setting_key', 'maintenance_mode')
        .single()

      if (!maintenanceError && maintenanceData) {
        setMaintenanceMode(maintenanceData.setting_value ?? false)
      }

      // Load participant_auth_enabled setting
      const { data: authData, error: authError } = await supabase
        .from('game_settings')
        .select('setting_value')
        .eq('setting_key', 'participant_auth_enabled')
        .single()

      if (!authError && authData) {
        setParticipantAuthEnabled(authData.setting_value ?? true)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateMaintenanceMode = async (value: boolean) => {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('game_settings')
        .update({ setting_value: value })
        .eq('setting_key', 'maintenance_mode')

      if (error) throw error

      setMaintenanceMode(value)
    } catch (error) {
      console.error('Error updating maintenance mode:', error)
      alert('Errore durante l\'aggiornamento della modalità manutenzione')
    } finally {
      setUpdating(false)
    }
  }

  const updateSetting = async (field: string, value: boolean) => {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('game_settings')
        .update({ setting_value: value })
        .eq('setting_key', field)

      if (error) throw error

      // Aggiorna lo stato locale
      if (field === 'participant_auth_enabled') setParticipantAuthEnabled(value)
    } catch (error) {
      console.error('Error updating setting:', error)
      alert('Errore durante l\'aggiornamento dell\'impostazione')
    } finally {
      setUpdating(false)
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
        <h2 className="text-2xl font-bold text-white mb-2">⚙️ Impostazioni Gioco</h2>
        <p className="text-white/60">
          Gestisci modalità manutenzione e accesso alla registrazione partecipanti
        </p>
      </div>

      {/* Maintenance Mode Toggle - Prominent */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-xl flex items-center gap-2">
              🚧 Modalità Manutenzione
            </h3>
            <p className="text-white/60 text-sm mt-2">
              Attiva la schermata "Work in Progress" con messaggio casuale dell'Entità AI
            </p>
            <p className="text-white/40 text-xs mt-1">
              Quando attiva, i visitatori vedranno uno schermo nero con un messaggio casuale
            </p>
          </div>
          <button
            onClick={() => updateMaintenanceMode(!maintenanceMode)}
            disabled={updating}
            className={`relative inline-flex h-10 w-16 items-center rounded-full transition-colors ${
              maintenanceMode ? 'bg-red-600' : 'bg-gray-600'
            } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                maintenanceMode ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Participant Authentication Toggle */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-xl flex items-center gap-2">
              🔓 Bypass Autenticazione Partecipanti
            </h3>
            <p className="text-white/60 text-sm mt-2">
              Permette accesso alla landing senza login (bypass della schermata /auth)
            </p>
            <p className="text-white/40 text-xs mt-1">
              ATTIVO (verde) = Login richiesto | DISATTIVO (grigio) = Bypass attivo, accesso diretto
            </p>
          </div>
          <button
            onClick={() => updateSetting('participant_auth_enabled', !participantAuthEnabled)}
            disabled={updating}
            className={`relative inline-flex h-10 w-16 items-center rounded-full transition-colors ${
              participantAuthEnabled ? 'bg-green-600' : 'bg-gray-600'
            } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                participantAuthEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          ℹ️ Come Funziona
        </h3>
        <ul className="text-white/60 text-sm space-y-2">
          <li>• <strong>Modalità Manutenzione:</strong> Mostra schermata "Work in Progress" con messaggio casuale AI</li>
          <li>• <strong>Autenticazione Partecipanti:</strong> Quando disattivata, bypassa la schermata login e permette accesso diretto alla landing</li>
          <li>• Le modifiche sono immediate - ricaricare la pagina per vedere gli effetti</li>
        </ul>
      </div>
    </div>
  )
}
