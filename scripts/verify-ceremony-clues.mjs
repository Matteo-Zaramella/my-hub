import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

console.log('🔍 Verificando tabella ceremony_clue_riddles...\n')

const { data, error } = await supabase
  .from('ceremony_clue_riddles')
  .select('*')
  .order('order_number')

if (error) {
  console.error('❌ Errore:', error.message)
  process.exit(1)
}

if (!data || data.length === 0) {
  console.log('⚠️ Tabella vuota! Nessun indizio trovato.')
  process.exit(1)
}

console.log(`✅ Indizi trovati: ${data.length}\n`)
console.log('Lista completa:')
data.forEach(clue => {
  console.log(`  ${clue.order_number}. ${clue.clue_word}`)
})

// Verifica che formino EVOLUZIONE
const firstLetters = data.map(c => c.clue_word.charAt(0)).join('')
console.log(`\n📝 Prime lettere: ${firstLetters}`)
console.log(firstLetters === 'EVOLUZIONE' ? '✅ Formano correttamente EVOLUZIONE!' : '❌ Non formano EVOLUZIONE')

// Verifica ceremony_clues_found
console.log('\n🔍 Verificando indizi trovati (ceremony_clues_found)...')
const { data: foundData, error: foundError } = await supabase
  .from('ceremony_clues_found')
  .select('*')
  .eq('participant_code', 'GLOBAL')

if (foundError) {
  console.error('❌ Errore:', foundError.message)
} else {
  console.log(`✅ Indizi già trovati: ${foundData?.length || 0}`)
  if (foundData && foundData.length > 0) {
    foundData.forEach(found => {
      console.log(`  - ${found.clue_word}`)
    })
  }
}

// Verifica game_settings
console.log('\n🔍 Verificando game_settings...')
const { data: settingsData, error: settingsError } = await supabase
  .from('game_settings')
  .select('*')
  .in('setting_key', ['ceremony_active', 'registration_button_enabled', 'wishlist_button_enabled', 'password_input_enabled', 'minigame_button_enabled', 'maintenance_mode'])

if (settingsError) {
  console.error('❌ Errore:', settingsError.message)
} else {
  console.log('Settings correnti:')
  settingsData.forEach(s => {
    const value = s.setting_value ? '✅ ABILITATO' : '❌ DISABILITATO'
    console.log(`  ${s.setting_key}: ${value}`)
  })
}

console.log('\n✅ Verifica completata!')
