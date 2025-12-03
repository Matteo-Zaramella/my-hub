import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Carica variabili ambiente
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Mancano le credenziali Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function clearChatMessages() {
  console.log('🗑️  Cancellazione messaggi chat pubblica...\n')

  try {
    // Conta messaggi prima della cancellazione
    const { count: beforeCount } = await supabase
      .from('game_chat_messages_v2')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Messaggi presenti: ${beforeCount}`)

    if (beforeCount === 0) {
      console.log('✅ Nessun messaggio da cancellare\n')
      return
    }

    // Cancella tutti i messaggi
    const { error } = await supabase
      .from('game_chat_messages_v2')
      .delete()
      .gte('id', 0) // Cancella tutto (ID >= 0)

    if (error) {
      console.error('❌ Errore cancellazione:', error)
      process.exit(1)
    }

    // Verifica cancellazione
    const { count: afterCount } = await supabase
      .from('game_chat_messages_v2')
      .select('*', { count: 'exact', head: true })

    console.log(`\n✅ Cancellati ${beforeCount - afterCount} messaggi`)
    console.log(`📊 Messaggi rimanenti: ${afterCount}\n`)

  } catch (error) {
    console.error('❌ Errore:', error)
    process.exit(1)
  }
}

clearChatMessages()
