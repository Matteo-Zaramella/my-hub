'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

const sections = [
  {
    name: 'Alimentazione',
    href: '/private/dashboard/alimentazione',
    description: 'Piano alimentare, macros, pasti',
    icon: '🍽️'
  },
  {
    name: 'Palestra',
    href: '/private/dashboard/palestra',
    description: 'Scheda allenamento, progressi, esercizi',
    icon: '💪'
  }
]

export default function PrivateDashboard() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/private/logout', { method: 'POST' })
    router.push('/private')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-light">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-white/40 hover:text-white text-sm transition"
        >
          Esci
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Link
            key={section.name}
            href={section.href}
            className="border border-white/20 p-6 hover:border-white/40 transition group"
          >
            <div className="text-3xl mb-3">{section.icon}</div>
            <h2 className="text-lg font-medium mb-1 group-hover:text-white transition">
              {section.name}
            </h2>
            <p className="text-white/50 text-sm">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
