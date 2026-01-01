import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wuvuapmjclahbmngntku.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dnVhcG1qY2xhaGJtbmdudGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzAyNDQsImV4cCI6MjA3NjEwNjI0NH0.12asA4yGSUdP_zkfGGZyv7vOX6Ncq9GhkIpBD1tcscc'
);

async function main() {
  const email = 'matteo.zaramella2002@gmail.com';

  console.log(`Deleting participant with email: ${email}`);

  // Delete from game_participants
  const { data, error } = await supabase
    .from('game_participants')
    .delete()
    .eq('email', email)
    .select();

  if (error) {
    console.error('Error deleting:', error);
  } else {
    console.log('Deleted:', data);
  }

  // Also delete any OTP codes
  const { error: otpError } = await supabase
    .from('otp_codes')
    .delete()
    .eq('email', email);

  if (otpError) {
    console.log('OTP delete error (may not exist):', otpError.message);
  } else {
    console.log('OTP codes cleaned');
  }

  // Verify deletion
  const { data: check } = await supabase
    .from('game_participants')
    .select('*')
    .eq('email', email);

  console.log('Remaining (should be empty):', check);
}

main();
