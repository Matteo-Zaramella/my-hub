# Import Game Participants

## Overview
This directory contains the script to import the initial 53 participants for The Game.

## Files
- `import_participants.py` - Python script that generates SQL INSERT statements with unique codes

## How to Use

### Option 1: Generate SQL File (Recommended)
1. First, get your user ID from Supabase:
   - Go to https://supabase.com/dashboard
   - Navigate to Authentication > Users
   - Copy your User ID (UUID format)

2. Run the Python script and save output:
   ```bash
   cd D:\my-hub\scripts
   python import_participants.py > participants_import.sql
   ```

3. Edit `participants_import.sql` and replace `YOUR_USER_ID_HERE` with your actual UUID

4. Execute the SQL via Supabase dashboard:
   - Go to SQL Editor
   - Paste the SQL statements
   - Click "Run"

### Option 2: Direct Import via Participants Management Page
Alternatively, you can manually add participants through the web interface:
1. Navigate to `/dashboard/game-management/participants`
2. Click "Aggiungi Partecipante"
3. Fill in the details for each participant
4. The system will auto-generate unique codes

## Participant Data Structure

Each participant has:
- **Name** (required)
- **Phone Number** (optional)
- **Instagram Handle** (optional)
- **Category** (Arcella, Mare, Severi, Mortise, Famiglia, Colleghi, Amici)
- **Unique Code** (6-character alphanumeric, auto-generated)
- **Notes** (optional)

## Statistics

Total: **53 participants**

By Category:
- Arcella: 10
- Mare: 6
- Severi: 9
- Mortise: 4
- Famiglia: 6
- Colleghi: 2
- Amici: 1
- No category: 15

## Notes

- 51 participants have phone numbers
- 2 participants (Riccardo Barnaba, Marco Bortolami) only have Instagram
- All codes are unique and randomly generated
- Codes can be shared with participants for game access
