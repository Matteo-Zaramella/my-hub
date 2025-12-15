-- SETUP TODO INDEXES
-- Esegui DOPO aver creato le tabelle e le policies

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_todo_projects_user ON todo_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_todo_projects_stato ON todo_projects(stato);
CREATE INDEX IF NOT EXISTS idx_todo_tasks_user ON todo_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_todo_tasks_project ON todo_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_todo_tasks_stato ON todo_tasks(stato);
CREATE INDEX IF NOT EXISTS idx_todo_task_notes_task ON todo_task_notes(task_id);
