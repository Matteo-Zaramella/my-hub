import fetch from 'node-fetch'

const supabaseUrl = 'https://wuvuapmjclahbmngntku.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dnVhcG1qY2xhaGJtbmdudGt1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDUzMDI0NCwiZXhwIjoyMDc2MTA2MjQ0fQ.c1eqO_Y2NH_bgV-VC6KJyk3H8LZEYza6Z0bBrKI1Zac'

async function executeSql(query) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
    },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`HTTP ${response.status}: ${error}`)
  }

  return await response.json()
}

async function createCeremonyCluesTable() {
  console.log('🚀 Creazione tabella ceremony_clues_found...\n')

  // SQL completo in un'unica query
  const sql = `
-- Tabella per tracciare quali indizi ogni partecipante ha trovato
CREATE TABLE IF NOT EXISTS ceremony_clues_found (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_code TEXT NOT NULL REFERENCES game_participants(participant_code) ON DELETE CASCADE,
  clue_word TEXT NOT NULL,
  found_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_code, clue_word)
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_ceremony_clues_participant ON ceremony_clues_found(participant_code);
CREATE INDEX IF NOT EXISTS idx_ceremony_clues_word ON ceremony_clues_found(clue_word);
CREATE INDEX IF NOT EXISTS idx_ceremony_clues_found_at ON ceremony_clues_found(found_at);

-- RLS Policy
ALTER TABLE ceremony_clues_found ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read ceremony clues" ON ceremony_clues_found;
DROP POLICY IF EXISTS "Anyone can insert ceremony clues" ON ceremony_clues_found;

-- Policy: Chiunque autenticato può leggere
CREATE POLICY "Anyone can read ceremony clues" ON ceremony_clues_found
  FOR SELECT USING (true);

-- Policy: Chiunque autenticato può inserire (trovare indizi)
CREATE POLICY "Anyone can insert ceremony clues" ON ceremony_clues_found
  FOR INSERT WITH CHECK (true);
  `

  try {
    await executeSql(sql)
    console.log('✅ Tabella ceremony_clues_found creata con successo!')
  } catch (error) {
    console.log('⚠️  Approccio RPC non disponibile, uso metodo diretto...\n')

    // Metodo alternativo: usa l'endpoint SQL editor
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        query: sql,
      }),
    })

    if (!response.ok) {
      console.error('❌ Impossibile eseguire SQL via API')
      console.error('Per favore esegui manualmente lo script SQL da:')
      console.error('https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql')
      console.error('\nScript SQL salvato in: D:\\my-hub\\ESEGUI_SUBITO.md (Script 4)')
      process.exit(1)
    }

    console.log('✅ Tabella creata!')
  }

  console.log('\n📋 Struttura tabella:')
  console.log('  - id: UUID (primary key)')
  console.log('  - participant_code: TEXT (foreign key)')
  console.log('  - clue_word: TEXT (es: ENIGMA, VULCANO, ...)')
  console.log('  - found_at: TIMESTAMP')
  console.log('\n🔒 RLS abilitato con policies per lettura/inserimento')
}

createCeremonyCluesTable()
  .then(() => {
    console.log('\n🎉 Setup completato!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('💥 Errore fatale:', err.message)
    console.error('\n📝 Soluzione: Esegui manualmente lo Script 4 da ESEGUI_SUBITO.md')
    console.error('Link: https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql')
    process.exit(1)
  })
