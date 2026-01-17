import { createClient } from '@supabase/supabase-js'

// Client con service role per operazioni admin (insert partecipanti, gestione OTP)
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// Genera codice partecipante univoco (8 caratteri alfanumerici)
export function generateParticipantCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Escludo 0, O, 1, I per evitare confusione
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Genera OTP a 6 cifre
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
