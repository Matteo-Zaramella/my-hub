-- TEST TODO RLS
-- Verifica che le RLS policies funzionino correttamente

-- Test 1: Verifica che i dati esistano nella tabella (bypassa RLS)
SELECT
  'Total projects in DB' as test,
  COUNT(*) as count
FROM todo_projects;

SELECT
  'Total tasks in DB' as test,
  COUNT(*) as count
FROM todo_tasks;

-- Test 2: Verifica policies attive
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('todo_projects', 'todo_tasks')
ORDER BY tablename, cmd, policyname;

-- Test 3: Prova query come se fossi autenticato
-- (questo non funzionerà nel SQL editor, ma serve per capire)
SELECT * FROM todo_projects LIMIT 5;
SELECT * FROM todo_tasks LIMIT 5;
