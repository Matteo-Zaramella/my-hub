import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
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

async function setupMaintenanceMode() {
  console.log('🔧 Setting up maintenance mode...\n')

  // Check if game_settings table exists
  const { data: tables, error: tablesError } = await supabase
    .from('game_settings')
    .select('id')
    .limit(1)

  if (tablesError) {
    console.log('⚠️  game_settings table does not exist. Creating...')
    console.log('\n📝 Please run this SQL in Supabase SQL Editor:\n')
    console.log(`
CREATE TABLE IF NOT EXISTS game_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  ceremony_active BOOLEAN DEFAULT FALSE,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default row
INSERT INTO game_settings (id, ceremony_active, maintenance_mode)
VALUES (1, false, false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE game_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read settings
CREATE POLICY "Everyone can read game_settings"
ON game_settings FOR SELECT
TO public
USING (true);

-- Policy: Only authenticated users can update
CREATE POLICY "Authenticated users can update game_settings"
ON game_settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
    `)
    console.log('\n✅ After running the SQL, run this script again.\n')
    process.exit(0)
  }

  // Check if maintenance_mode column exists
  const { data: settings, error: settingsError } = await supabase
    .from('game_settings')
    .select('maintenance_mode')
    .eq('id', 1)
    .single()

  if (settingsError && settingsError.code === 'PGRST116') {
    // No row exists, create it
    console.log('Creating default game_settings row...')
    const { error: insertError } = await supabase
      .from('game_settings')
      .insert({ id: 1, ceremony_active: false, maintenance_mode: false })

    if (insertError) {
      console.error('❌ Error creating default row:', insertError.message)
      process.exit(1)
    }
    console.log('✅ Default row created\n')
  } else if (settingsError) {
    console.log('⚠️  maintenance_mode column does not exist. Adding...')
    console.log('\n📝 Please run this SQL in Supabase SQL Editor:\n')
    console.log(`
ALTER TABLE game_settings
ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT FALSE;

UPDATE game_settings SET maintenance_mode = false WHERE id = 1;
    `)
    console.log('\n✅ After running the SQL, the setup is complete.\n')
    process.exit(0)
  }

  console.log('✅ Maintenance mode is already set up!')
  console.log(`   Current status: ${settings.maintenance_mode ? 'ACTIVE 🔴' : 'INACTIVE 🟢'}`)
  console.log('\n💡 You can toggle it from the Game Management dashboard.\n')
}

setupMaintenanceMode()
