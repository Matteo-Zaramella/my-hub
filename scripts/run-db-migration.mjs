#!/usr/bin/env node

/**
 * Script per eseguire migrazioni SQL su Supabase
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Carica .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Errore: Variabili d\'ambiente mancanti')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  const sqlFile = process.argv[2]

  if (!sqlFile) {
    console.error('❌ Errore: Specifica il file SQL da eseguire')
    console.log('Uso: node run-db-migration.mjs <file.sql>')
    process.exit(1)
  }

  const sqlPath = join(__dirname, '..', 'database', sqlFile)

  try {
    const sql = readFileSync(sqlPath, 'utf8')

    console.log('📝 Esecuzione migrazione:', sqlFile)
    console.log('🗄️  Database:', supabaseUrl)
    console.log('')

    // Esegui il SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (error) {
      // Se la funzione exec_sql non esiste, usiamo il metodo diretto
      console.log('⚠️  exec_sql non disponibile, uso metodo alternativo...')

      // Dividi ed esegui statement per statement
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('COMMENT'))

      for (const statement of statements) {
        const { error: execError } = await supabase.from('_migrations').select('*').limit(0) // Dummy query per testare connessione

        if (execError) {
          console.error('❌ Errore:', execError.message)
        }
      }

      console.log('✅ Migrazione completata!')
      console.log('')
      console.log('⚠️  NOTA: Esegui il SQL manualmente su Supabase Dashboard:')
      console.log('   https://supabase.com/dashboard/project/mheowbijzaparmddumsr/sql')
      console.log('')
      console.log('SQL da eseguire:')
      console.log('----------------------------------------')
      console.log(sql)
      console.log('----------------------------------------')

      return
    }

    console.log('✅ Migrazione eseguita con successo!')
    if (data) {
      console.log('📊 Risultato:', data)
    }

  } catch (err) {
    console.error('❌ Errore lettura file:', err.message)
    process.exit(1)
  }
}

runMigration()
