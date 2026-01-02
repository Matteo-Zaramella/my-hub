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
      <div className="text-center py-12">
        <p className="text-white/40">Caricamento...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/40">Nessun prodotto nella wishlist</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-light text-center">Wishlist</h2>

      <div className="space-y-8">
        {Object.entries(itemsByCategory).map(([categoria, categoryItems]) => (
          <section key={categoria}>
            <h3 className="text-sm text-white/60 mb-4 border-b border-white/10 pb-2">
              {CATEGORIE_LABELS[categoria] || categoria}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-white/20 overflow-hidden hover:border-white/40 transition-colors"
                >
                  {/* Immagine */}
                  {item.immagine_url ? (
                    <div className="aspect-square relative bg-black">
                      <NextImage
                        src={item.immagine_url}
                        alt={item.nome}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-contain opacity-80"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-white/5 flex items-center justify-center">
                      <span className="text-2xl opacity-20">?</span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-4 border-t border-white/10">
                    <h4 className="text-white/80 text-sm mb-2 line-clamp-2">
                      {item.nome}
                    </h4>

                    {/* Taglie per vestiti */}
                    {item.categoria === 'vestiti' && item.taglie && (
                      <div className="text-xs text-white/40 mb-3 space-y-0.5">
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
                        className="text-white/40 hover:text-white text-xs underline transition"
                      >
                        Vedi prodotto
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
    <div className="space-y-8">
      <h2 className="text-xl font-light text-center">Privato</h2>

      <div className="text-center py-8">
        <p className="text-white/40 mb-8">Contenuto bloccato</p>

        <div className="flex justify-center gap-8 font-mono">
          <div>
            <div className="text-2xl md:text-3xl text-white">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-xs text-white/40 mt-1">giorni</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl text-white">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-xs text-white/40 mt-1">ore</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl text-white">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-xs text-white/40 mt-1">min</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl text-white">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-xs text-white/40 mt-1">sec</div>
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60">Caricamento...</div>
      </div>
    )
  }

  // Se non è loggato, mostra il login
  if (!participant) {
    return <ParticipantLogin onLoginSuccess={setParticipant} />
  }

  // Game Area completa
  return (
    <div className="min-h-screen bg-black text-white pb-12">
      {/* Header */}
      <header className="border-b border-white/20">
        <div className="w-full px-4 py-3">
          {/* Mobile: stack vertically */}
          <div className="flex flex-col gap-2 md:hidden">
            <div className="flex justify-between items-center">
              <p className="text-white/60 text-sm truncate max-w-[150px]">
                Ciao, {participant.participant_name.split(' ')[0]}!
              </p>
              <div className="font-mono text-white text-xs">
                {String(ceremonyTimeLeft.days).padStart(2, '0')} : {String(ceremonyTimeLeft.hours).padStart(2, '0')} : {String(ceremonyTimeLeft.minutes).padStart(2, '0')} : {String(ceremonyTimeLeft.seconds).padStart(2, '0')}
              </div>
              <button
                onClick={handleLogout}
                className="text-white/40 hover:text-white transition text-sm"
              >
                Esci
              </button>
            </div>
          </div>

          {/* Desktop: horizontal with centered timer */}
          <div className="hidden md:flex justify-between items-center relative">
            <div className="flex-shrink-0">
              <p className="text-white/60">
                Ciao, {participant.participant_name}!
              </p>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="font-mono text-white">
                {String(ceremonyTimeLeft.days).padStart(2, '0')} : {String(ceremonyTimeLeft.hours).padStart(2, '0')} : {String(ceremonyTimeLeft.minutes).padStart(2, '0')} : {String(ceremonyTimeLeft.seconds).padStart(2, '0')}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-white/40 hover:text-white transition flex-shrink-0"
            >
              Esci
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-white/20">
        <div className="w-full flex justify-center">
          <div className="flex gap-6 md:gap-12">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-3 transition whitespace-nowrap ${
                activeTab === 'info'
                  ? 'text-white border-b border-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Info
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-3 transition whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'text-white border-b border-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`py-3 transition whitespace-nowrap ${
                activeTab === 'wishlist'
                  ? 'text-white border-b border-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Wishlist
            </button>
            <button
              onClick={() => setActiveTab('private')}
              className={`py-3 transition whitespace-nowrap ${
                activeTab === 'private'
                  ? 'text-white border-b border-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Privato
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 md:px-8 lg:px-16 py-8">
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-8">
            <h2 className="text-xl font-light text-center mb-8">Informazioni Festa</h2>

            {/* Luogo e Orario */}
            <div className="space-y-4">
              <p className="text-white font-medium">
                L'Oste di Vino | Enoteca • Ristorante • Bistrot
              </p>
              <p className="text-white/60">
                Via Pelosa, 76 - Selvazzano Dentro (PD)
              </p>
              <p className="text-white/60">
                24 Gennaio 2026 - Dalle 21:30 / 22:00 alle 02:00
              </p>
              <div className="flex gap-4 mt-2">
                <a
                  href="https://maps.app.goo.gl/qTRtBD2vRR3VLfgQA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition"
                  title="Google Maps"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </a>
                <a
                  href="https://chat.whatsapp.com/J0G6N7owQWcBtuuhcTpCo6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition"
                  title="Gruppo WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <p className="text-white/60 mb-4">
                Il locale dispone di soli 3 posti auto.
                Parcheggiare nel parcheggio pubblico nelle vicinanze.
              </p>
              <div className="border border-white/20">
                <img
                  src="/venue-map.png"
                  alt="Mappa del locale con parcheggio consigliato"
                  className="w-full h-auto opacity-80"
                />
              </div>
            </div>

            {/* Domanda Narghilé */}
            <NarghileQuestion participantCode={participant.participant_code} />
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="border border-white/20 overflow-hidden">
            <div className="h-[calc(100vh-180px)] flex flex-col">
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
      <footer className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/20 z-40">
        <div className="w-full px-4 py-2">
          <p className="text-xs text-white/40">
            Codice: <span className="font-mono text-white/60">{participant.participant_code}</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
