-- SETUP TODO SYSTEM
-- Sistema di gestione progetti e task per workflow development

-- Tabella Progetti
CREATE TABLE IF NOT EXISTS todo_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descrizione TEXT,
  colore VARCHAR(7) DEFAULT '#6366f1', -- Hex color per identificazione visiva
  stato VARCHAR(50) DEFAULT 'attivo', -- attivo, completato, archiviato
  priorita INTEGER DEFAULT 0, -- 0=bassa, 1=media, 2=alta
  data_inizio TIMESTAMP WITH TIME ZONE,
  data_scadenza TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Task
CREATE TABLE IF NOT EXISTS todo_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES todo_projects(id) ON DELETE CASCADE,
  titolo VARCHAR(500) NOT NULL,
  descrizione TEXT,
  stato VARCHAR(50) DEFAULT 'da_fare', -- da_fare, in_corso, completato, bloccato, cancellato
  priorita INTEGER DEFAULT 0, -- 0=bassa, 1=media, 2=alta, 3=urgente
  tags TEXT[], -- Array di tag per categorizzazione
  data_scadenza TIMESTAMP WITH TIME ZONE,
  data_completamento TIMESTAMP WITH TIME ZONE,
  ordine INTEGER DEFAULT 0, -- Per ordinamento manuale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Note/Commenti per i task
CREATE TABLE IF NOT EXISTS todo_task_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES todo_tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nota TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_todo_projects_user ON todo_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_todo_projects_stato ON todo_projects(stato);
CREATE INDEX IF NOT EXISTS idx_todo_tasks_user ON todo_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_todo_tasks_project ON todo_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_todo_tasks_stato ON todo_tasks(stato);
CREATE INDEX IF NOT EXISTS idx_todo_task_notes_task ON todo_task_notes(task_id);

-- RLS Policies

-- Projects
ALTER TABLE todo_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
ON todo_projects FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
ON todo_projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
ON todo_projects FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
ON todo_projects FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Tasks
ALTER TABLE todo_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks"
ON todo_tasks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks"
ON todo_tasks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
ON todo_tasks FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
ON todo_tasks FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Task Notes
ALTER TABLE todo_task_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view notes for own tasks"
ON todo_task_notes FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM todo_tasks
    WHERE todo_tasks.id = todo_task_notes.task_id
    AND todo_tasks.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create notes on own tasks"
ON todo_task_notes FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM todo_tasks
    WHERE todo_tasks.id = todo_task_notes.task_id
    AND todo_tasks.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own notes"
ON todo_task_notes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_todo_projects_updated_at
  BEFORE UPDATE ON todo_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todo_tasks_updated_at
  BEFORE UPDATE ON todo_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserisci task iniziale: Fix wishlist RLS policies
INSERT INTO todo_projects (user_id, nome, descrizione, colore, priorita)
SELECT
  id,
  'My Hub Development',
  'Sviluppo e manutenzione del progetto My Hub',
  '#6366f1',
  2
FROM auth.users
WHERE email = 'matteo.zaramella2002@gmail.com'
LIMIT 1;

INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags)
SELECT
  u.id,
  p.id,
  'Fix wishlist public RLS policies',
  'Le policy RLS per la wishlist pubblica non permettono l''accesso anonimo. Eseguire lo script CLEANUP_WISHLIST_POLICIES.sql per risolvere.',
  'da_fare',
  2,
  ARRAY['bug', 'database', 'wishlist']
FROM auth.users u
JOIN todo_projects p ON p.user_id = u.id AND p.nome = 'My Hub Development'
WHERE u.email = 'matteo.zaramella2002@gmail.com'
LIMIT 1;

-- Verifica creazione tabelle
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as num_columns
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name LIKE 'todo_%'
ORDER BY table_name;
