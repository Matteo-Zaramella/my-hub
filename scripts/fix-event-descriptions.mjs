#!/usr/bin/env node
import { google } from 'googleapis'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.local') })

const CALENDAR_ID = '9cbd1bb58997dc6501b56adc65e4c49cafba5902b968aa39d07e953ecdf57716@group.calendar.google.com'

// Setup OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
})

const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

console.log('Updating event descriptions...\n')

// Get all events
const { data } = await calendar.events.list({
  calendarId: CALENDAR_ID,
  timeMin: '2026-01-01T00:00:00Z',
  timeMax: '2027-12-31T23:59:59Z',
  singleEvents: true,
  orderBy: 'startTime'
})

const events = data.items || []
console.log(`Found ${events.length} events\n`)

for (const event of events) {
  const summary = event.summary || ''
  let needsUpdate = false
  let newDescription = event.description || ''

  // Update indizi descriptions
  if (summary.includes('Indizio') || summary.includes('💡') || summary.includes('🔍')) {
    // Remove punto references
    newDescription = newDescription.replace(/💰 Punti:.*\n?/g, '')
    newDescription = newDescription.replace(/🔐 Codice validazione richiesto\n?/g, '')

    // Fix pubblicazione time
    if (newDescription.includes('12:00')) {
      newDescription = newDescription.replace(/alle 12:00/g, 'alle 00:00 del giorno successivo')
      needsUpdate = true
    } else if (!newDescription.includes('00:00')) {
      // Add correct description if missing
      const sfidaMatch = summary.match(/Sfida (\d+)/)
      const sfidaNum = sfidaMatch ? sfidaMatch[1] : '?'
      const indiziMatch = summary.match(/Indizio (\d+)/)
      const indiziNum = indiziMatch ? indiziMatch[1] : '?'

      newDescription = `Indizio ${indiziNum} per Sfida ${sfidaNum}\n\n💡 Pubblicazione automatica alle 00:00 del giorno successivo\n🔐 Validazione richiesta sul sito`
      needsUpdate = true
    }
  }

  // Update sfide descriptions
  if (summary.includes('Sfida') && summary.includes('🎯')) {
    // Remove punto references
    if (newDescription.includes('💰 Punti:')) {
      newDescription = newDescription.replace(/💰 Punti:.*\n?/g, '')
      needsUpdate = true
    }

    // Keep only location and validation info
    if (!newDescription.includes('📍 Location:')) {
      const sfidaMatch = summary.match(/Sfida (\d+)/)
      const sfidaNum = sfidaMatch ? sfidaMatch[1] : '?'
      newDescription = `Descrizione della Sfida ${sfidaNum}\n\n📍 Location: Da definire\n\n🔐 I partecipanti devono trovare il codice segreto per validare la sfida completata.`
      needsUpdate = true
    }
  }

  if (needsUpdate) {
    try {
      await calendar.events.patch({
        calendarId: CALENDAR_ID,
        eventId: event.id,
        requestBody: {
          description: newDescription.trim()
        }
      })
      console.log(`✅ Updated: ${summary}`)
    } catch (error) {
      console.log(`❌ Error updating ${summary}: ${error.message}`)
    }
  } else {
    console.log(`⏭️  Skipped: ${summary} (no changes needed)`)
  }
}

console.log('\n✅ Done!')
process.exit(0)
