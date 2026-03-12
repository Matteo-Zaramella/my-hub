import { redirect } from 'next/navigation'
import { getSessionFromCookies } from '@/lib/auth'
import Link from 'next/link'

export default async function PrivateDashboard() {
  const session = await getSessionFromCookies()
  if (!session) redirect('/private/login')
  if (session.role === 'limited') redirect('/private/wishlist')

  const isAdmin = session.role === 'admin'

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-white/30 text-sm mb-12">
        Ciao, {session.username}.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/private/wishlist"
          className="border border-white/10 p-6 hover:border-white/30 transition-colors group"
        >
          <h2 className="text-sm font-medium mb-1 group-hover:text-white text-white/70">Wishlist</h2>
          <p className="text-xs text-white/30">Lista desideri</p>
        </Link>

        <Link
          href="/private/calendar"
          className="border border-white/10 p-6 hover:border-white/30 transition-colors group"
        >
          <h2 className="text-sm font-medium mb-1 group-hover:text-white text-white/70">Calendario</h2>
          <p className="text-xs text-white/30">Impegni in tempo reale</p>
        </Link>

        {isAdmin && (
          <Link
            href="/private/admin"
            className="border border-white/10 p-6 hover:border-white/30 transition-colors group sm:col-span-2"
          >
            <h2 className="text-sm font-medium mb-1 group-hover:text-white text-white/70">Admin</h2>
            <p className="text-xs text-white/30">Gestione utenti e contenuti</p>
          </Link>
        )}
      </div>
    </div>
  )
}
