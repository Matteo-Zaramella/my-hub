import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function check() {
  console.log('🔍 Verifica tabelle...\n')

  // Check game_participants
  const { data: participants, error: participantsErr } = await supabase
    .from('game_participants')
    .select('count', { count: 'exact', head: true })

  if (participantsErr) {
    console.log('❌ game_participants:', participantsErr.message)
  } else {
    console.log('✅ game_participants: tabella esiste!')
  }

  // Check otp_codes
  const { data: otp, error: otpErr } = await supabase
    .from('otp_codes')
    .select('count', { count: 'exact', head: true })

  if (otpErr) {
    console.log('❌ otp_codes:', otpErr.message)
  } else {
    console.log('✅ otp_codes: tabella esiste!')
  }
}

check()
