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

async function checkWishlistItems() {
  console.log('🔍 Checking wishlist items...\n')

  // Query tutti gli articoli
  const { data: allItems, error: allError } = await supabase
    .from('wishlist_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (allError) {
    console.error('Error fetching items:', allError)
    process.exit(1)
  }

  console.log(`📊 Total items in database: ${allItems.length}\n`)

  // Raggruppa per categoria
  const byCategory = allItems.reduce((acc, item) => {
    const cat = item.categoria || 'null'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  console.log('📂 Items by category:')
  Object.entries(byCategory).forEach(([cat, items]) => {
    console.log(`\n  ${cat}: ${items.length} items`)
    items.forEach(item => {
      console.log(`    - ${item.nome}`)
      console.log(`      ID: ${item.id}`)
      console.log(`      User: ${item.user_id}`)
      console.log(`      Pubblico: ${item.pubblico}`)
      console.log(`      Categoria: ${item.categoria}`)
      if (item.colori_disponibili) {
        console.log(`      Colori: ${item.colori_disponibili.length} varianti`)
      }
    })
  })

  // Verifica articoli vestiti specificamente
  console.log('\n\n👕 Checking clothing items specifically:')
  const { data: vestiti, error: vestitiError } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('categoria', 'vestiti')

  if (vestitiError) {
    console.error('Error fetching clothing items:', vestitiError)
  } else {
    console.log(`  Found ${vestiti.length} clothing items`)
    vestiti.forEach(item => {
      console.log(`\n  ✓ ${item.nome}`)
      console.log(`    Pubblico: ${item.pubblico}`)
      console.log(`    Categoria: ${item.categoria}`)
      console.log(`    Colori: ${item.colori_disponibili?.length || 0}`)
    })
  }

  // Verifica articoli pubblici
  console.log('\n\n🌍 Checking public items:')
  const { data: pubblici, error: pubbliciError } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('pubblico', true)

  if (pubbliciError) {
    console.error('Error fetching public items:', pubbliciError)
  } else {
    console.log(`  Found ${pubblici.length} public items`)
    pubblici.forEach(item => {
      console.log(`    - ${item.nome} (${item.categoria || 'no category'})`)
    })
  }

  console.log('\n✅ Check complete!\n')
}

checkWishlistItems()
