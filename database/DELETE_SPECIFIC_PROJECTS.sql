-- DELETE SPECIFIC PROJECTS
-- Elimina solo i progetti specificati per ID

-- Elimina "My Hub Development" vuoto (0 task)
DELETE FROM todo_projects
WHERE id = 'b1df0a95-7c9e-4aaa-8984-5f1ee4f910af'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

-- Elimina "cIAO" (0 task)
DELETE FROM todo_projects
WHERE id = '8f1641f7-d9a3-4978-9cf6-cf366c972643'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

-- Verifica il risultato finale (dovrebbe rimanere solo 1 progetto con 3 task)
SELECT
  id,
  nome,
  colore,
  priorita,
  created_at,
  (SELECT COUNT(*) FROM todo_tasks WHERE project_id = todo_projects.id) as num_tasks
FROM todo_projects
WHERE user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
ORDER BY created_at;
