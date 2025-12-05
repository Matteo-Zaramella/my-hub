import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Mancano le variabili d\'ambiente SUPABASE')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTableStructure() {
  console.log('🔍 VERIFICA STRUTTURA TABELLE\n')

  // Verifica game_challenges
  console.log('--- TABELLA: game_challenges ---')
  const { data: challenges, error: chalError } = await supabase
    .from('game_challenges')
    .select('*')
    .limit(1)

  if (chalError) {
    console.error('❌ Errore:', chalError.message)
  } else if (challenges && challenges.length > 0) {
    console.log('Colonne disponibili:', Object.keys(challenges[0]).join(', '))
    console.log('Esempio record:', JSON.stringify(challenges[0], null, 2))
  }

  // Verifica game_clues
  console.log('\n--- TABELLA: game_clues ---')
  const { data: clues, error: clueError } = await supabase
    .from('game_clues')
    .select('*')
    .limit(1)

  if (clueError) {
    console.error('❌ Errore:', clueError.message)
  } else if (clues && clues.length > 0) {
    console.log('Colonne disponibili:', Object.keys(clues[0]).join(', '))
    console.log('Esempio record:', JSON.stringify(clues[0], null, 2))
  } else {
    console.log('⚠️  Nessun record trovato')
  }

  // Count totali
  console.log('\n--- CONTEGGI ---')
  const { count: chalCount } = await supabase
    .from('game_challenges')
    .select('*', { count: 'exact', head: true })

  const { count: clueCount } = await supabase
    .from('game_clues')
    .select('*', { count: 'exact', head: true })

  console.log(`Sfide totali: ${chalCount}`)
  console.log(`Indizi totali: ${clueCount}`)
}

checkTableStructure()
