// Auto-setup della tabella chat usando Supabase REST API
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SUPABASE_URL = 'https://wuvuapmjclahbmngntku.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dnVhcG1qY2xhaGJtbmdudGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzAyNDQsImV4cCI6MjA3NjEwNjI0NH0.12asA4yGSUdP_zkfGGZyv7vOX6Ncq9GhkIpBD1tcscc'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

console.log('🚀 Auto-setup game_chat_messages_v2 table...\n')

// Prova a eseguire SQL usando RPC function (se esiste)
async function setupTable() {
  // Leggi il contenuto SQL
  const sqlPath = path.join(__dirname, '..', 'database', 'chat_messages_v2.sql')
  const sql = fs.readFileSync(sqlPath, 'utf-8')

  console.log('⚠️  Supabase JS Client non supporta esecuzione diretta di SQL DDL.\n')
  console.log('🔧 Provo a creare la tabella manualmente tramite API...\n')

  // Tentativo: esegui ogni statement SQL separatamente
  try {
    // Nota: Questo richiede una service_role key, non anon key
    // Con anon key possiamo solo fare INSERT/SELECT/UPDATE/DELETE, non DDL

    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ query: sql })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }

    const data = await response.json()
    console.log('✅ Tabella creata con successo!')
    console.log(data)
  } catch (error) {
    console.error('❌ Errore durante la creazione automatica:', error.message)
    console.log('\n📝 SOLUZIONE MANUALE RICHIESTA:')
    console.log('1. Apri Supabase Dashboard SQL Editor:')
    console.log('   https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql')
    console.log('\n2. Crea una nuova query')
    console.log('\n3. Copia e incolla questo SQL:\n')
    console.log('─'.repeat(80))
    console.log(sql)
    console.log('─'.repeat(80))
    console.log('\n4. Esegui la query (Run)')
    console.log('\n5. Verifica: node scripts/check-chat-table.mjs')
  }
}

setupTable()
