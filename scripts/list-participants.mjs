import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function listParticipants() {
  const { data, error } = await supabase
    .from('game_participants')
    .select('id, participant_name, participant_code, email, created_at')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('Partecipanti nel database:\n')
  data.forEach((p, i) => {
    console.log(`${i + 1}. ID: ${p.id}`)
    console.log(`   Nome: ${p.participant_name}`)
    console.log(`   Email: ${p.email || 'N/A'}`)
    console.log(`   Codice: ${p.participant_code}`)
    console.log(`   Creato: ${p.created_at}`)
    console.log('')
  })
  console.log(`Totale: ${data.length} partecipanti`)
}

listParticipants()
