-- DELETE UNWANTED PROJECTS
-- Elimina il progetto "cIAO" e il progetto "My Hub Development" senza task

-- Elimina il progetto "cIAO"
DELETE FROM todo_projects
WHERE nome = 'cIAO'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

-- Elimina il progetto "My Hub Development" che non ha task associati
DELETE FROM todo_projects
WHERE nome = 'My Hub Development'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
AND id NOT IN (
  SELECT DISTINCT project_id
  FROM todo_tasks
  WHERE project_id IS NOT NULL
);

-- Verifica progetti rimasti
SELECT
  id,
  nome,
  descrizione,
  created_at,
  (SELECT COUNT(*) FROM todo_tasks WHERE project_id = todo_projects.id) as num_tasks
FROM todo_projects
WHERE user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
ORDER BY created_at DESC;
