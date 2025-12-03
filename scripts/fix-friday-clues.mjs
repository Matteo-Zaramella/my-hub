import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log('🔧 CORREZIONE INDIZI DI VENERDÌ\n');
console.log('Sposto tutti i venerdì al sabato successivo (+1 giorno)\n');

// Get all clues
const { data: clues } = await supabase
  .from('game_clues')
  .select('*')
  .order('revealed_date');

let fixedCount = 0;

for (const clue of clues) {
  const clueDate = new Date(clue.revealed_date);
  const dayOfWeek = clueDate.getDay();

  if (dayOfWeek === 5) { // Friday
    // Add 1 day to make it Saturday
    clueDate.setDate(clueDate.getDate() + 1);
    const newDateStr = clueDate.toISOString().split('T')[0] + 'T00:00:00';

    console.log(`Indizio ${clue.id}: ${clue.revealed_date.split('T')[0]} (venerdì) → ${newDateStr.split('T')[0]} (sabato)`);

    await supabase
      .from('game_clues')
      .update({ revealed_date: newDateStr })
      .eq('id', clue.id);

    fixedCount++;
  }
}

console.log(`\n✅ Corretti ${fixedCount} indizi da venerdì a sabato!`);
