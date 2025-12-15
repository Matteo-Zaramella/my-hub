-- DISABLE TODO RLS TEMPORARILY
-- Disabilita temporaneamente RLS per testare se è quello il problema

ALTER TABLE todo_projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE todo_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE todo_task_notes DISABLE ROW LEVEL SECURITY;

-- Verifica stato RLS
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('todo_projects', 'todo_tasks', 'todo_task_notes')
ORDER BY tablename;
