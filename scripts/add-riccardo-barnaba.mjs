import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

// Genera codice univoco 8 caratteri
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function addParticipant() {
  const code = generateCode();

  const participant = {
    participant_name: 'RICCARDO',
    email: 'riccardobarnaba13@gmail.com',
    participant_code: code
  };

  console.log('Aggiunta partecipante:');
  console.log('  Nome:', participant.participant_name);
  console.log('  Email:', participant.email);
  console.log('  Codice:', participant.participant_code);
  console.log('');

  const { data, error } = await supabase
    .from('game_participants')
    .insert([participant])
    .select();

  if (error) {
    console.error('ERRORE:', error.message);
    return null;
  }

  console.log('Partecipante aggiunto con successo!');
  console.log('ID:', data[0].id);
  console.log('');
  console.log('='.repeat(40));
  console.log('CODICE DA COMUNICARE: ' + code);
  console.log('='.repeat(40));

  return data[0];
}

addParticipant();
