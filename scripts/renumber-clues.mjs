import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log('🔢 Rinumerazione indizi per sfida...\n');

// Get all challenges
const { data: challenges } = await supabase
  .from('game_challenges')
  .select('id, challenge_number')
  .order('challenge_number');

for (const challenge of challenges) {
  // Get all clues for this challenge, ordered by date
  const { data: clues } = await supabase
    .from('game_clues')
    .select('id, revealed_date')
    .eq('challenge_id', challenge.id)
    .order('revealed_date');

  console.log(`Sfida ${challenge.challenge_number}: ${clues.length} indizi`);

  // Renumber them sequentially
  for (let i = 0; i < clues.length; i++) {
    const newNumber = i + 1;

    await supabase
      .from('game_clues')
      .update({
        clue_number: newNumber,
        clue_text: `Indizio ${newNumber} per Sfida ${challenge.challenge_number}`
      })
      .eq('id', clues[i].id);

    console.log(`  - ID ${clues[i].id}: ${clues[i].revealed_date.split('T')[0]} → Indizio ${newNumber}`);
  }
  console.log('');
}

console.log('✅ Rinumerazione completata!');
