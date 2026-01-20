'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface WishlistItem {
  id: number
  nome: string
  descrizione: string | null
  link: string | null
  prezzo: number | null
  immagine_url: string | null
  pubblico: boolean
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
  const upper = lower + 10
  return `€${lower} - €${upper}`
}

function getPriceRangeOrder(price: number | null): number {
  if (price === null) return -1
  return Math.floor(price / 10)
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadPublicItems()
  }, [])

  async function loadPublicItems() {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('id, nome, descrizione, link, prezzo, immagine_url, pubblico, categoria, taglie')
        .eq('pubblico', true)
        .order('prezzo', { ascending: true, nullsFirst: false })

      if (error) {
        console.error('Error loading wishlist:', error)
        setItems([])
      } else {
        setItems(data || [])
      }
      setLoading(false)
    } catch (err) {
      console.error('Exception loading wishlist:', err)
      setItems([])
      setLoading(false)
    }
  }

  const itemsByPriceRange = items.reduce((acc, item) => {
    const range = getPriceRange(item.prezzo)
    if (!acc[range]) acc[range] = []
    acc[range].push(item)
    return acc
  }, {} as Record<string, WishlistItem[]>)

  const sortedPriceRanges = Object.entries(itemsByPriceRange).sort((a, b) => {
    const priceA = a[1][0]?.prezzo ?? 9999
    const priceB = b[1][0]?.prezzo ?? 9999
    return getPriceRangeOrder(priceA) - getPriceRangeOrder(priceB)
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40">Caricamento...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40">Nessun prodotto nella wishlist</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="w-full p-4">
        <Link href="/" className="text-white/40 hover:text-white transition" title="Home">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
        </Link>
      </header>
      <div className="px-4 md:px-8 lg:px-16 pb-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-2xl font-light text-center">Wishlist</h1>

        <div className="space-y-8">
          {sortedPriceRanges.map(([priceRange, rangeItems]) => (
            <section key={priceRange}>
              <h2 className="text-sm text-white/60 mb-4 border-b border-white/10 pb-2">
                {priceRange}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {rangeItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-white/20 p-4 flex flex-col"
                  >
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

                    <h3 className="text-white text-sm font-medium mb-1">{item.nome}</h3>

                    {item.descrizione && (
                      <p className="text-white/50 text-xs mb-2">{item.descrizione}</p>
                    )}

                    {item.prezzo && (
                      <p className="text-white/70 text-sm mb-2">€{item.prezzo.toFixed(2)}</p>
                    )}

                    {item.taglie && Object.keys(item.taglie).length > 0 && (
                      <div className="text-xs text-white/40 mb-2">
                        {item.taglie.pantaloni && <span>Pantaloni: {item.taglie.pantaloni}</span>}
                        {item.taglie.maglie && <span className="ml-2">Maglie: {item.taglie.maglie}</span>}
                        {item.taglie.tshirt && <span className="ml-2">T-shirt: {item.taglie.tshirt}</span>}
                      </div>
                    )}

                    {item.link && item.prezzo && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto text-white/40 hover:text-white text-xs transition"
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
        </div>
      </div>
    </div>
  )
}
