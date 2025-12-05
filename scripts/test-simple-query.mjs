import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('URL:', supabaseUrl ? 'OK' : 'MISSING')
console.log('KEY:', supabaseKey ? `OK (${supabaseKey.length} chars)` : 'MISSING')

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('\n🔍 Test query game_challenges...\n')

try {
  const result = await supabase
    .from('game_challenges')
    .select('challenge_number, start_date')
    .limit(3)

  console.log('Result:', JSON.stringify(result, null, 2))
} catch (err) {
  console.error('Caught error:', err)
}
