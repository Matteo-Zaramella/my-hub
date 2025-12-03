import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Get all challenges
const { data: challenges } = await supabase
  .from('game_challenges')
  .select('*')
  .order('challenge_number');

// Get all clues
const { data: clues } = await supabase
  .from('game_clues')
  .select('*')
  .order('revealed_date');

console.log('🔍 VERIFICA GIORNI DELLA SETTIMANA\n');
console.log('=' .repeat(80));
console.log('\n');

let hasErrors = false;

for (const challenge of challenges) {
  const challengeDate = new Date(challenge.start_date);
  const dayOfWeek = challengeDate.getDay(); // 0 = Sunday, 6 = Saturday
  const dayName = challengeDate.toLocaleDateString('it-IT', { weekday: 'long' });

  console.log(`\n📌 SFIDA ${challenge.challenge_number} - ${challenge.start_date.split('T')[0]} (${dayName})`);

  if (dayOfWeek !== 6) {
    console.log(`   ❌ ERRORE: La sfida è di ${dayName}, non sabato!`);
    hasErrors = true;
  } else {
    console.log(`   ✅ OK: Sfida di sabato`);
  }

  // Get clues for this challenge
  const challengeClues = clues.filter(c => c.challenge_id === challenge.id);

  console.log(`\n   Indizi (${challengeClues.length} totali):`);

  challengeClues.forEach(clue => {
    const clueDate = new Date(clue.revealed_date);
    const clueDayOfWeek = clueDate.getDay();
    const clueDayName = clueDate.toLocaleDateString('it-IT', { weekday: 'long' });
    const dateStr = clue.revealed_date.split('T')[0];

    if (clueDayOfWeek !== 6) {
      console.log(`   ❌ Indizio ${clue.clue_number}: ${dateStr} (${clueDayName}) - NON È SABATO!`);
      hasErrors = true;
    } else {
      console.log(`   ✅ Indizio ${clue.clue_number}: ${dateStr} (${clueDayName})`);
    }
  });

  console.log('');
}

console.log('\n' + '='.repeat(80));

if (hasErrors) {
  console.log('\n❌ TROVATI ERRORI: Alcune date NON sono sabato!');
} else {
  console.log('\n✅ TUTTO OK: Tutte le sfide e gli indizi sono di sabato!');
}

// Check for Fridays
console.log('\n\n🔍 VERIFICA VENERDÌ VUOTI\n');
console.log('=' .repeat(80));

const allDates = new Set();
challenges.forEach(ch => allDates.add(ch.start_date.split('T')[0]));
clues.forEach(cl => allDates.add(cl.revealed_date.split('T')[0]));

// Generate all Fridays from Feb to Dec 2026
const fridays = [];
const start = new Date('2026-02-06'); // First Friday
const end = new Date('2026-12-31');

let current = new Date(start);
while (current <= end) {
  const dateStr = current.toISOString().split('T')[0];
  fridays.push(dateStr);
  current.setDate(current.getDate() + 7);
}

console.log(`\nTotale venerdì (Feb-Dic 2026): ${fridays.length}`);

const fridaysWithData = fridays.filter(f => allDates.has(f));

if (fridaysWithData.length > 0) {
  console.log(`\n❌ TROVATI ${fridaysWithData.length} venerdì con indizi/sfide:`);
  fridaysWithData.forEach(f => console.log(`   - ${f}`));
} else {
  console.log('\n✅ PERFETTO: Tutti i venerdì sono vuoti!');
}
