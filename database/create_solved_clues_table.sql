-- Tabella per tracciare gli indizi risolti per squadra
CREATE TABLE IF NOT EXISTS game_solved_clues (
  id SERIAL PRIMARY KEY,
  team_id INTEGER NOT NULL REFERENCES game_teams(id) ON DELETE CASCADE,
  clue_type VARCHAR(50) NOT NULL, -- 'calendar', 'clock', 'location'
  challenge_number INTEGER NOT NULL DEFAULT 1,
  solved_by_code VARCHAR(50), -- Codice del partecipante che ha risolto
  solved_by_nickname VARCHAR(100), -- Nickname del partecipante
  solved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Un indizio può essere risolto solo una volta per squadra per sfida
  UNIQUE(team_id, clue_type, challenge_number)
);

-- Indice per query veloci
CREATE INDEX IF NOT EXISTS idx_solved_clues_team ON game_solved_clues(team_id);
CREATE INDEX IF NOT EXISTS idx_solved_clues_challenge ON game_solved_clues(challenge_number);

-- RLS policies
ALTER TABLE game_solved_clues ENABLE ROW LEVEL SECURITY;

-- Permetti lettura a tutti gli autenticati
CREATE POLICY "Allow read for authenticated" ON game_solved_clues
  FOR SELECT USING (true);

-- Permetti inserimento solo tramite service role (API)
CREATE POLICY "Allow insert for service role" ON game_solved_clues
  FOR INSERT WITH CHECK (true);
