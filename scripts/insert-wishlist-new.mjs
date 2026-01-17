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
    nome: 'Nothing Cable (c-c) 180cm',
    descrizione: 'Cavo USB-C ricarica rapida 60W, trasferimento dati 480 Mbps, design trasparente, resistente a 16.000+ piegamenti. ESAURITO - promemoria acquisto futuro',
    link: 'https://it.nothing.tech/products/cable?Lunghezza=180+cm',
    prezzo: 19.00,
    priorita: 'media',
    pubblico: true,
    categoria: 'tech'
  },
  {
    nome: 'Nothing Power (45W) Bianco',
    descrizione: 'Caricabatterie 45W PD 3.0, USB-C, 65% carica in 30 min per telefoni Nothing. Compatibile PD3.0, QC4.0+, QC3.0, QC2.0, PPS. ESAURITO - promemoria acquisto futuro',
    link: 'https://it.nothing.tech/products/power-45w?Colore=bianco',
    prezzo: 35.00,
    priorita: 'media',
    pubblico: true,
    categoria: 'tech'
  },
  {
    nome: 'Bitdefender Ultimate Security Family',
    descrizione: 'Suite sicurezza completa: antimalware, VPN illimitato, password manager, protezione identità digitale, monitoraggio dark web. 5 account, 25 dispositivi. Windows, macOS, Android, iOS.',
    link: 'https://www.bitdefender.com/it-it/consumer/ultimate-security',
    prezzo: 100.00,
    priorita: 'alta',
    pubblico: true,
    categoria: 'software'
  }
]

async function insertWishlistItems() {
  console.log('Inserting new wishlist items...\n')

  for (const item of newItems) {
    const { data: existing } = await supabase
      .from('wishlist_items')
      .select('id, nome')
      .eq('nome', item.nome)
      .single()

    if (existing) {
      console.log(`"${item.nome}" already exists, skipping...`)
      continue
    }

    const { data, error } = await supabase
      .from('wishlist_items')
      .insert(item)
      .select()

    if (error) {
      console.error(`Error inserting "${item.nome}":`, error.message)
    } else {
      console.log(`Added: ${item.nome} (${item.categoria}) - EUR ${item.prezzo}`)
    }
  }

  console.log('\nDone!')
}

insertWishlistItems()
