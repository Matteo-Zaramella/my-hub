-- Tabella partecipanti al gioco
CREATE TABLE IF NOT EXISTS game_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_code TEXT UNIQUE NOT NULL, -- Codice 8 caratteri (es. "K7M3A9XB")
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  instagram TEXT,
  personal_message TEXT,
  password_hash TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  total_points INTEGER DEFAULT 0,
  partner_name TEXT, -- Nome partner (se in coppia)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella OTP temporanei per verifica email
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL, -- 6 cifre
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email) -- Un solo OTP attivo per email
);

-- Index per performance
CREATE INDEX IF NOT EXISTS idx_participants_code ON game_participants(participant_code);
CREATE INDEX IF NOT EXISTS idx_participants_email ON game_participants(email);
CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_codes(email);

-- RLS Policies
ALTER TABLE game_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Policy: tutti possono leggere i partecipanti (per leaderboard)
CREATE POLICY "Anyone can read participants"
ON game_participants FOR SELECT
TO public
USING (true);

-- Policy: solo il partecipante può aggiornare se stesso
CREATE POLICY "Participants can update themselves"
ON game_participants FOR UPDATE
TO public
USING (participant_code = current_setting('app.current_participant_code', true));

-- Policy: solo API può inserire partecipanti (tramite service role)
CREATE POLICY "Only service role can insert participants"
ON game_participants FOR INSERT
TO service_role
WITH CHECK (true);

-- Policy: OTP codes accessibili solo da service role
CREATE POLICY "Only service role can manage OTP"
ON otp_codes FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Trigger per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_game_participants_updated_at
  BEFORE UPDATE ON game_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
