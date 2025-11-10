-- Create meal_presets table for user-defined meal presets
CREATE TABLE IF NOT EXISTS meal_presets (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('colazione', 'spuntino_mattina', 'pranzo', 'spuntino_pomeriggio', 'cena', 'snack', 'pizza')),
  day_type TEXT CHECK (day_type IN ('allenamento', 'riposo') OR day_type IS NULL),
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Unique constraint: one preset per meal_type + day_type combination per user
  UNIQUE(user_id, meal_type, day_type)
);

-- Create index for faster queries
CREATE INDEX idx_meal_presets_user_id ON meal_presets(user_id);

-- Enable RLS
ALTER TABLE meal_presets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own meal presets"
  ON meal_presets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal presets"
  ON meal_presets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal presets"
  ON meal_presets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal presets"
  ON meal_presets FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_meal_presets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER trigger_update_meal_presets_updated_at
  BEFORE UPDATE ON meal_presets
  FOR EACH ROW
  EXECUTE FUNCTION update_meal_presets_updated_at();
