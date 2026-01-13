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

const item = {
  nome: 'Flipper Zero',
  descrizione: 'Multi-tool portatile per pentesting: NFC, RFID, Sub-GHz, Infrarossi, GPIO',
  link: 'https://flipper.net/products/flipper-zero',
  prezzo: 185.00,
  priorita: 'media',
  pubblico: true,
  categoria: 'tech'
}

async function addItem() {
  const { data: existing } = await supabase
    .from('wishlist_items')
    .select('id, nome')
    .eq('nome', item.nome)
    .single()

  if (existing) {
    console.log(`⏭️  "${item.nome}" already exists`)
    return
  }

  const { data, error } = await supabase
    .from('wishlist_items')
    .insert(item)
    .select()

  if (error) {
    console.error(`❌ Error:`, error.message)
  } else {
    console.log(`✅ Added: ${item.nome} - €${item.prezzo}`)
  }
}

addItem()
