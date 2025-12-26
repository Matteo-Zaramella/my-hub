'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NextImage from 'next/image'
import { createClient } from '@/lib/supabase/client'
import ParticipantLogin from './ParticipantLogin'
import GroupChat from './GroupChat'

// NOTE: MonthlyChallengesCluesSection e ValidateAnswerTab rimossi temporaneamente
// Si sbloccheranno dopo la cerimonia del 25/01/2026

// Tipi per la wishlist
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

const CATEGORIE_LABELS: Record<string, string> = {
  elettrodomestici: 'Elettrodomestici',
  elettronica: 'Elettronica',
  bici: 'Bici',
  integratori: 'Integratori',
  sport: 'Sport',
  vestiti: 'Vestiti',
  altro: 'Altro'
}

// Componente Narghilé Question
function NarghileQuestion({ participantCode }: { participantCode: string }) {
  const [hasAnswered, setHasAnswered] = useState(false)
  const [answer, setAnswer] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkExistingAnswer()
  }, [participantCode])

  async function checkExistingAnswer() {
    const { data, error } = await supabase
      .from('party_survey_responses')
      .select('wants_narghile')
      .eq('participant_code', participantCode)
      .single()

    if (data && !error) {
      setHasAnswered(true)
      setAnswer(data.wants_narghile)
    }
    setIsLoading(false)
  }

  async function handleAnswer(wantsNarghile: boolean) {
    console.log('Saving narghile answer:', participantCode, wantsNarghile)
    const { error } = await supabase
      .from('party_survey_responses')
      .insert({
        participant_code: participantCode,
        wants_narghile: wantsNarghile
      })

    if (error) {
      console.error('Error saving narghile:', error)
    } else {
      console.log('Saved successfully')
      setHasAnswered(true)
      setAnswer(wantsNarghile)
    }
  }

  if (isLoading) {
    return null
  }

  if (hasAnswered) {
    return null
  }

  return (
    <div className="text-center py-6">
      <p className="text-white/70 mb-4">Narghilé?</p>
      <div className="flex justify-center gap-8">
        <button
          onClick={() => handleAnswer(true)}
          className="text-white/60 hover:text-white transition"
        >
          Sì
        </button>
        <button
          onClick={() => handleAnswer(false)}
          className="text-white/60 hover:text-white transition"
        >
          No
        </button>
      </div>
    </div>
  )
}

// Componente Wishlist Section
function WishlistSection() {
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
        .order('categoria', { ascending: true })
        .order('created_at', { ascending: false })

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

  // Raggruppa per categoria
  const itemsByCategory = items.reduce((acc, item) => {
    const cat = item.categoria || 'altro'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {} as Record<string, WishlistItem[]>)

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">🎁 Wishlist</h2>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">🎁 Wishlist</h2>
        <p className="text-white/60 text-center py-8">Nessun prodotto nella wishlist</p>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">🎁 Wishlist</h2>

      <div className="space-y-8">
        {Object.entries(itemsByCategory).map(([categoria, categoryItems]) => (
          <section key={categoria}>
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-purple-300 border-b border-white/10 pb-2">
              {CATEGORIE_LABELS[categoria] || categoria}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition-colors"
                >
                  {/* Immagine */}
                  {item.immagine_url ? (
                    <div className="aspect-square relative bg-black/30">
                      <NextImage
                        src={item.immagine_url}
                        alt={item.nome}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-white/5 flex items-center justify-center">
                      <span className="text-4xl opacity-30">🎁</span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-4">
                    <h4 className="font-medium text-white mb-2 line-clamp-2">
                      {item.nome}
                    </h4>

                    {/* Taglie per vestiti */}
                    {item.categoria === 'vestiti' && item.taglie && (
                      <div className="text-xs text-white/50 mb-3 space-y-0.5">
                        {item.taglie.pantaloni && <p>Pantaloni: {item.taglie.pantaloni}</p>}
                        {item.taglie.maglie && <p>Maglie: {item.taglie.maglie}</p>}
                        {item.taglie.tshirt && <p>T-shirt: {item.taglie.tshirt}</p>}
                      </div>
                    )}

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors text-sm text-purple-200"
                      >
                        Vedi prodotto →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

// Componente sezione privata con countdown
function PrivateSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    // Countdown alla cerimonia 25/01/2026 00:00
    const targetDate = new Date('2026-01-25T00:00:00')

    const updateCountdown = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        🔒 Privato
      </h2>

      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-8 text-center">
        <span className="text-6xl block mb-4">⏳</span>
        <p className="text-xl text-white/90 mb-6">
          Contenuto bloccato
        </p>

        <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              {timeLeft.days}
            </div>
            <div className="text-xs md:text-sm text-white/60 uppercase">Giorni</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              {timeLeft.hours}
            </div>
            <div className="text-xs md:text-sm text-white/60 uppercase">Ore</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              {timeLeft.minutes}
            </div>
            <div className="text-xs md:text-sm text-white/60 uppercase">Minuti</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              {timeLeft.seconds}
            </div>
            <div className="text-xs md:text-sm text-white/60 uppercase">Secondi</div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Participant {
  id: number
  user_id: string
  participant_name: string
  phone_number: string | null
  instagram_handle: string | null
  category: string | null
  participant_code: string
  notes: string | null
  partner_name: string | null
  is_couple: boolean
}

export default function GameAreaWithChat() {
  const router = useRouter()
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'info' | 'chat' | 'wishlist' | 'private'>('info')

  // Countdown alla cerimonia (25/01/2026 00:00)
  const [ceremonyTimeLeft, setCeremonyTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Carica partecipante da localStorage se esiste
  useEffect(() => {
    const stored = localStorage.getItem('game_participant')
    if (stored) {
      try {
        setParticipant(JSON.parse(stored))
      } catch (e) {
        console.error('Error loading participant:', e)
      }
    }
    setIsLoading(false)
  }, [])

  // Countdown effect
  useEffect(() => {
    const targetDate = new Date('2026-01-25T00:00:00')

    const updateCountdown = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        setCeremonyTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setCeremonyTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('game_participant')
    localStorage.removeItem('participantCode')
    localStorage.removeItem('registrationCompleted')
    // Torna alla pagina principale con scelta REGISTRATI/ACCEDI
    router.replace('/')
  }

  // Mostra loading mentre verifica localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    )
  }

  // Se non è loggato, mostra il login
  if (!participant) {
    return <ParticipantLogin onLoginSuccess={setParticipant} />
  }

  // Game Area completa
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 text-white pb-16">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
          {/* Mobile: stack vertically */}
          <div className="flex flex-col gap-2 md:hidden">
            <div className="flex justify-between items-center">
              <p className="text-purple-200 text-sm truncate max-w-[150px]">
                Ciao, {participant.participant_name.split(' ')[0]}!
              </p>
              <div className="flex items-center bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
                <div className="flex gap-0.5 font-mono text-white text-xs">
                  <span>{String(ceremonyTimeLeft.days).padStart(2, '0')}</span>
                  <span>:</span>
                  <span>{String(ceremonyTimeLeft.hours).padStart(2, '0')}</span>
                  <span>:</span>
                  <span>{String(ceremonyTimeLeft.minutes).padStart(2, '0')}</span>
                  <span>:</span>
                  <span>{String(ceremonyTimeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition text-sm"
              >
                Esci
              </button>
            </div>
          </div>

          {/* Desktop: horizontal with centered timer */}
          <div className="hidden md:flex justify-between items-center relative">
            <div className="flex-shrink-0">
              <p className="text-purple-200 text-base">
                Ciao, {participant.participant_name}!
              </p>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center bg-black/30 px-4 py-2 rounded-lg border border-white/10">
                <div className="flex gap-1 font-mono text-white text-base">
                  <span>{String(ceremonyTimeLeft.days).padStart(2, '0')}</span>
                  <span>:</span>
                  <span>{String(ceremonyTimeLeft.hours).padStart(2, '0')}</span>
                  <span>:</span>
                  <span>{String(ceremonyTimeLeft.minutes).padStart(2, '0')}</span>
                  <span>:</span>
                  <span>{String(ceremonyTimeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-base flex-shrink-0"
            >
              Esci
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-black/20 border-b border-white/10">
        <div className="w-full flex justify-center">
          <div className="flex gap-2 md:gap-8">
            {/* Info - informazioni festa */}
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 md:px-6 py-3 font-semibold transition whitespace-nowrap ${
                activeTab === 'info'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              📍 Info
            </button>
            {/* Chat - sempre accessibile */}
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 md:px-6 py-3 font-semibold transition whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              💬 Chat
            </button>
            {/* Wishlist - sempre accessibile */}
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`px-4 md:px-6 py-3 font-semibold transition whitespace-nowrap ${
                activeTab === 'wishlist'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              🎁 Wishlist
            </button>
            {/* Privato - mostra countdown */}
            <button
              onClick={() => setActiveTab('private')}
              className={`px-4 md:px-6 py-3 font-semibold transition whitespace-nowrap ${
                activeTab === 'private'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              🔒 Privato
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">📍 Informazioni Festa</h2>

            {/* Luogo e Orario */}
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-purple-300">Luogo e Orario</h3>
                <div className="space-y-3">
                  <p className="text-white text-lg font-medium">
                    L'Oste di Vino | Enoteca • Ristorante • Bistrot
                  </p>
                  <p className="text-white/70">
                    Via Pelosa, 76 - Selvazzano Dentro (PD)
                  </p>
                  <div className="flex items-center gap-2 text-white/90 mt-4">
                    <span className="text-xl">🕘</span>
                    <span className="font-medium">Dalle 21:30 / 22:00 alle 02:00</span>
                    <span className="text-white/50 text-sm">(chiusura locale)</span>
                  </div>
                  <a
                    href="https://maps.app.goo.gl/qTRtBD2vRR3VLfgQA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition mt-2"
                  >
                    🗺️ Apri in Google Maps
                  </a>
                </div>
              </div>

              {/* Parcheggio */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-yellow-300">⚠️ Parcheggio</h3>
                <p className="text-white/80 mb-4">
                  Il locale dispone di soli <strong className="text-white">3 posti auto</strong>.
                  Si consiglia di parcheggiare nel parcheggio pubblico nelle vicinanze (cerchiato in rosso nella mappa).
                </p>
                <div className="rounded-lg overflow-hidden border border-white/20">
                  <img
                    src="/venue-map.png"
                    alt="Mappa del locale con parcheggio consigliato"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Domanda Narghilé */}
              <NarghileQuestion participantCode={participant.participant_code} />
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
            <div className="h-[calc(100vh-200px)] md:h-[700px] lg:h-[750px] flex flex-col">
              <GroupChat participant={participant} />
            </div>
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && <WishlistSection />}

        {/* Private Tab - Locked with countdown */}
        {activeTab === 'private' && <PrivateSection />}
      </main>

      {/* Footer fisso con codice utente */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/10 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="text-sm text-white/50">
            <p>
              Codice: <span className="font-mono font-bold text-white">{participant.participant_code}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
