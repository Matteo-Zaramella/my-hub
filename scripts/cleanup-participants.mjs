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

async function cleanup() {
  console.log('🗑️  Rimozione partecipanti (tranne TEST)...')

  // Elimina tutti tranne TEST
  const { error } = await supabase
    .from('game_participants')
    .delete()
    .neq('name', 'TEST')

  if (error) {
    console.error('❌ Errore:', error.message)
    process.exit(1)
  }

  console.log('✅ Partecipanti rimossi con successo!')

  // Verifica
  const { data, error: fetchError } = await supabase
    .from('game_participants')
    .select('*')
    .order('name')

  if (fetchError) {
    console.error('❌ Errore verifica:', fetchError.message)
    process.exit(1)
  }

  console.log('\n📊 Partecipanti rimanenti:', data.length)
  data.forEach(p => {
    console.log(`   - ${p.name} (${p.participant_code})`)
  })
}

cleanup()
