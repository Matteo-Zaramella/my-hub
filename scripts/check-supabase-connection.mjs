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

console.log('🔍 VERIFICA CONNESSIONE SUPABASE\n')
console.log(`URL: ${supabaseUrl}\n`)

async function testTable(tableName) {
  console.log(`📋 Testing: ${tableName}`)

  const { data, error, count } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.log(`   ❌ Errore: ${error.message}`)
    console.log(`   Code: ${error.code}`)
    console.log(`   Details: ${error.details}`)
    console.log(`   Hint: ${error.hint}`)
  } else {
    console.log(`   ✅ OK - ${count} record`)
  }
  console.log()
}

async function main() {
  const tables = [
    'game_settings',
    'game_challenges',
    'game_clues',
    'ceremony_clues',
    'ceremony_clues_found',
    'participants',
    'chat_messages',
    'wishlist_items'
  ]

  for (const table of tables) {
    await testTable(table)
  }

  console.log('\n✅ Test completato')
}

main()
