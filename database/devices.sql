-- Tabella per gestire tutti i dispositivi e componenti
CREATE TABLE IF NOT EXISTS devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN (
    'PC Components',
    'Periferiche',
    'Bici',
    'Elettronica',
    'Altro'
  )),
  name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  specs JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  purchase_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indice per velocizzare le query
CREATE INDEX IF NOT EXISTS devices_user_id_idx ON devices(user_id);
CREATE INDEX IF NOT EXISTS devices_category_idx ON devices(category);

-- RLS (Row Level Security) per proteggere i dati
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- Policy: gli utenti possono vedere solo i propri dispositivi
CREATE POLICY "Users can view own devices" ON devices
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: gli utenti possono inserire dispositivi
CREATE POLICY "Users can insert own devices" ON devices
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: gli utenti possono aggiornare i propri dispositivi
CREATE POLICY "Users can update own devices" ON devices
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: gli utenti possono eliminare i propri dispositivi
CREATE POLICY "Users can delete own devices" ON devices
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_devices_updated_at
  BEFORE UPDATE ON devices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Commento sulla tabella
COMMENT ON TABLE devices IS 'Tabella per gestire tutti i dispositivi: PC, periferiche, bici, elettronica, ecc.';
COMMENT ON COLUMN devices.specs IS 'Specifiche tecniche in formato JSON (RAM, CPU, GPU, etc.)';
