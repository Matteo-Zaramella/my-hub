'use client'

import { useState, useEffect, useRef } from 'react'

interface CalEvent {
  id: string | null | undefined
  title: string
  start: string
  end: string
  allDay: boolean
  color: string
  calendarName: string
}

interface CalendarData {
  events: CalEvent[]
  now: string
}

// ── helpers ───────────────────────────────────────────────────────────────────

function parseDate(s: string) { return new Date(s) }

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function minutesFromMidnight(d: Date) {
  return d.getHours() * 60 + d.getMinutes()
}

const DAYS_IT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
const MONTHS_IT = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']

function getWeekDays(now: Date): Date[] {
  const day = now.getDay()
  const diffToMon = day === 0 ? -6 : 1 - day
  const mon = new Date(now)
  mon.setDate(now.getDate() + diffToMon)
  mon.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon)
    d.setDate(mon.getDate() + i)
    return d
  })
}

function getMonthDays(now: Date): (Date | null)[] {
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

// ── CurrentActivity ───────────────────────────────────────────────────────────

function CurrentActivity({ events, now }: { events: CalEvent[], now: Date }) {
  const current = events.find(e => {
    if (e.allDay) return false
    const s = parseDate(e.start)
    const en = parseDate(e.end)
    return s <= now && now < en
  })

  const upcoming = events
    .filter(e => !e.allDay && parseDate(e.start) > now)
    .sort((a, b) => parseDate(a.start).getTime() - parseDate(b.start).getTime())
    .slice(0, 3)

  return (
    <div className="mb-10">
      {current ? (
        <div
          className="border p-8 mb-6"
          style={{ borderColor: current.color + '66', backgroundColor: current.color + '11' }}
        >
          <p className="text-sm uppercase tracking-widest mb-3" style={{ color: current.color }}>
            In corso ora · {current.calendarName}
          </p>
          <h2 className="text-3xl font-light mb-4">{current.title}</h2>
          <div className="flex gap-6 text-white/40 text-base">
            <span>{formatTime(parseDate(current.start))} → {formatTime(parseDate(current.end))}</span>
            <span>{formatDuration(parseDate(current.start), parseDate(current.end), now)}</span>
          </div>
        </div>
      ) : (
        <div className="border border-white/10 p-8 mb-6">
          <p className="text-sm uppercase tracking-widest text-white/30 mb-3">Nessuna attività in corso</p>
          <h2 className="text-3xl font-light text-white/20">—</h2>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-white/30 mb-3">Prossime attività</p>
          {upcoming.map((e, i) => (
            <div key={i} className="flex items-center gap-4 text-base py-2 border-b border-white/5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
              <span className="text-white/50 w-36 flex-shrink-0">{formatDateTime(parseDate(e.start))}</span>
              <span className="text-white/80">{e.title}</span>
              <span className="text-white/30 text-sm ml-auto">{e.calendarName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
}

function formatDateTime(d: Date) {
  return d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' }) +
    ' ' + formatTime(d)
}

function formatDuration(start: Date, end: Date, now: Date) {
  const totalMin = Math.round((end.getTime() - start.getTime()) / 60000)
  const remainMin = Math.round((end.getTime() - now.getTime()) / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  const rh = Math.floor(remainMin / 60)
  const rm = remainMin % 60
  const total = h > 0 ? `${h}h${m > 0 ? m + 'm' : ''}` : `${m}m`
  const remain = rh > 0 ? `${rh}h${rm > 0 ? rm + 'm' : ''}` : `${rm}m`
  return `${total} totali · ${remain} rimasti`
}

// ── WeekView ──────────────────────────────────────────────────────────────────

const HOUR_HEIGHT = 72 // px per hour
const START_HOUR = 0
const END_HOUR = 24
const TOTAL_HOURS = END_HOUR - START_HOUR
const TIME_COL_W = 56

function WeekView({ events, now, isSticky }: { events: CalEvent[], now: Date, isSticky: boolean }) {
  const gridRef = useRef<HTMLDivElement>(null)
  const weekDays = getWeekDays(now)
  const nowMinutes = minutesFromMidnight(now)
  const todayIdx = weekDays.findIndex(d => sameDay(d, now))
  const hours = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => START_HOUR + i)

  // When switching to sticky, scroll to current time
  useEffect(() => {
    if (isSticky && gridRef.current) {
      const topPx = ((nowMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT
      gridRef.current.scrollTop = Math.max(0, topPx - 100)
    }
  }, [isSticky, nowMinutes])

  const dayHeaders = (
    <div className="flex border-b border-white/10 flex-shrink-0" style={{ paddingLeft: TIME_COL_W }}>
      {weekDays.map((d, i) => (
        <div
          key={i}
          className="flex-1 text-center py-3"
          style={{
            color: sameDay(d, now) ? 'white' : 'rgba(255,255,255,0.35)',
            fontWeight: sameDay(d, now) ? 600 : 400,
            borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.06)' : undefined,
            backgroundColor: sameDay(d, now) ? 'rgba(255,255,255,0.03)' : undefined,
          }}
        >
          <div className="text-sm uppercase tracking-widest">{DAYS_IT[i]}</div>
          <div
            className="text-xl mt-1 w-9 h-9 mx-auto flex items-center justify-center rounded-full"
            style={{
              backgroundColor: sameDay(d, now) ? 'white' : undefined,
              color: sameDay(d, now) ? 'black' : undefined,
            }}
          >
            {d.getDate()}
          </div>
        </div>
      ))}
    </div>
  )

  const gridBody = (
    <div
      ref={gridRef}
      className={isSticky ? 'overflow-y-auto flex-1' : ''}
    >
      <div className="relative flex" style={{ height: TOTAL_HOURS * HOUR_HEIGHT }}>
        {/* Time labels */}
        <div className="flex-shrink-0" style={{ width: TIME_COL_W }}>
          {hours.map(h => (
            <div
              key={h}
              className="absolute text-right pr-3 text-sm text-white/30 leading-none"
              style={{ top: (h - START_HOUR) * HOUR_HEIGHT - 8, right: 0, width: TIME_COL_W }}
            >
              {h < END_HOUR ? `${String(h).padStart(2, '0')}:00` : ''}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map((day, colIdx) => {
          const dayEvents = events.filter(e => !e.allDay && sameDay(parseDate(e.start), day))
          const isToday = sameDay(day, now)

          return (
            <div
              key={colIdx}
              className="flex-1 relative"
              style={{
                borderLeft: '1px solid rgba(255,255,255,0.06)',
                backgroundColor: isToday ? 'rgba(255,255,255,0.015)' : undefined,
              }}
            >
              {/* Hour lines */}
              {hours.map(h => (
                <div
                  key={h}
                  className="absolute left-0 right-0"
                  style={{ top: (h - START_HOUR) * HOUR_HEIGHT, borderTop: '1px solid rgba(255,255,255,0.05)' }}
                />
              ))}

              {/* Events */}
              {dayEvents.map((ev, ei) => {
                const s = parseDate(ev.start)
                const e = parseDate(ev.end)
                const topMin = Math.max(minutesFromMidnight(s) - START_HOUR * 60, 0)
                const heightMin = Math.min(
                  minutesFromMidnight(e) - minutesFromMidnight(s),
                  TOTAL_HOURS * 60 - topMin
                )
                const top = (topMin / 60) * HOUR_HEIGHT
                const height = Math.max((heightMin / 60) * HOUR_HEIGHT, 22)

                return (
                  <div
                    key={ei}
                    className="absolute left-0.5 right-0.5 rounded-sm px-2 overflow-hidden"
                    style={{
                      top,
                      height,
                      backgroundColor: ev.color + 'CC',
                      borderLeft: `3px solid ${ev.color}`,
                      fontSize: 13,
                      lineHeight: '18px',
                    }}
                  >
                    <div className="font-medium truncate text-white">{ev.title}</div>
                    {height > 36 && (
                      <div className="text-white/70 truncate text-xs">
                        {formatTime(s)}–{formatTime(e)}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Vertical today highlight */}
              {isToday && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ borderLeft: '1px solid rgba(239,68,68,0.2)', borderRight: '1px solid rgba(239,68,68,0.2)', zIndex: 9 }}
                />
              )}
            </div>
          )
        })}

        {/* Current time line + dot */}
        {todayIdx >= 0 && (() => {
          const topPx = ((nowMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT
          if (topPx < 0 || topPx > TOTAL_HOURS * HOUR_HEIGHT) return null
          return (
            <>
              <div
                className="absolute pointer-events-none"
                style={{ top: topPx, left: TIME_COL_W, right: 0, height: 1, backgroundColor: 'rgba(239,68,68,0.65)', zIndex: 10 }}
              />
              <div
                className="absolute pointer-events-none rounded-full"
                style={{ top: topPx - 4, left: TIME_COL_W - 4, width: 8, height: 8, backgroundColor: 'rgb(239,68,68)', zIndex: 11 }}
              />
            </>
          )
        })()}
      </div>
    </div>
  )

  return (
    <div
      className="border border-white/10 overflow-hidden flex flex-col"
      style={isSticky ? { flex: 1, minHeight: 0 } : {}}
    >
      {dayHeaders}
      {gridBody}
    </div>
  )
}

// ── MonthView ─────────────────────────────────────────────────────────────────

function MonthView({ events, now }: { events: CalEvent[], now: Date }) {
  const cells = getMonthDays(now)

  return (
    <div className="border border-white/10 overflow-hidden">
      <div className="grid grid-cols-7 border-b border-white/10">
        {DAYS_IT.map(d => (
          <div key={d} className="py-3 text-center text-sm uppercase tracking-widest text-white/30">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const isToday = day !== null && sameDay(day, now)
          const dayEvents = day
            ? events.filter(e => {
                if (e.allDay) {
                  const startDay = new Date(e.start + 'T00:00:00')
                  const endDay = new Date(new Date(e.end).getTime() - 1)
                  return startDay <= day && day <= endDay
                }
                return sameDay(parseDate(e.start), day)
              })
            : []

          return (
            <div
              key={i}
              className="min-h-28 p-2"
              style={{
                borderTop: i >= 7 ? '1px solid rgba(255,255,255,0.05)' : undefined,
                borderLeft: i % 7 !== 0 ? '1px solid rgba(255,255,255,0.05)' : undefined,
                backgroundColor: isToday ? 'rgba(255,255,255,0.04)' : undefined,
              }}
            >
              {day && (
                <>
                  <div
                    className="text-sm w-8 h-8 flex items-center justify-center rounded-full mb-1.5"
                    style={{
                      backgroundColor: isToday ? 'white' : undefined,
                      color: isToday ? 'black' : 'rgba(255,255,255,0.4)',
                      fontWeight: isToday ? 600 : 400,
                    }}
                  >
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((ev, ei) => (
                      <div
                        key={ei}
                        className="text-sm truncate rounded px-1.5 leading-6"
                        style={{
                          backgroundColor: ev.color + '33',
                          borderLeft: `2px solid ${ev.color}`,
                          color: 'rgba(255,255,255,0.8)',
                        }}
                      >
                        {!ev.allDay && (
                          <span className="text-white/50 mr-1">{formatTime(parseDate(ev.start))}</span>
                        )}
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-sm text-white/25 pl-1">+{dayEvents.length - 3} altri</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const HEADER_H = 56 // px — matches the private area sticky header

export default function CalendarClient() {
  const [view, setView] = useState<'week' | 'month'>('week')
  const [data, setData] = useState<CalendarData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [now, setNow] = useState(new Date())
  const [isSticky, setIsSticky] = useState(false)

  const labelRef = useRef<HTMLParagraphElement>(null)

  // Observe when the "Settimana del..." label reaches the site header
  useEffect(() => {
    const el = labelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { rootMargin: `-${HEADER_H}px 0px 0px 0px` }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/private/calendar?view=${view}`)
        if (!res.ok) throw new Error('Errore caricamento')
        const d = await res.json()
        setData(d)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Errore sconosciuto')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [view])

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/30 text-sm">Caricamento calendario...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400/60 text-sm">{error ?? 'Nessun dato'}</p>
      </div>
    )
  }

  const calendarLabel = (
    <p ref={labelRef} className="text-sm uppercase tracking-widest text-white/30 mb-4">
      {view === 'week'
        ? `Settimana del ${MONTHS_IT[now.getMonth()]} ${now.getFullYear()}`
        : `${MONTHS_IT[now.getMonth()]} ${now.getFullYear()}`
      }
    </p>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-light tracking-wide">Calendario</h1>
        <div className="flex text-sm border border-white/10 overflow-hidden">
          <button
            onClick={() => setView('week')}
            className="px-4 py-2 transition-colors"
            style={{
              backgroundColor: view === 'week' ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: view === 'week' ? 'white' : 'rgba(255,255,255,0.35)',
            }}
          >
            Settimana
          </button>
          <button
            onClick={() => setView('month')}
            className="px-4 py-2 transition-colors border-l border-white/10"
            style={{
              backgroundColor: view === 'month' ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: view === 'month' ? 'white' : 'rgba(255,255,255,0.35)',
            }}
          >
            Mese
          </button>
        </div>
      </div>

      {/* Current activity */}
      <CurrentActivity events={data.events} now={now} />

      {/* Calendar section — becomes sticky+scrollable when label hits the header */}
      <div
        className="flex flex-col"
        style={isSticky ? {
          position: 'sticky',
          top: HEADER_H,
          height: `calc(100vh - ${HEADER_H}px)`,
          backgroundColor: '#0a0a0a',
          zIndex: 20,
          paddingBottom: '1rem',
        } : {}}
      >
        {calendarLabel}
        {view === 'week'
          ? <WeekView events={data.events} now={now} isSticky={isSticky} />
          : <MonthView events={data.events} now={now} />
        }
      </div>
    </div>
  )
}
