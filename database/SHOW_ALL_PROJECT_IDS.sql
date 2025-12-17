-- MOSTRA TUTTI I PROGETTI CON I LORO ID
-- Identifica esattamente quali progetti eliminare

SELECT
  id,
  nome,
  colore,
  created_at,
  (SELECT COUNT(*) FROM todo_tasks WHERE project_id = todo_projects.id) as num_tasks
FROM todo_projects
WHERE user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
ORDER BY nome, created_at;
