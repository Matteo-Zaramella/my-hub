'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Header con icona area privata */}
      <header className="w-full p-4 flex justify-end">
        <Link
          href="/private"
          className="text-white/30 hover:text-white/60 transition"
          title="Area Privata"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </header>

      {/* Messaggio di chiusura */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-lg w-full">
          <h1 className="text-2xl font-light text-white mb-8">
            A Tutto Reality: La Rivoluzione
          </h1>

          <div className="space-y-4 text-white/70 text-sm leading-relaxed">
            <p>
              Ho deciso di chiudere il gioco.
            </p>
            <p>
              Non riesco a starci dietro come avrei voluto, e preferisco essere
              onesto piuttosto che portarlo avanti a meta.
            </p>
            <p>
              Mi dispiace davvero, soprattutto per chi ci teneva.
            </p>
            <p>
              Grazie a tutti per aver partecipato alla cerimonia di apertura
              e per l&apos;entusiasmo.
            </p>
          </div>

          <p className="mt-12 text-white/30 text-xs">
            Matteo
          </p>

          <Link
            href="/wishlist"
            className="block mt-8 text-white/40 hover:text-white/60 text-sm transition"
          >
            Wishlist
          </Link>
        </div>
      </main>
    </div>
  )
}
