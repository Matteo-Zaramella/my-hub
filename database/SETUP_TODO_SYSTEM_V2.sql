-- SETUP TODO SYSTEM V2
-- Sistema di gestione progetti e task per workflow development
-- Esegui questo script passo per passo

-- STEP 1: Crea le tabelle
CREATE TABLE IF NOT EXISTS todo_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descrizione TEXT,
  colore VARCHAR(7) DEFAULT '#6366f1',
  stato VARCHAR(50) DEFAULT 'attivo',
  priorita INTEGER DEFAULT 0,
  data_inizio TIMESTAMP WITH TIME ZONE,
  data_scadenza TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS todo_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES todo_projects(id) ON DELETE CASCADE,
  titolo VARCHAR(500) NOT NULL,
  descrizione TEXT,
  stato VARCHAR(50) DEFAULT 'da_fare',
  priorita INTEGER DEFAULT 0,
  tags TEXT[],
  data_scadenza TIMESTAMP WITH TIME ZONE,
  data_completamento TIMESTAMP WITH TIME ZONE,
  ordine INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS todo_task_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES todo_tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nota TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
