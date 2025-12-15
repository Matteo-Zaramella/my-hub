#!/usr/bin/env node

/**
 * Script per creare utente admin in Supabase
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Carica .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Errore: Variabili d\'ambiente mancanti')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  const email = 'matteo.zaramella2002@gmail.com'
  const password = '6J2YPL8h$gkfxQayZG6u'

  console.log('🔐 Creazione utente admin...')
  console.log('📧 Email:', email)

  // Crea utente tramite Supabase Admin API
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Conferma automaticamente l'email
  })

  if (error) {
    // Se l'utente esiste già, proviamo a resettare la password
    if (error.message.includes('already registered')) {
      console.log('⚠️  Utente già esistente, aggiorno la password...')

      // Prima otteniamo l'ID utente
      const { data: users } = await supabase.auth.admin.listUsers()
      const existingUser = users?.users?.find(u => u.email === email)

      if (existingUser) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          { password }
        )

        if (updateError) {
          console.error('❌ Errore aggiornamento password:', updateError.message)
          process.exit(1)
        }

        console.log('✅ Password aggiornata con successo!')
        console.log('🎉 Puoi ora accedere con:')
        console.log('   Email:', email)
        console.log('   Password: [la password che hai impostato]')
        process.exit(0)
      }
    }

    console.error('❌ Errore creazione utente:', error.message)
    process.exit(1)
  }

  console.log('✅ Utente admin creato con successo!')
  console.log('🎉 Dettagli:')
  console.log('   ID:', data.user.id)
  console.log('   Email:', data.user.email)
  console.log('   Email confermata:', data.user.email_confirmed_at ? '✅' : '❌')
  console.log('')
  console.log('🔗 Puoi ora accedere a:')
  console.log('   http://localhost:3000/login')
}

createAdminUser()
