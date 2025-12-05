import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔍 LISTA TABELLE SUPABASE\n')

// Prova a fare query su diverse tabelle possibili
const tablesToTry = [
  'game_challenges',
  'game_clues',
  'game_settings',
  'game_phases',
  'participants',
  'ceremony_clues',
  'ceremony_clues_found',
  'chat_messages',
  'wishlist_items',
  'users',
  'profiles'
]

for (const table of tablesToTry) {
  const { error, count } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.log(`❌ ${table} - Non esiste o inaccessibile`)
  } else {
    console.log(`✅ ${table} - ${count} record`)
  }
}

console.log('\n✅ Scansione completata')
