import { redirect } from 'next/navigation'
import { getSessionFromCookies } from '@/lib/auth'
import Link from 'next/link'
import LogoutButton from '@/components/private/LogoutButton'

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionFromCookies()
  if (!session) redirect('/private/login')

  const isAdminOrViewer = session.role === 'admin' || session.role === 'viewer'

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Sticky header */}
      <nav className="sticky top-0 z-50 bg-black border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/private" className="text-xs tracking-widest uppercase text-white/60 hover:text-white transition-colors">
            MZ
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/private/wishlist" className="text-xs tracking-wide text-white/40 hover:text-white transition-colors">
              Wishlist
            </Link>
            {isAdminOrViewer && (
              <Link href="/private/calendar" className="text-xs tracking-wide text-white/40 hover:text-white transition-colors">
                Calendario
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/20">{session.username}</span>
          <LogoutButton />
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 px-6 py-8 pb-24">
        {children}
      </main>

      {/* Samantha footer bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white/10 px-6 py-3 flex items-center gap-3">
        <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white/40">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 19c0-3.866 3.134-7 7-7s7 3.134 7 7" strokeWidth="0" />
          </svg>
        </div>
        <div className="flex-1 text-xs text-white/20 italic" style={{ fontFamily: 'var(--font-playfair)' }}>
          {/* Samantha */}
        </div>
      </div>

    </div>
  )
}
