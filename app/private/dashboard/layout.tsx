import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const auth = cookieStore.get('private_auth')

  if (!auth || auth.value !== 'authenticated') {
    redirect('/private')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/private/dashboard" className="text-lg font-light">
            Area Privata
          </Link>
          <nav className="flex gap-6">
            <Link href="/private/dashboard/alimentazione" className="text-white/60 hover:text-white transition">
              Alimentazione
            </Link>
            <Link href="/private/dashboard/palestra" className="text-white/60 hover:text-white transition">
              Palestra
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
