import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getSessionFromCookies } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await getSessionFromCookies()
  if (!session || (session.role !== 'admin' && session.role !== 'viewer')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const view = searchParams.get('view') || 'week' // 'week' | 'month'
  const now = new Date()

  let timeMin: Date
  let timeMax: Date

  if (view === 'month') {
    timeMin = new Date(now.getFullYear(), now.getMonth(), 1)
    timeMax = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  } else {
    // week: Mon–Sun of current week
    const day = now.getDay() // 0=Sun
    const diffToMon = (day === 0 ? -6 : 1 - day)
    timeMin = new Date(now)
    timeMin.setDate(now.getDate() + diffToMon)
    timeMin.setHours(0, 0, 0, 0)
    timeMax = new Date(timeMin)
    timeMax.setDate(timeMin.getDate() + 6)
    timeMax.setHours(23, 59, 59, 999)
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  })

  const calendarApi = google.calendar({ version: 'v3', auth: oauth2Client })

  // Fetch all calendars
  const calListRes = await calendarApi.calendarList.list()
  const calendars = calListRes.data.items ?? []

  // Fetch events from all calendars in parallel
  const eventArrays = await Promise.all(
    calendars.map(async (cal) => {
      try {
        const evRes = await calendarApi.events.list({
          calendarId: cal.id!,
          timeMin: timeMin.toISOString(),
          timeMax: timeMax.toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
          maxResults: 250,
        })
        return (evRes.data.items ?? []).map(ev => ({
          id: ev.id,
          title: ev.summary ?? '(senza titolo)',
          start: ev.start?.dateTime ?? ev.start?.date ?? '',
          end: ev.end?.dateTime ?? ev.end?.date ?? '',
          allDay: !ev.start?.dateTime,
          color: cal.backgroundColor ?? '#4285F4',
          calendarName: cal.summary ?? '',
        }))
      } catch {
        return []
      }
    })
  )

  const events = eventArrays.flat()

  return NextResponse.json({ events, now: now.toISOString() })
}
