import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PasswordSuccess from './PasswordSuccess'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Area Riservata",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function GamePage({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>
}) {
  const supabase = await createClient()

  // Check if user is authenticated (optional - game can be public with password)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Verify password (for now, we'll set a temporary password)
  // TODO: Store the game password in database or environment variable
  const GAME_PASSWORD = 'EVOLUZIONE' // This will be revealed at the ceremony

  const params = await searchParams
  const password = params.password

  if (!password) {
    // Redirect back to home if no password provided
    redirect('/')
  }

  // If password is correct, show success page
  if (password === GAME_PASSWORD) {
    return <PasswordSuccess />
  }

  // If password is wrong, redirect back to home
  redirect('/')
}
