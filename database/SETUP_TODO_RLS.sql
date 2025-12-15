-- SETUP TODO RLS POLICIES
-- Esegui DOPO aver creato le tabelle

-- Enable RLS
ALTER TABLE todo_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_task_notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own projects" ON todo_projects;
DROP POLICY IF EXISTS "Users can create own projects" ON todo_projects;
DROP POLICY IF EXISTS "Users can update own projects" ON todo_projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON todo_projects;

DROP POLICY IF EXISTS "Users can view own tasks" ON todo_tasks;
DROP POLICY IF EXISTS "Users can create own tasks" ON todo_tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON todo_tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON todo_tasks;

DROP POLICY IF EXISTS "Users can view notes for own tasks" ON todo_task_notes;
DROP POLICY IF EXISTS "Users can create notes on own tasks" ON todo_task_notes;
DROP POLICY IF EXISTS "Users can delete own notes" ON todo_task_notes;

-- Projects policies
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

-- Tasks policies
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

-- Task notes policies
CREATE POLICY "Users can view notes for own tasks"
ON todo_task_notes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create notes on own tasks"
ON todo_task_notes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
ON todo_task_notes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
