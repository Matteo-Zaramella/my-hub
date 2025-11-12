// Script per creare la tabella game_chat_messages_v2 su Supabase
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Leggi le credenziali dal .env.local
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')

const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim()
const supabaseKey = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim()

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupChatV2() {
  console.log('🚀 Setup chat_messages_v2 table...')

  // Leggi il file SQL
  const sqlPath = path.join(__dirname, '..', 'database', 'chat_messages_v2.sql')
  const sql = fs.readFileSync(sqlPath, 'utf-8')

  // Esegui lo script SQL
  // Nota: Supabase JS client non supporta l'esecuzione diretta di SQL multi-statement
  // Dobbiamo usare l'API REST di Supabase o il CLI
  console.log('⚠️  Questo script non può eseguire SQL direttamente.')
  console.log('\n📋 Istruzioni:')
  console.log('1. Apri Supabase Dashboard: https://supabase.com/dashboard')
  console.log('2. Vai su SQL Editor')
  console.log('3. Copia e incolla il contenuto di: database/chat_messages_v2.sql')
  console.log('4. Esegui lo script')
  console.log('\nOppure usa il CLI di Supabase:')
  console.log('npx supabase db push')
}

setupChatV2()
