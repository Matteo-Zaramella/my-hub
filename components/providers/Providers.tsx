'use client'

import { ReactNode } from 'react'
import { SamanthaProvider } from '@/contexts/SamanthaContext'
import { SamanthaFooter } from '@/components/ui/SamanthaMessage'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SamanthaProvider defaultTypingSpeed={35}>
      {children}
      <SamanthaFooter />
    </SamanthaProvider>
  )
}
