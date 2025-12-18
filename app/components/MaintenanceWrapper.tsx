'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePathname } from 'next/navigation'
import MaintenanceScreen from './MaintenanceScreen'

export default function MaintenanceWrapper({ children }: { children: React.ReactNode }) {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    checkMaintenanceMode()
  }, [])

  async function checkMaintenanceMode() {
    try {
      const { data, error } = await supabase
        .from('game_settings')
        .select('setting_value')
        .eq('setting_key', 'maintenance_mode')
        .single()

      if (!error && data) {
        setMaintenanceMode(data.setting_value ?? false)
      }
    } catch (error) {
      console.error('Error checking maintenance mode:', error)
    } finally {
      setLoading(false)
    }
  }

  // Allow admin to access dashboard, game, and login even during maintenance
  const isAdminRoute = pathname?.startsWith('/dashboard') ||
                       pathname?.startsWith('/game') ||
                       pathname?.startsWith('/login') ||
                       pathname?.startsWith('/signup')

  if (loading) {
    return null // Or a loading spinner
  }

  if (maintenanceMode && !isAdminRoute) {
    return <MaintenanceScreen />
  }

  return <>{children}</>
}
