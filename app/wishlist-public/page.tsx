'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import NextImage from 'next/image'

interface WishlistItem {
  id: number
  nome: string
  descrizione: string | null
  link: string | null
  prezzo: number | null
  immagine_url: string | null
  pubblico: boolean
}

export default function PublicWishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dominantColors, setDominantColors] = useState<Record<number, string>>({})
  const supabase = createClient()

  useEffect(() => {
    loadPublicItems()
  }, [])

  async function loadPublicItems() {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('id, nome, descrizione, link, prezzo, immagine_url, pubblico')
      .eq('pubblico', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading public wishlist:', error)
      setLoading(false)
      return
    }

    if (data) {
      setItems(data)
      // Extract dominant colors for each item with image
      data.forEach(item => {
        if (item.immagine_url) {
          extractDominantColor(item.id, item.immagine_url)
        }
      })
    }
    setLoading(false)
  }

  function extractDominantColor(itemId: number, imageUrl: string) {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = imageUrl

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const pixels = imageData.data
        let r = 0, g = 0, b = 0, count = 0

        // Sample pixels (ogni 10 pixel per performance)
        for (let i = 0; i < pixels.length; i += 40) {
          r += pixels[i]
          g += pixels[i + 1]
          b += pixels[i + 2]
          count++
        }

        r = Math.floor(r / count)
        g = Math.floor(g / count)
        b = Math.floor(b / count)

        // Scurisci il colore per lo sfondo (più scuro del 60%)
        const darkenFactor = 0.4
        r = Math.floor(r * darkenFactor)
        g = Math.floor(g * darkenFactor)
        b = Math.floor(b * darkenFactor)

        const color = `rgb(${r}, ${g}, ${b})`
        setDominantColors(prev => ({ ...prev, [itemId]: color }))
      } catch (error) {
        console.error('Error extracting color:', error)
        // Fallback al colore di default
        setDominantColors(prev => ({ ...prev, [itemId]: 'rgb(13, 13, 13)' }))
      }
    }

    img.onerror = () => {
      // Fallback al colore di default
      setDominantColors(prev => ({ ...prev, [itemId]: 'rgb(13, 13, 13)' }))
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header minimalista */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-light tracking-wide">Wishlist</h1>
            <Link
              href="/"
              className="w-10 h-10 sm:w-12 sm:h-12 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/50 text-lg">Nessun prodotto nella wishlist</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="group border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition-colors"
              >
                {/* Immagine */}
                {item.immagine_url ? (
                  <div
                    className="aspect-square overflow-hidden flex items-center justify-center transition-colors duration-500 relative"
                    style={{
                      backgroundColor: dominantColors[item.id] || 'rgb(13, 13, 13)'
                    }}
                  >
                    <NextImage
                      src={item.immagine_url}
                      alt={item.nome}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-white/5 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                {/* Info */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-light mb-2 line-clamp-2">
                    {item.nome}
                  </h3>

                  {item.descrizione && (
                    <p className="text-white/60 text-sm mb-4 line-clamp-3">
                      {item.descrizione}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    {item.prezzo && (
                      <span className="text-white/80 font-light">
                        €{item.prezzo.toFixed(2)}
                      </span>
                    )}

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto px-4 py-2 border border-white/20 rounded hover:bg-white hover:text-black transition-colors text-sm"
                      >
                        Vedi
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer minimalista */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-white/40 text-sm">
          <p>My Hub · Wishlist Pubblica</p>
        </div>
      </footer>
    </div>
  )
}
