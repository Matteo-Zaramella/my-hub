/**
 * Setup initial users + add role column to users table.
 * Run with: npx tsx scripts/setup-users.ts
 */
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

function genPassword(length = 12): string {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'
  return Array.from(crypto.randomBytes(length))
    .map(b => chars[b % chars.length])
    .join('')
}

const USERS: { username: string; role: 'admin' | 'viewer' | 'limited' }[] = [
  { username: 'matteo', role: 'admin' },
  { username: 'mamma', role: 'viewer' },
  { username: 'sorella', role: 'viewer' },
  { username: 'ragazza', role: 'viewer' },
]

async function main() {
  console.log('\n=== Setup utenti matteozaramella.com ===\n')

  // Check if role column exists, if not remind user
  const { data: cols } = await supabase
    .from('users')
    .select('role')
    .limit(1)

  if (cols === null) {
    console.log('⚠️  La colonna "role" non esiste ancora.')
    console.log('   Esegui questa SQL nel tuo Supabase Dashboard prima di continuare:\n')
    console.log('   ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT \'limited\'')
    console.log('   CHECK (role IN (\'admin\', \'viewer\', \'limited\'));\n')
    process.exit(1)
  }

  const credentials: { username: string; password: string; role: string }[] = []

  for (const user of USERS) {
    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id, username')
      .eq('username', user.username)
      .single()

    if (existing) {
      console.log(`⏭  "${user.username}" esiste già, skip.`)
      continue
    }

    const plainPassword = genPassword()
    const hashedPassword = await bcrypt.hash(plainPassword, 12)

    const { error } = await supabase.from('users').insert({
      username: user.username,
      password: hashedPassword,
      role: user.role,
    })

    if (error) {
      console.error(`✗  Errore creando "${user.username}":`, error.message)
    } else {
      credentials.push({ username: user.username, password: plainPassword, role: user.role })
      console.log(`✓  Creato "${user.username}" (${user.role})`)
    }
  }

  if (credentials.length > 0) {
    console.log('\n=== CREDENZIALI GENERATE (salvale ora!) ===\n')
    credentials.forEach(c => {
      console.log(`  ${c.username.padEnd(12)} ${c.role.padEnd(10)}  password: ${c.password}`)
    })
    console.log('\n⚠️  Queste password non verranno mostrate di nuovo.\n')
  } else {
    console.log('\nNessun nuovo utente creato.\n')
  }
}

main().catch(console.error)
