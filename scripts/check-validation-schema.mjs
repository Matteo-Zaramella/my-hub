#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
  console.log('='.repeat(60))
  console.log('🔍 VERIFICA SCHEMA VALIDAZIONE RISPOSTE')
  console.log('='.repeat(60))
  console.log('')

  // Verifica colonna answer_code su game_clues
  console.log('1️⃣  Controllo colonna answer_code su game_clues...')
  const { data: clues, error: cluesError } = await supabase
    .from('game_clues')
    .select('id, answer_code')
    .limit(1)

  if (cluesError) {
    if (cluesError.message.includes('column') && cluesError.message.includes('answer_code')) {
      console.log('   ❌ Colonna answer_code NON esiste su game_clues')
    } else {
      console.log('   ❌ Errore:', cluesError.message)
    }
  } else {
    console.log('   ✅ Colonna answer_code esiste su game_clues')
  }
  console.log('')

  // Verifica colonna answer_code su game_challenges
  console.log('2️⃣  Controllo colonna answer_code su game_challenges...')
  const { data: challenges, error: challengesError } = await supabase
    .from('game_challenges')
    .select('id, answer_code')
    .limit(1)

  if (challengesError) {
    if (challengesError.message.includes('column') && challengesError.message.includes('answer_code')) {
      console.log('   ❌ Colonna answer_code NON esiste su game_challenges')
    } else {
      console.log('   ❌ Errore:', challengesError.message)
    }
  } else {
    console.log('   ✅ Colonna answer_code esiste su game_challenges')
  }
  console.log('')

  // Verifica tabella clue_submissions
  console.log('3️⃣  Controllo tabella clue_submissions...')
  const { data: clueSubs, error: clueSubsError } = await supabase
    .from('clue_submissions')
    .select('id')
    .limit(1)

  if (clueSubsError) {
    if (clueSubsError.message.includes('does not exist') || clueSubsError.message.includes('relation')) {
      console.log('   ❌ Tabella clue_submissions NON esiste')
    } else {
      console.log('   ❌ Errore:', clueSubsError.message)
    }
  } else {
    console.log('   ✅ Tabella clue_submissions esiste')
    const { count } = await supabase
      .from('clue_submissions')
      .select('*', { count: 'exact', head: true })
    console.log(`   📊 Record: ${count}`)
  }
  console.log('')

  // Verifica tabella challenge_submissions
  console.log('4️⃣  Controllo tabella challenge_submissions...')
  const { data: challengeSubs, error: challengeSubsError } = await supabase
    .from('challenge_submissions')
    .select('id')
    .limit(1)

  if (challengeSubsError) {
    if (challengeSubsError.message.includes('does not exist') || challengeSubsError.message.includes('relation')) {
      console.log('   ❌ Tabella challenge_submissions NON esiste')
    } else {
      console.log('   ❌ Errore:', challengeSubsError.message)
    }
  } else {
    console.log('   ✅ Tabella challenge_submissions esiste')
    const { count } = await supabase
      .from('challenge_submissions')
      .select('*', { count: 'exact', head: true })
    console.log(`   📊 Record: ${count}`)
  }
  console.log('')

  console.log('='.repeat(60))
  console.log('CONCLUSIONE:')
  console.log('='.repeat(60))

  const allGood = !cluesError && !challengesError && !clueSubsError && !challengeSubsError

  if (allGood) {
    console.log('✅ Schema completo! Puoi procedere con populate-answer-codes.mjs')
  } else {
    console.log('⚠️  Schema incompleto!')
    console.log('')
    console.log('📝 Per completare lo schema:')
    console.log('   1. Vai su: https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql')
    console.log('   2. Copia il contenuto di: database/add_answer_validation_schema.sql')
    console.log('   3. Incolla nell\'SQL Editor e clicca "Run"')
    console.log('   4. Riesegui questo script per verificare')
  }
  console.log('')
}

checkSchema()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Errore fatale:', error)
    process.exit(1)
  })
