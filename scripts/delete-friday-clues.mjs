import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log('🗑️  ELIMINAZIONE INDIZI DI VENERDÌ\n');

// Get all clues
const { data: clues } = await supabase
  .from('game_clues')
  .select('*')
  .order('revealed_date');

const fridayClues = [];

for (const clue of clues) {
  const clueDate = new Date(clue.revealed_date);
  const dayOfWeek = clueDate.getDay();

  if (dayOfWeek === 5) { // Friday
    fridayClues.push(clue);
    console.log(`Indizio ${clue.id}: ${clue.revealed_date.split('T')[0]} (challenge ${clue.challenge_id})`);
  }
}

console.log(`\nTotale indizi di venerdì da eliminare: ${fridayClues.length}`);
console.log('\nProcedo con l\'eliminazione...\n');

for (const clue of fridayClues) {
  await supabase
    .from('game_clues')
    .delete()
    .eq('id', clue.id);

  console.log(`✅ Eliminato indizio ${clue.id}`);
}

console.log(`\n✅ Eliminati ${fridayClues.length} indizi di venerdì!`);
console.log('\nOra bisognerà rinumerare gli indizi rimasti...');
