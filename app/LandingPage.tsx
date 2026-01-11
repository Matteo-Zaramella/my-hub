'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/game/area')
  }, [router])

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-white/50">Caricamento...</div>
    </div>
  )
}
