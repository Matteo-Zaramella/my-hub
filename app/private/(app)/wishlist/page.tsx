import { getSessionFromCookies } from '@/lib/auth'
import { redirect } from 'next/navigation'
import WishlistClient from './WishlistClient'

export default async function WishlistPage() {
  const session = await getSessionFromCookies()
  if (!session) redirect('/private/login')

  return <WishlistClient />
}
