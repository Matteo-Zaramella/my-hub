import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function applyMigration() {
  console.log('Applying wishlist category migration...')

  const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251127_add_wishlist_categories.sql')
  const sql = readFileSync(migrationPath, 'utf8')

  // Split by semicolon and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('COMMENT'))

  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement })
      if (error) {
        console.error('Error executing statement:', error)
        console.log('Statement was:', statement)
      } else {
        console.log('✓ Executed successfully')
      }
    } catch (err) {
      console.error('Exception:', err)
    }
  }

  console.log('Migration completed!')
}

applyMigration()
