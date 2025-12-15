#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setup() {
  console.log('🔧 Setup database pulito...\n')

  // 1. Elimina tutti i partecipanti tranne SYSTEM
  console.log('🗑️  Step 1: Rimozione partecipanti...')
  const { error: deleteError } = await supabase
    .from('game_participants')
    .delete()
    .neq('participant_code', 'SYSTEM')

  if (deleteError) {
    console.log('⚠️  Nessun partecipante da rimuovere o errore:', deleteError.message)
  } else {
    console.log('✅ Partecipanti rimossi')
  }

  // 2. Crea partecipante TEST
  console.log('\n👤 Step 2: Creazione partecipante TEST...')
  const { data: testData, error: testError } = await supabase
    .from('game_participants')
    .insert([{
      participant_name: 'TEST',
      participant_code: 'TEST123',
      participant_type: 'test',
      current_points: 0,
      registration_completed: true,
      email: 'test@example.com'
    }])
    .select()

  if (testError) {
    console.log('⚠️  Errore creazione TEST:', testError.message)
  } else {
    console.log('✅ Partecipante TEST creato')
  }

  // 3. Verifica finale
  console.log('\n📊 Step 3: Verifica finale...')
  const { data, error } = await supabase
    .from('game_participants')
    .select('*')
    .order('participant_name')

  if (error) {
    console.error('❌ Errore:', error.message)
    process.exit(1)
  }

  console.log(`\n✅ Database pulito! Totale partecipanti: ${data.length}`)
  data.forEach(p => {
    console.log(`   - ${p.participant_name} (${p.participant_code}) [${p.participant_type}]`)
  })

  console.log('\n✨ Pronto per registrazione self-service!')
}

setup()
