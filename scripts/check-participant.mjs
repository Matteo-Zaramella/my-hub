import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  // Cerca Bendistinto
  const { data, error } = await supabase
    .from('game_participants')
    .select('*')
    .or('nickname.ilike.%bendist%,email.ilike.%bendist%,participant_code.eq.AGH97HWT')

  if (error) {
    console.error('Errore:', error)
    return
  }

  if (data.length === 0) {
    console.log('❌ Nessun partecipante trovato con "bendist" o codice AGH97HWT')
  } else {
    console.log('Partecipanti trovati:')
    data.forEach(p => {
      console.log(`
  ID: ${p.id}
  Nickname: ${p.nickname}
  Email: ${p.email}
  Codice: ${p.participant_code}
  Email verificata: ${p.email_verified}
  Team ID: ${p.team_id}
  Creato: ${p.created_at}
`)
    })
  }
}

main()
