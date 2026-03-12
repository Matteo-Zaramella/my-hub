/**
 * One-time Google OAuth2 authorization to get a refresh token.
 * Run with: npx tsx scripts/google-auth.ts
 */
import { google } from 'googleapis'
import * as readline from 'readline'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
]

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent',
})

console.log('\n=== Google Calendar Authorization ===\n')
console.log('1. Apri questo link nel browser:\n')
console.log(authUrl)
console.log('\n2. Accedi con il tuo account Google e autorizza l\'app.')
console.log('3. Copia il codice che ti viene mostrato e incollalo qui sotto.\n')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

rl.question('Codice: ', async (code) => {
  rl.close()
  try {
    const { tokens } = await oauth2Client.getToken(code.trim())

    if (!tokens.refresh_token) {
      console.error('\n⚠️  Nessun refresh_token ricevuto. Riprova revocando l\'accesso su:')
      console.error('   https://myaccount.google.com/permissions\n')
      process.exit(1)
    }

    // Append to .env.local
    const envPath = path.resolve('.env.local')
    const envContent = fs.readFileSync(envPath, 'utf-8')

    const lines = envContent.split('\n').filter(l =>
      !l.startsWith('GOOGLE_CLIENT_ID=') &&
      !l.startsWith('GOOGLE_CLIENT_SECRET=') &&
      !l.startsWith('GOOGLE_REFRESH_TOKEN=')
    )

    lines.push(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`)

    fs.writeFileSync(envPath, lines.join('\n') + '\n')

    console.log('\n✓  Credenziali salvate in .env.local')
    console.log('   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN\n')
    console.log('Ora puoi riavviare il dev server.\n')
  } catch (err) {
    console.error('Errore durante lo scambio del codice:', err)
    process.exit(1)
  }
})
