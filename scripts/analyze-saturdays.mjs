import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Get challenges with dates
const { data: challenges } = await supabase
  .from('game_challenges')
  .select('id, challenge_number, start_date')
  .order('challenge_number');

// Get all clues
const { data: clues } = await supabase
  .from('game_clues')
  .select('challenge_id, clue_number, revealed_date')
  .order('revealed_date');

console.log('📊 STATO ATTUALE INDIZI PER SFIDA:\n');

challenges.forEach(ch => {
  const challengeClues = clues.filter(c => c.challenge_id === ch.id);
  const startDate = ch.start_date.split('T')[0];
  console.log(`Sfida ${ch.challenge_number} (${startDate}):`);
  console.log(`  Indizi totali: ${challengeClues.length}`);
  challengeClues.forEach(cl => {
    const date = cl.revealed_date.split('T')[0];
    const dayOfWeek = new Date(date + 'T12:00:00').toLocaleDateString('it-IT', { weekday: 'long' });
    console.log(`    - Indizio ${cl.clue_number}: ${date} (${dayOfWeek})`);
  });
  console.log('');
});

// Generate all Saturdays from Feb to Dec 2026
console.log('\n📅 ANALISI SABATI 2026\n');
const saturdays = [];
const start = new Date('2026-02-07'); // First Saturday after opening
const end = new Date('2026-12-31');

let current = new Date(start);
while (current <= end) {
  const dateStr = current.toISOString().split('T')[0];
  saturdays.push(dateStr);
  current.setDate(current.getDate() + 7);
}

const existingDates = new Set(clues.map(c => c.revealed_date.split('T')[0]));
const missingSaturdays = saturdays.filter(s => !existingDates.has(s));

console.log('Totale sabati (Feb-Dic):', saturdays.length);
console.log('Sabati con indizi/sfide:', saturdays.length - missingSaturdays.length);
console.log('Sabati VUOTI:', missingSaturdays.length);

if (missingSaturdays.length > 0) {
  console.log('\n⚠️ Sabati da riempire:');
  missingSaturdays.forEach(s => console.log('  -', s));
}
