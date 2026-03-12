'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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

export default function LandingPage() {
  const [showBar, setShowBar] = useState(false)

  useEffect(() => {
    function onScroll() {
      setShowBar(window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
      `}</style>

      {/* Fixed full-screen background */}
      <div className="fixed inset-0 flex items-center" style={{ backgroundColor: '#163D25' }}>

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
              <Image
                src={img.src}
                alt=""
                fill
                className="object-cover"
                priority={i < 3}
              />
            </div>
          ))}
        </div>

        {/* Name card */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-white px-10 py-5" style={{ boxShadow: '0 2px 32px rgba(0,0,0,0.18)' }}>
            <h1
              className="text-black text-2xl md:text-3xl italic tracking-wide"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Matteo Zaramella
            </h1>
          </div>
        </div>
      </div>

      {/* Scroll area — gives height so the page is scrollable */}
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
    </>
  )
}
