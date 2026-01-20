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
  nome: '1Password Families',
  descrizione: 'Gestore password per famiglie. Fino a 5 membri, vault condivisi illimitati, autenticazione 2FA, Watchtower per sicurezza password. Disponibile su tutti i dispositivi e browser.',
  link: 'https://1password.com/it/pricing/password-manager',
  prezzo: 51.72,
  priorita: 'alta',
  pubblico: true,
  categoria: 'software',
  immagine_url: '/wishlist-products/1password-families.png'
}

async function insertItem() {
  console.log('Inserting 1Password Families...\n')

  const { data: existing } = await supabase
    .from('wishlist_items')
    .select('id, nome')
    .eq('nome', item.nome)
    .single()

  if (existing) {
    console.log(`"${item.nome}" already exists, skipping...`)
    return
  }

  const { data, error } = await supabase
    .from('wishlist_items')
    .insert(item)
    .select()

  if (error) {
    console.error(`Error inserting "${item.nome}":`, error.message)
  } else {
    console.log(`Added: ${item.nome} (${item.categoria}) - EUR ${item.prezzo}/anno`)
    console.log('Image:', item.immagine_url)
  }

  console.log('\nDone!')
}

insertItem()
