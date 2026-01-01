import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wuvuapmjclahbmngntku.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dnVhcG1qY2xhaGJtbmdudGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzAyNDQsImV4cCI6MjA3NjEwNjI0NH0.12asA4yGSUdP_zkfGGZyv7vOX6Ncq9GhkIpBD1tcscc'
);

async function main() {
  console.log('Checking chat_messages...');
  const { data, error } = await supabase
    .from('game_chat_messages')
    .select('*');

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Messages:', data);
    console.log('Total:', data?.length || 0);
  }
}

main();
