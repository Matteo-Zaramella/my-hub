import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Generate all Saturdays from Feb to Dec 2026
const saturdays = [];
const start = new Date('2026-02-07');
const end = new Date('2026-12-31');

let current = new Date(start);
while (current <= end) {
  const dateStr = current.toISOString().split('T')[0];
  saturdays.push(dateStr);
  current.setDate(current.getDate() + 7);
}

console.log('📅 Totale sabati Feb-Dic 2026:', saturdays.length);

// Get existing clues
const { data: existingClues } = await supabase
  .from('game_clues')
  .select('revealed_date');

const existingDates = new Set(existingClues.map(c => c.revealed_date.split('T')[0]));

// Find missing Saturdays
const missingSaturdays = saturdays.filter(s => !existingDates.has(s));

console.log('Sabati mancanti:', missingSaturdays.length);
console.log('\nSabati da riempire:');
missingSaturdays.forEach(s => console.log('  -', s));

// Get challenges to assign clues
const { data: challenges } = await supabase
  .from('game_challenges')
  .select('id, challenge_number, start_date')
  .order('challenge_number');

console.log('\n🔨 Assegnazione indizi ai sabati mancanti...\n');

// For each missing Saturday, find which challenge it belongs to
const newClues = [];

for (const saturday of missingSaturdays) {
  const satDate = new Date(saturday + 'T00:00:00');

  // Find the challenge this Saturday belongs to (the next challenge after this date)
  let assignedChallenge = null;

  for (let i = 0; i < challenges.length; i++) {
    const challengeDate = new Date(challenges[i].start_date);

    if (satDate <= challengeDate) {
      assignedChallenge = challenges[i];
      break;
    }
  }

  // If no challenge found (after last challenge), assign to last challenge
  if (!assignedChallenge) {
    assignedChallenge = challenges[challenges.length - 1];
  }

  // Get current max clue_number for this challenge
  const { data: existingChallengeClues } = await supabase
    .from('game_clues')
    .select('clue_number')
    .eq('challenge_id', assignedChallenge.id)
    .order('clue_number', { ascending: false })
    .limit(1);

  const nextClueNumber = existingChallengeClues.length > 0
    ? existingChallengeClues[0].clue_number + 1
    : 1;

  newClues.push({
    challenge_id: assignedChallenge.id,
    clue_number: nextClueNumber,
    clue_text: `Indizio ${nextClueNumber} per Sfida ${assignedChallenge.challenge_number}`,
    revealed_date: saturday + 'T00:00:00'
  });

  console.log(`${saturday} → Sfida ${assignedChallenge.challenge_number} (Indizio ${nextClueNumber})`);
}

console.log('\n💾 Inserimento indizi nel database...');

// Insert all new clues
const { data, error } = await supabase
  .from('game_clues')
  .insert(newClues);

if (error) {
  console.error('❌ Errore:', error);
} else {
  console.log(`✅ Aggiunti ${newClues.length} nuovi indizi!`);
}
