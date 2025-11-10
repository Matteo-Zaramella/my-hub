/**
 * Backup Script for The Game Database
 *
 * This script exports all game data to JSON files that can be uploaded to Google Drive
 * Run with: node scripts/backup_game_data.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function backupGameData() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const backupDir = path.join(__dirname, '..', 'backups', timestamp)

  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  console.log(`🔄 Starting backup to: ${backupDir}`)

  try {
    // Backup game configuration
    console.log('📋 Backing up game configuration...')
    const { data: config } = await supabase.from('game_prize_config').select('*')
    fs.writeFileSync(
      path.join(backupDir, 'game_config.json'),
      JSON.stringify(config, null, 2)
    )

    // Backup challenges
    console.log('🎯 Backing up challenges...')
    const { data: challenges } = await supabase
      .from('game_challenges')
      .select('*')
      .order('challenge_number')
    fs.writeFileSync(
      path.join(backupDir, 'challenges.json'),
      JSON.stringify(challenges, null, 2)
    )

    // Backup clues
    console.log('🔍 Backing up clues...')
    const { data: clues } = await supabase
      .from('game_clues')
      .select('*')
      .order('challenge_id, clue_number')
    fs.writeFileSync(
      path.join(backupDir, 'clues.json'),
      JSON.stringify(clues, null, 2)
    )

    // Backup participants
    console.log('👥 Backing up participants...')
    const { data: participants } = await supabase
      .from('game_participants')
      .select('*')
      .order('participant_name')
    fs.writeFileSync(
      path.join(backupDir, 'participants.json'),
      JSON.stringify(participants, null, 2)
    )

    // Backup scores
    console.log('📊 Backing up scores...')
    const { data: scores } = await supabase
      .from('game_user_scores')
      .select('*')
      .order('points', { ascending: false })
    fs.writeFileSync(
      path.join(backupDir, 'scores.json'),
      JSON.stringify(scores, null, 2)
    )

    // Create summary
    const summary = {
      backup_date: new Date().toISOString(),
      backup_timestamp: timestamp,
      statistics: {
        total_challenges: challenges?.length || 0,
        total_clues: clues?.length || 0,
        total_participants: participants?.length || 0,
        total_scores: scores?.length || 0,
      },
      google_drive_folder: 'https://drive.google.com/drive/folders/1MvL5PGHxjR66SqkPqIalhlfM-YkidU69'
    }

    fs.writeFileSync(
      path.join(backupDir, 'backup_summary.json'),
      JSON.stringify(summary, null, 2)
    )

    console.log('✅ Backup completed successfully!')
    console.log(`📁 Files saved to: ${backupDir}`)
    console.log('\n📤 Upload these files to Google Drive:')
    console.log('   https://drive.google.com/drive/folders/1MvL5PGHxjR66SqkPqIalhlfM-YkidU69')
    console.log('\nSummary:')
    console.log(`   - Challenges: ${summary.statistics.total_challenges}`)
    console.log(`   - Clues: ${summary.statistics.total_clues}`)
    console.log(`   - Participants: ${summary.statistics.total_participants}`)
    console.log(`   - Scores: ${summary.statistics.total_scores}`)

  } catch (error) {
    console.error('❌ Backup failed:', error)
    process.exit(1)
  }
}

// Run backup
backupGameData()
