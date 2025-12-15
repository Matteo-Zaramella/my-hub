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

async function checkStructure() {
  console.log('🔍 Verifica struttura tabella game_participants...\n')

  const { data, error } = await supabase
    .from('game_participants')
    .select('*')
    .limit(1)

  if (error) {
    console.error('❌ Errore:', error.message)
    process.exit(1)
  }

  if (data && data.length > 0) {
    console.log('📋 Colonne disponibili:')
    Object.keys(data[0]).forEach(col => {
      console.log(`   - ${col}: ${typeof data[0][col]}`)
    })

    console.log('\n📊 Esempio record:')
    console.log(JSON.stringify(data[0], null, 2))
  } else {
    console.log('⚠️  Nessun record trovato')
  }

  // Conta totale
  const { count, error: countError } = await supabase
    .from('game_participants')
    .select('*', { count: 'exact', head: true })

  if (!countError) {
    console.log(`\n🔢 Totale partecipanti: ${count}`)
  }
}

checkStructure()
