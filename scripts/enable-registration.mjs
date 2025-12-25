import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  console.log('URL:', supabaseUrl ? 'OK' : 'MISSING')
  console.log('KEY:', supabaseKey ? 'OK' : 'MISSING')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function enableRegistration() {
  console.log('🔧 Aggiornamento registration_button_enabled...')

  const { data, error } = await supabase
    .from('game_settings')
    .update({ setting_value: true })
    .eq('setting_key', 'registration_button_enabled')

  if (error) {
    console.error('❌ Errore:', error)
  } else {
    console.log('✅ registration_button_enabled aggiornato a TRUE')
    console.log('   Ora il pulsante REGISTRATI apparirà dopo il Terminal Welcome')
  }
}

enableRegistration()
