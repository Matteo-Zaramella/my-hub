#!/usr/bin/env node

/**
 * Setup automatico per Claude Code
 * Questo script configura automaticamente il progetto my-hub
 */

const fs = require('fs');
const path = require('path');

console.log('🤖 Claude Code - Setup Automatico My Hub\n');

// Credenziali Supabase
const SUPABASE_URL = 'https://wuvuapmjclahbmngntku.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dnVhcG1qY2xhaGJtbmdudGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzAyNDQsImV4cCI6MjA3NjEwNjI0NH0.12asA4yGSUdP_zkfGGZyv7vOX6Ncq9GhkIpBD1tcscc';

// Crea .env.local
const envContent = `NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
`;

const envPath = path.join(__dirname, '.env.local');

try {
  if (fs.existsSync(envPath)) {
    console.log('✓ .env.local già esistente');
  } else {
    fs.writeFileSync(envPath, envContent);
    console.log('✓ .env.local creato con successo');
  }

  console.log('\n📦 Informazioni progetto:');
  console.log(`   - Database: Supabase (${SUPABASE_URL})`);
  console.log(`   - Repository: https://github.com/Matteo-Zaramella/my-hub`);
  console.log(`   - Server locale: http://localhost:3000`);

  console.log('\n✅ Setup completato!');
  console.log('\n🚀 Prossimi passi:');
  console.log('   1. npm run dev    # Avvia il server');
  console.log('   2. Apri Claude Code e digita: "continua il progetto my-hub"');
  console.log('\n💡 Claude avrà accesso completo al codice e database tramite MCP\n');

} catch (error) {
  console.error('❌ Errore durante il setup:', error.message);
  process.exit(1);
}
