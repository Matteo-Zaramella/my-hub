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
        .select('maintenance_mode')
        .eq('id', 1)
        .single()

      if (!error && data) {
        setMaintenanceMode(data.maintenance_mode ?? false)
      }
    } catch (error) {
      console.error('Error checking maintenance mode:', error)
    } finally {
      setLoading(false)
    }
  }

  // Allow admin to access dashboard even during maintenance
  const isAdminRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/game')

  if (loading) {
    return null // Or a loading spinner
  }

  if (maintenanceMode && !isAdminRoute) {
    return <MaintenanceScreen />
  }

  return <>{children}</>
}
