-- Tabella sondaggio preferenze festa
CREATE TABLE IF NOT EXISTS party_survey_responses (
  id SERIAL PRIMARY KEY,
  participant_code VARCHAR(8) NOT NULL UNIQUE, -- Un solo sondaggio per partecipante
  wants_narghile BOOLEAN DEFAULT false,
  drink_vino_bianco BOOLEAN DEFAULT false,
  drink_vino_rosso BOOLEAN DEFAULT false,
  drink_prosecco BOOLEAN DEFAULT false,
  drink_spritz_campari BOOLEAN DEFAULT false,
  drink_spritz_aperol BOOLEAN DEFAULT false,
  drink_spritz_misto BOOLEAN DEFAULT false,
  drink_coca_cola BOOLEAN DEFAULT false,
  drink_fanta BOOLEAN DEFAULT false,
  drink_acqua BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indice per ricerca veloce per codice partecipante
CREATE INDEX IF NOT EXISTS idx_party_survey_participant ON party_survey_responses(participant_code);

-- RLS Policies
ALTER TABLE party_survey_responses ENABLE ROW LEVEL SECURITY;

-- Permetti a tutti di leggere (per conteggi)
CREATE POLICY "Anyone can read survey responses" ON party_survey_responses
  FOR SELECT USING (true);

-- Permetti inserimento solo se il codice non esiste già
CREATE POLICY "Anyone can insert their survey" ON party_survey_responses
  FOR INSERT WITH CHECK (true);

-- Permetti aggiornamento solo del proprio sondaggio
CREATE POLICY "Users can update their own survey" ON party_survey_responses
  FOR UPDATE USING (true);
