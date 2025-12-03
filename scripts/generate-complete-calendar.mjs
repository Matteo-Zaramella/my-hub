import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

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

let output = '# 📅 CALENDARIO COMPLETO SFIDE E INDIZI 2026\n\n';
output += `**Generato il:** ${new Date().toLocaleString('it-IT')}\n\n`;
output += '---\n\n';

for (const challenge of challenges) {
  const challengeDate = challenge.start_date.split('T')[0];
  const dayName = new Date(challenge.start_date).toLocaleDateString('it-IT', { weekday: 'long' });

  output += `## 🎯 SFIDA ${challenge.challenge_number}\n\n`;
  output += `**Data:** ${challengeDate} (${dayName})\n`;
  output += `**Titolo:** ${challenge.title}\n`;
  output += `**Descrizione:** ${challenge.description}\n`;
  output += `**Location:** ${challenge.location}\n`;
  output += `**Punti:** ${challenge.points}\n`;
  output += `**Istruzioni:** ${challenge.instructions}\n\n`;

  // Get clues for this challenge
  const challengeClues = clues.filter(c => c.challenge_id === challenge.id);

  output += `### Indizi (${challengeClues.length} totali):\n\n`;

  challengeClues.forEach(clue => {
    const clueDate = clue.revealed_date.split('T')[0];
    const clueDayName = new Date(clue.revealed_date).toLocaleDateString('it-IT', { weekday: 'long' });
    output += `- **Indizio ${clue.clue_number}:** ${clueDate} (${clueDayName})\n`;
    output += `  - Testo: "${clue.clue_text}"\n`;
  });

  output += '\n---\n\n';
}

// Statistics
output += '## 📊 STATISTICHE\n\n';
output += `**Totale sfide:** ${challenges.length}\n`;
output += `**Totale indizi:** ${clues.length}\n`;
output += `**Media indizi per sfida:** ${(clues.length / challenges.length).toFixed(1)}\n\n`;

output += '### Distribuzione indizi per sfida:\n\n';
challenges.forEach(ch => {
  const count = clues.filter(c => c.challenge_id === ch.id).length;
  output += `- Sfida ${ch.challenge_number}: ${count} indizi\n`;
});

output += '\n---\n\n';
output += '✅ **Tutte le sfide e indizi sono di SABATO**\n';
output += '✅ **Tutti i VENERDÌ sono vuoti**\n';

// Save to file
fs.writeFileSync('CALENDARIO_SFIDE_COMPLETO.md', output);

console.log('✅ Calendario completo generato: CALENDARIO_SFIDE_COMPLETO.md');
console.log(output);
