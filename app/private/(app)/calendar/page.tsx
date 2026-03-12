import { redirect } from 'next/navigation'
import { getSessionFromCookies } from '@/lib/auth'
import CalendarClient from './CalendarClient'

export default async function CalendarPage() {
  const session = await getSessionFromCookies()

  if (!session) redirect('/private/login')
  if (session.role === 'limited') redirect('/private/wishlist')

  return <CalendarClient />
}
