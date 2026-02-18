'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col">
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
