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
  console.log('=== STRUTTURA game_challenges ===')
  const { data: challenges, error: e1 } = await supabase
    .from('game_challenges')
    .select('*')
    .limit(2)

  if (e1) console.error('Errore:', e1)
  else {
    console.log('Colonne:', challenges?.[0] ? Object.keys(challenges[0]) : 'tabella vuota')
    console.log('Esempio:', challenges?.[0])
  }

  console.log('\n=== STRUTTURA game_clues ===')
  const { data: clues, error: e2 } = await supabase
    .from('game_clues')
    .select('*')
    .limit(2)

  if (e2) console.error('Errore:', e2)
  else {
    console.log('Colonne:', clues?.[0] ? Object.keys(clues[0]) : 'tabella vuota')
    console.log('Esempio:', clues?.[0])
  }

  console.log('\n=== CONTEGGI ===')
  const { count: cCount } = await supabase.from('game_challenges').select('*', { count: 'exact', head: true })
  const { count: clCount } = await supabase.from('game_clues').select('*', { count: 'exact', head: true })
  console.log('Sfide:', cCount)
  console.log('Indizi:', clCount)
}

main()
