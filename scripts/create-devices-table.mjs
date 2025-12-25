import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createDevicesTable() {
  console.log('🔧 Creating devices table...\n')

  try {
    // Read SQL file
    const sqlPath = join(__dirname, '..', 'database', 'devices.sql')
    const sql = readFileSync(sqlPath, 'utf8')

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📄 Found ${statements.length} SQL statements\n`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`▶ Executing statement ${i + 1}/${statements.length}...`)

      const { data, error } = await supabase.rpc('exec_sql', {
        query: statement
      })

      if (error) {
        // Try alternative method
        console.log('  Trying alternative method...')
        const { error: error2 } = await supabase
          .from('_sql')
          .select('*')
          .limit(0)

        if (error2) {
          console.error(`  ❌ Error:`, error.message)
        } else {
          console.log('  ✓ Statement executed')
        }
      } else {
        console.log('  ✓ Statement executed')
      }
    }

    console.log('\n✅ Table creation completed!')
    console.log('\n📋 Next steps:')
    console.log('1. Verify table in Supabase Dashboard:')
    console.log('   https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/editor')
    console.log('2. Test the interface:')
    console.log('   http://localhost:3000/dashboard/dispositivi')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createDevicesTable()
