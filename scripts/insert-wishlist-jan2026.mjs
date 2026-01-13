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

const newItems = [
  {
    nome: 'Gigaset PURE 120A Duo',
    descrizione: 'Telefono cordless con segreteria, due cornette',
    link: 'https://www.amazon.it/s?k=Gigaset+PURE+120A+Duo',
    prezzo: 60.00,
    priorita: 'media',
    pubblico: true,
    categoria: 'elettrodomestici'
  },
  {
    nome: 'Nothing Phone 3',
    descrizione: 'Smartphone Nothing Phone 3 - Bianco, 16GB RAM, 512GB Storage',
    link: 'https://nothing.tech',
    prezzo: 800.00,
    priorita: 'alta',
    pubblico: true,
    categoria: 'tech'
  },
  {
    nome: 'Scaldacollo Invernale',
    descrizione: 'Scaldacollo termico per inverno',
    link: 'https://www.amazon.it/s?k=scaldacollo+invernale',
    prezzo: 25.00,
    priorita: 'media',
    pubblico: true,
    categoria: 'vestiti'
  },
  {
    nome: 'Coprigambe Impermeabile Bici',
    descrizione: 'Protezione impermeabile per gambe durante tragitto in bici',
    link: 'https://www.amazon.it/s?k=coprigambe+impermeabile+bici',
    prezzo: 45.00,
    priorita: 'alta',
    pubblico: true,
    categoria: 'bici'
  },
  {
    nome: 'Calzini Lunghi Taglia 47/50',
    descrizione: 'Pack calzini lunghi per taglie grandi 47-50',
    link: 'https://www.amazon.it/s?k=calzini+lunghi+47+50',
    prezzo: 30.00,
    priorita: 'media',
    pubblico: true,
    categoria: 'vestiti'
  }
]

async function insertWishlistItems() {
  console.log('🛒 Inserting new wishlist items...\n')

  for (const item of newItems) {
    // Check if item already exists
    const { data: existing } = await supabase
      .from('wishlist_items')
      .select('id, nome')
      .eq('nome', item.nome)
      .single()

    if (existing) {
      console.log(`⏭️  "${item.nome}" already exists, skipping...`)
      continue
    }

    const { data, error } = await supabase
      .from('wishlist_items')
      .insert(item)
      .select()

    if (error) {
      console.error(`❌ Error inserting "${item.nome}":`, error.message)
    } else {
      console.log(`✅ Added: ${item.nome} (${item.categoria}) - €${item.prezzo}`)
    }
  }

  console.log('\n🎉 Done!')
}

insertWishlistItems()
