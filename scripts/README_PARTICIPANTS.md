# Import Game Participants

## Overview
This directory contains scripts to import participants for A Tutto Reality: La Rivoluzione.

## Files
- `import_participants.py` - Original v2.0 script (53 participants)
- `import_participants_v2.1.py` - Updated v2.1 script (51 participants with couples support)

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
- **Partner Name** (optional) - NEW in v2.1
- **Is Couple** (boolean) - NEW in v2.1

## Statistics (v2.1)

Total: **51 participants** (removed Laura Rettore, Paolo Milanesi from v2.0)

By Category:
- Arcella: 9
- Mare: 5
- Severi: 8
- Mortise: 4
- Famiglia: 5
- Colleghi: 1
- Amici: 1
- No category: 18

Relationships:
- **12 couples** identified (24 people in relationships)

## Notes

- 49 participants have phone numbers (was 51 in v2.0)
- 2 participants (Riccardo Barnaba, Marco Bortolami) only have Instagram
- All codes are unique and randomly generated
- Codes can be shared with participants for game access
- Couples are bidirectionally linked (both partners have each other's name)

## Changes from v2.0 to v2.1

**Removed:**
- Laura Rettore
- Paolo Milanesi

**Added Features:**
- Couples relationship tracking
- Partner name field
- 12 couples identified in the group
