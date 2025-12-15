-- SETUP TODO INITIAL DATA
-- Popola il database con progetto e task iniziale

-- Inserisci progetto "My Hub Development"
INSERT INTO todo_projects (user_id, nome, descrizione, colore, priorita, stato)
SELECT
  auth.uid(),
  'My Hub Development',
  'Sviluppo e manutenzione del progetto My Hub',
  '#6366f1',
  2,
  'attivo'
WHERE NOT EXISTS (
  SELECT 1 FROM todo_projects WHERE nome = 'My Hub Development' AND user_id = auth.uid()
);

-- Inserisci task "Fix wishlist public RLS policies"
INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags)
SELECT
  auth.uid(),
  p.id,
  'Fix wishlist public RLS policies',
  'Le policy RLS per la wishlist pubblica non permettono l''accesso anonimo. Eseguire lo script CLEANUP_WISHLIST_POLICIES.sql per risolvere il problema e permettere a tutti di vedere gli item pubblici.',
  'da_fare',
  2,
  ARRAY['bug', 'database', 'wishlist']
FROM todo_projects p
WHERE p.nome = 'My Hub Development' AND p.user_id = auth.uid()
AND NOT EXISTS (
  SELECT 1 FROM todo_tasks
  WHERE titolo = 'Fix wishlist public RLS policies' AND user_id = auth.uid()
);

-- Inserisci un secondo task di esempio
INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags)
SELECT
  auth.uid(),
  p.id,
  'Test sistema Todo completato',
  'Verificare che il sistema Todo funzioni correttamente con creazione progetti, task, cambio stati, ecc.',
  'da_fare',
  1,
  ARRAY['test', 'todo']
FROM todo_projects p
WHERE p.nome = 'My Hub Development' AND p.user_id = auth.uid()
AND NOT EXISTS (
  SELECT 1 FROM todo_tasks
  WHERE titolo = 'Test sistema Todo completato' AND user_id = auth.uid()
);

-- Verifica i dati inseriti
SELECT
  'Projects' as tipo,
  COUNT(*) as count
FROM todo_projects
WHERE user_id = auth.uid()
UNION ALL
SELECT
  'Tasks' as tipo,
  COUNT(*) as count
FROM todo_tasks
WHERE user_id = auth.uid();
