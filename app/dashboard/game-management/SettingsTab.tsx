'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SettingsTab() {
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [registrationEnabled, setRegistrationEnabled] = useState(true)
  const [wishlistEnabled, setWishlistEnabled] = useState(true)
  const [passwordInputEnabled, setPasswordInputEnabled] = useState(false)
  const [minigameButtonEnabled, setMinigameButtonEnabled] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('game_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['registration_button_enabled', 'wishlist_button_enabled', 'password_input_enabled', 'minigame_button_enabled'])

      if (error) throw error

      if (data) {
        data.forEach(setting => {
          if (setting.setting_key === 'registration_button_enabled') {
            setRegistrationEnabled(setting.setting_value ?? true)
          }
          if (setting.setting_key === 'wishlist_button_enabled') {
            setWishlistEnabled(setting.setting_value ?? true)
          }
          if (setting.setting_key === 'password_input_enabled') {
            setPasswordInputEnabled(setting.setting_value ?? false)
          }
          if (setting.setting_key === 'minigame_button_enabled') {
            setMinigameButtonEnabled(setting.setting_value ?? false)
          }
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (field: string, value: boolean) => {
    setUpdating(true)
    try {
      const { data, error } = await supabase
        .from('game_settings')
        .update({ setting_value: value })
        .eq('setting_key', field)
        .select()

      if (error) throw error

      // Aggiorna lo stato locale
      if (field === 'registration_button_enabled') setRegistrationEnabled(value)
      if (field === 'wishlist_button_enabled') setWishlistEnabled(value)
      if (field === 'password_input_enabled') setPasswordInputEnabled(value)
      if (field === 'minigame_button_enabled') setMinigameButtonEnabled(value)
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
        <h2 className="text-2xl font-bold text-white mb-2">⚙️ Controlli Landing Page</h2>
        <p className="text-white/60">
          Attiva o disattiva i pulsanti numerati sulla landing page
        </p>
      </div>

      {/* Toggle Controls */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
        {/* Wishlist Toggle */}
        <div className="flex items-center justify-between py-4 border-b border-white/10">
          <div>
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              🎁 Pulsante Wishlist (Numero 1)
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Posizione: Primo cerchio in alto a sinistra (index 0)
            </p>
            <p className="text-white/40 text-xs mt-1">
              Quando attivo: mostra numero "1" bianco su sfondo nero
            </p>
          </div>
          <button
            onClick={() => updateSetting('wishlist_button_enabled', !wishlistEnabled)}
            disabled={updating}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              wishlistEnabled ? 'bg-green-600' : 'bg-gray-600'
            } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                wishlistEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Registration Toggle */}
        <div className="flex items-center justify-between py-4 border-b border-white/10">
          <div>
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              📝 Pulsante Registrazione (Numero 2)
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Posizione: Secondo cerchio in alto a sinistra (index 1)
            </p>
            <p className="text-white/40 text-xs mt-1">
              Quando attivo: mostra numero "2" bianco su sfondo nero
            </p>
          </div>
          <button
            onClick={() => updateSetting('registration_button_enabled', !registrationEnabled)}
            disabled={updating}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              registrationEnabled ? 'bg-green-600' : 'bg-gray-600'
            } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                registrationEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Minigame Button Toggle */}
        <div className="flex items-center justify-between py-4 border-b border-white/10">
          <div>
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              🏎️ Saetta McQueen - Mini-giochi (Posizione 95)
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Posizione: Index 94 (cerchio 95)
            </p>
            <p className="text-white/40 text-xs mt-1">
              Il cerchio rimane SEMPRE invisibile. Toggle controlla solo se è cliccabile.
            </p>
          </div>
          <button
            onClick={() => updateSetting('minigame_button_enabled', !minigameButtonEnabled)}
            disabled={updating}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              minigameButtonEnabled ? 'bg-green-600' : 'bg-gray-600'
            } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                minigameButtonEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Password Input Toggle */}
        <div className="flex items-center justify-between py-4">
          <div>
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              🔐 Accesso Game Area (Posizione 99)
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Posizione: Ultimo cerchio in basso a destra (index 99)
            </p>
            <p className="text-white/40 text-xs mt-1">
              Abilita l'input password per accedere all'area di gioco
            </p>
          </div>
          <button
            onClick={() => updateSetting('password_input_enabled', !passwordInputEnabled)}
            disabled={updating}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              passwordInputEnabled ? 'bg-green-600' : 'bg-gray-600'
            } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                passwordInputEnabled ? 'translate-x-7' : 'translate-x-1'
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
          <li>• I numeri appaiono sui cerchi solo quando il pulsante è attivo</li>
          <li>• Numero con sfondo nero e testo bianco</li>
          <li>• Quando disattivato, il cerchio appare nero come gli altri</li>
          <li>• Le modifiche sono immediate sulla landing page</li>
        </ul>
      </div>

      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
        <h3 className="text-yellow-400 font-semibold mb-2">⚠️ Nota Importante</h3>
        <p className="text-white/60 text-sm">
          Il cerchio 95 (Saetta McQueen) rimane sempre invisibile. Attiva il toggle dopo la cerimonia di apertura (gennaio 2026) per renderlo cliccabile. I partecipanti dovranno trovare la sua posizione tramite gli indizi nelle Instagram Stories.
        </p>
      </div>
    </div>
  )
}
