'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface WishlistItem {
  id: number
  nome: string
  descrizione: string | null
  link: string | null
  prezzo: number | null
  immagine_url: string | null
  categoria: string
  taglie: {
    pantaloni?: string
    maglie?: string
    tshirt?: string
  } | null
}

function getPriceRange(price: number | null): string {
  if (price === null) return 'Senza prezzo fisso'
  const lower = Math.floor(price / 10) * 10
  return `€${lower} - €${lower + 10}`
}

function getPriceRangeOrder(price: number | null): number {
  if (price === null) return 9999
  return Math.floor(price / 10)
}

export default function WishlistClient() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/private/wishlist')
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/30 text-sm">Caricamento...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/30 text-sm">Nessun articolo nella wishlist</p>
      </div>
    )
  }

  const byRange = items.reduce((acc, item) => {
    const range = getPriceRange(item.prezzo)
    if (!acc[range]) acc[range] = []
    acc[range].push(item)
    return acc
  }, {} as Record<string, WishlistItem[]>)

  const sortedRanges = Object.entries(byRange).sort(
    (a, b) => getPriceRangeOrder(a[1][0]?.prezzo ?? null) - getPriceRangeOrder(b[1][0]?.prezzo ?? null)
  )

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <h1 className="text-lg font-light tracking-wide">Wishlist</h1>

      {sortedRanges.map(([range, rangeItems]) => (
        <section key={range}>
          <h2 className="text-xs text-white/40 mb-4 border-b border-white/10 pb-2 tracking-widest uppercase">
            {range}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rangeItems.map(item => (
              <div key={item.id} className="border border-white/10 p-4 flex flex-col hover:border-white/20 transition-colors">
                {item.immagine_url && (
                  <div className="relative w-full h-48 mb-3">
                    <Image
                      src={item.immagine_url}
                      alt={item.nome}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                )}
                <h3 className="text-sm font-medium mb-1">{item.nome}</h3>
                {item.descrizione && (
                  <p className="text-white/40 text-xs mb-2">{item.descrizione}</p>
                )}
                {item.prezzo && (
                  <p className="text-white/60 text-sm mb-2">€{item.prezzo.toFixed(2)}</p>
                )}
                {item.taglie && Object.keys(item.taglie).length > 0 && (
                  <div className="text-xs text-white/30 mb-2 space-x-2">
                    {item.taglie.pantaloni && <span>Pantaloni: {item.taglie.pantaloni}</span>}
                    {item.taglie.maglie && <span>Maglie: {item.taglie.maglie}</span>}
                    {item.taglie.tshirt && <span>T-shirt: {item.taglie.tshirt}</span>}
                  </div>
                )}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto text-white/30 hover:text-white/70 text-xs transition-colors"
                  >
                    Vedi prodotto →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
