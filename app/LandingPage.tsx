'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const IMAGES = [
  { src: '/carousel/photo-02.jpg', w: 960,  h: 1280 },
  { src: '/carousel/photo-03.jpg', w: 1280, h: 853  },
  { src: '/carousel/photo-04.jpg', w: 960,  h: 1280 },
  { src: '/carousel/photo-05.jpg', w: 720,  h: 1280 },
  { src: '/carousel/photo-06.jpg', w: 1280, h: 853  },
  { src: '/carousel/photo-07.jpg', w: 960,  h: 1280 },
  { src: '/carousel/photo-08.jpg', w: 964,  h: 1280 },
  { src: '/carousel/photo-09.jpg', w: 962,  h: 1280 },
  { src: '/carousel/photo-10.jpg', w: 720,  h: 1280 },
  { src: '/carousel/photo-12.jpg', w: 964,  h: 1280 },
  { src: '/carousel/photo-13.jpg', w: 960,  h: 1280 },
  { src: '/carousel/photo-14.jpg', w: 960,  h: 1280 },
  { src: '/carousel/photo-15.jpg', w: 960,  h: 1280 },
  { src: '/carousel/photo-16.jpg', w: 960,  h: 1280 },
  { src: '/carousel/photo-17.jpg', w: 964,  h: 1280 },
  { src: '/carousel/photo-19.jpg', w: 960,  h: 1280 },
  { src: '/carousel/photo-20.jpg', w: 960,  h: 1280 },
]

const CAROUSEL = [...IMAGES, ...IMAGES]

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8" />
    </svg>
  )
}

const SERVICES = [
  {
    key: 'travel',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
      </svg>
    ),
    title: 'Organizzatore di Viaggi',
    desc: 'Pianifica il tuo prossimo viaggio con un assistente intelligente. Itinerari su misura, consigli su trasporti, alloggi e attività — tutto in un unico posto.',
    cta: 'Pianifica un viaggio',
    soon: true,
  },
  {
    key: 'mechanic',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
      </svg>
    ),
    title: 'Consulente Meccanico',
    desc: 'Valuta un\'auto da remoto prima di comprarla. Analisi di annunci, ispezione guidata, stima dei difetti e del valore reale — senza andare dal meccanico.',
    cta: 'Valuta un\'auto',
    soon: true,
  },
  {
    key: 'trainer',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
    title: 'Schede di Allenamento',
    desc: 'Schede personalizzate in base ai tuoi obiettivi, al tuo livello e alle attrezzature disponibili. Struttura, progressione e adattamenti nel tempo.',
    cta: 'Crea la tua scheda',
    soon: true,
  },
  {
    key: 'nutrition',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
    title: 'Piani Alimentari',
    desc: 'Piani alimentari costruiti attorno ai tuoi obiettivi fisici. Macros, distribuzione dei pasti e indicazioni pratiche per supportare l\'allenamento.',
    cta: 'Crea il tuo piano',
    soon: true,
  },
  {
    key: 'gifts',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
    title: 'Selezionatore di Regali',
    desc: 'Trova il regalo giusto per ogni persona e occasione. Inserisci qualche dettaglio su chi riceve e il budget — ricevi idee mirate e originali.',
    cta: 'Trova un regalo',
    soon: true,
  },
  {
    key: 'stylist',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    title: 'Stilista Personale',
    desc: 'Consigli di stile su misura per il tuo guardaroba, il tuo fisico e le tue occasioni. Outfit, abbinamenti e acquisti mirati senza sprechi.',
    cta: 'Migliora il tuo stile',
    soon: true,
  },
  {
    key: 'party',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
      </svg>
    ),
    title: 'Organizzatore di Eventi',
    desc: 'Pianifica ogni dettaglio del tuo evento — compleanno, laurea, cena, o qualsiasi altra occasione. Tema, location, ospiti, musica e tempistiche in un unico posto.',
    cta: 'Organizza un evento',
    soon: true,
  },
]

export default function LandingPage() {
  const [showBar, setShowBar] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'expanding' | 'open' | 'closing'>('idle')
  const [cardRect, setCardRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const [contentVisible, setContentVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onScroll() { setShowBar(window.scrollY > 40) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (phase !== 'idle') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [phase])

  function openZara() {
    if (!cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    setCardRect({ top: r.top, left: r.left, width: r.width, height: r.height })
    setContentVisible(false)
    setPhase('expanding')
    // Next frame: trigger the CSS transition to fullscreen
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhase('open')
        // Show content after expansion completes
        setTimeout(() => setContentVisible(true), 550)
      })
    })
  }

  function closeZara() {
    setContentVisible(false)
    setPhase('closing')
    setTimeout(() => {
      setPhase('idle')
      setCardRect(null)
    }, 550)
  }

  const isOpen = phase === 'open' || phase === 'closing'
  const isExpanding = phase === 'expanding' || phase === 'open'

  // Overlay style: starts at card rect, transitions to fullscreen
  const overlayStyle: React.CSSProperties = (() => {
    const transition = 'top 0.55s cubic-bezier(0.77,0,0.18,1), left 0.55s cubic-bezier(0.77,0,0.18,1), width 0.55s cubic-bezier(0.77,0,0.18,1), height 0.55s cubic-bezier(0.77,0,0.18,1)'

    if (phase === 'expanding' && cardRect) {
      return {
        position: 'fixed',
        top: cardRect.top,
        left: cardRect.left,
        width: cardRect.width,
        height: cardRect.height,
        transition,
        zIndex: 60,
        backgroundColor: 'white',
        overflow: 'hidden',
      }
    }
    if (phase === 'open') {
      return {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        transition,
        zIndex: 60,
        backgroundColor: 'white',
        overflow: 'hidden',
      }
    }
    if (phase === 'closing' && cardRect) {
      return {
        position: 'fixed',
        top: cardRect.top,
        left: cardRect.left,
        width: cardRect.width,
        height: cardRect.height,
        transition,
        zIndex: 60,
        backgroundColor: 'white',
        overflow: 'hidden',
      }
    }
    return { display: 'none' }
  })()

  return (
    <>
      <style>{`
        @keyframes carousel-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .carousel-track {
          animation: carousel-scroll 90s linear infinite;
        }
        @keyframes shimmer {
          0%   { opacity: 0.7; }
          50%  { opacity: 1; }
          100% { opacity: 0.7; }
        }
        .paint-shimmer {
          animation: shimmer 6s ease-in-out infinite;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease forwards; }
      `}</style>

      {/* Fixed full-screen background */}
      <div
        className="fixed inset-0 flex items-center"
        style={{
          backgroundColor: '#163D25',
          transition: 'transform 0.55s cubic-bezier(0.77,0,0.18,1), opacity 0.55s ease',
          transform: isExpanding ? 'scale(0.92)' : 'scale(1)',
          opacity: isExpanding ? 0.5 : 1,
        }}
      >
        {/* Car paint layers */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: [
            'linear-gradient(158deg, transparent 28%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.13) 50%, rgba(255,255,255,0.20) 54%, rgba(255,255,255,0.07) 62%, transparent 74%)',
            'linear-gradient(162deg, transparent 58%, rgba(255,255,255,0.04) 67%, rgba(255,255,255,0.09) 71%, transparent 80%)',
            'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.12) 22%, transparent 42%)',
            'linear-gradient(to top, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.10) 18%, transparent 38%)',
            'linear-gradient(to right, rgba(0,0,0,0.20) 0%, transparent 18%)',
            'linear-gradient(to left, rgba(0,0,0,0.20) 0%, transparent 18%)',
            'radial-gradient(ellipse 70% 40% at 55% 48%, rgba(80,200,110,0.10) 0%, transparent 100%)',
          ].join(', '),
        }} />
        <div className="paint-shimmer absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(152deg, transparent 35%, rgba(255,255,255,0.06) 50%, transparent 65%)',
        }} />

        {/* Scrolling carousel */}
        <div className="carousel-track flex gap-6 items-center w-max px-6">
          {CAROUSEL.map((img, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 overflow-hidden shadow-2xl"
              style={{
                height: '78vh',
                width: `calc(78vh * ${img.w / img.h})`,
                border: '10px solid white',
                outline: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <Image src={img.src} alt="" fill className="object-cover" priority={i < 3} />
            </div>
          ))}
        </div>

        {/* Name card */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div
            ref={cardRef}
            onClick={openZara}
            className="bg-white px-10 py-5 cursor-pointer select-none"
            style={{
              boxShadow: '0 2px 32px rgba(0,0,0,0.18)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              // Hide the real card when overlay is active
              opacity: phase !== 'idle' ? 0 : 1,
            }}
            onMouseEnter={e => {
              if (phase !== 'idle') return
              ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1.04)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 48px rgba(0,0,0,0.28)'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 32px rgba(0,0,0,0.18)'
            }}
          >
            <h1
              className="text-black text-2xl md:text-3xl italic tracking-wide"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Zara
            </h1>
          </div>
        </div>
      </div>

      {/* Scroll area */}
      <div style={{ height: '250vh' }} />

      {/* Slide-down menu bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 bg-white transition-transform duration-500 ease-out"
        style={{
          transform: showBar ? 'translateY(0)' : 'translateY(-100%)',
          height: '56px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.12)',
        }}
      >
        <div className="h-full flex items-center justify-end px-8">
          <Link
            href="/private/login"
            className="text-black/40 hover:text-black transition-colors duration-200"
            title="Area privata"
          >
            <PersonIcon />
          </Link>
        </div>
      </div>

      {/* Wormhole overlay */}
      <div style={overlayStyle}>
        {/* Content — only visible when fully open */}
        {isOpen && (
          <div
            className="w-full h-full overflow-y-auto"
            style={{
              opacity: contentVisible ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            {/* Close button */}
            <button
              onClick={closeZara}
              className="fixed top-6 right-8 z-10 text-black/30 hover:text-black transition-colors text-3xl leading-none"
              style={{ fontFamily: 'var(--font-playfair)', lineHeight: 1 }}
              aria-label="Chiudi"
            >
              ×
            </button>

            <div className="max-w-3xl mx-auto px-8 py-20">
              {/* Header */}
              <div className={contentVisible ? 'fade-up' : 'opacity-0'} style={{ animationDelay: '0ms' }}>
                <h2
                  className="text-4xl md:text-5xl italic text-black mb-3"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Zara
                </h2>
                <p className="text-black/40 text-base mb-16 max-w-md">
                  Servizi intelligenti per semplificarti la vita — viaggi, auto, e altro in arrivo.
                </p>
              </div>

              {/* Service cards */}
              <div className="space-y-6">
                {SERVICES.map((s, i) => (
                  <div
                    key={s.key}
                    className={contentVisible ? 'fade-up' : 'opacity-0'}
                    style={{ animationDelay: `${80 + i * 90}ms` }}
                  >
                    <div
                      className="border border-black/10 p-8 group cursor-pointer hover:border-black/30 transition-all duration-200"
                      style={{ backgroundColor: '#fafafa' }}
                    >
                      <div className="flex items-start gap-5">
                        <div className="text-black/40 group-hover:text-black transition-colors duration-200 mt-0.5 flex-shrink-0">
                          {s.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl text-black font-medium">{s.title}</h3>
                            {s.soon && (
                              <span className="text-xs uppercase tracking-widest text-black/25 border border-black/15 px-2 py-0.5">
                                in arrivo
                              </span>
                            )}
                          </div>
                          <p className="text-black/50 text-sm leading-relaxed mb-5">{s.desc}</p>
                          <button
                            disabled={s.soon}
                            className="text-sm text-black/40 border border-black/15 px-4 py-2 hover:bg-black hover:text-white hover:border-black transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            {s.cta}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
