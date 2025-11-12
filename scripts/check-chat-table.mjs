// Check if game_chat_messages_v2 table exists
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wuvuapmjclahbmngntku.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dnVhcG1qY2xhaGJtbmdudGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzAyNDQsImV4cCI6MjA3NjEwNjI0NH0.12asA4yGSUdP_zkfGGZyv7vOX6Ncq9GhkIpBD1tcscc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTable() {
  console.log('🔍 Checking if game_chat_messages_v2 table exists...\n')

  const { data, error } = await supabase
    .from('game_chat_messages_v2')
    .select('*')
    .limit(1)

  if (error) {
    console.error('❌ Table does NOT exist or has errors:')
    console.error(error.message)
    console.log('\n📝 You need to create the table by running the SQL in Supabase Dashboard:')
    console.log('   database/chat_messages_v2.sql')
  } else {
    console.log('✅ Table exists!')
    console.log(`   Found ${data?.length || 0} messages`)
  }
}

checkTable()
