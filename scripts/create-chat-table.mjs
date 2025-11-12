// Script per creare automaticamente la tabella game_chat_messages_v2 usando Supabase Management API
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SUPABASE_PROJECT_REF = 'wuvuapmjclahbmngntku'
const SUPABASE_URL = 'https://wuvuapmjclahbmngntku.supabase.co'

// Leggi il file SQL
const sqlPath = path.join(__dirname, '..', 'database', 'chat_messages_v2.sql')
const sqlContent = fs.readFileSync(sqlPath, 'utf-8')

console.log('🚀 Tentativo di creare tabella game_chat_messages_v2...\n')

console.log('📋 Opzioni disponibili:\n')
console.log('1. METODO MANUALE (Consigliato):')
console.log('   - Apri: https://supabase.com/dashboard/project/' + SUPABASE_PROJECT_REF + '/sql')
console.log('   - Copia il contenuto di: database/chat_messages_v2.sql')
console.log('   - Incolla ed esegui\n')

console.log('2. USANDO PSQL (se hai PostgreSQL installato):')
console.log('   Copia questo comando:\n')
console.log('   psql "postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres" -f database/chat_messages_v2.sql\n')

console.log('3. USANDO SUPABASE CLI (se installato):')
console.log('   supabase db push\n')

console.log('📄 Contenuto SQL da eseguire:')
console.log('─'.repeat(80))
console.log(sqlContent)
console.log('─'.repeat(80))
