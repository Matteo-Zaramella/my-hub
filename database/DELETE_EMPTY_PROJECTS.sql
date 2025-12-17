-- DELETE EMPTY PROJECTS
-- Elimina solo i progetti senza task (cIAO e My Hub Development vuoto)

-- Elimina i progetti che non hanno task associate
DELETE FROM todo_projects
WHERE user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
AND id NOT IN (
  SELECT DISTINCT project_id
  FROM todo_tasks
  WHERE project_id IS NOT NULL
);

-- Verifica il risultato finale
SELECT
  p.id,
  p.nome,
  p.colore,
  p.priorita,
  COUNT(t.id) as num_tasks
FROM todo_projects p
LEFT JOIN todo_tasks t ON t.project_id = p.id
WHERE p.user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
GROUP BY p.id, p.nome, p.colore, p.priorita
ORDER BY p.priorita DESC, p.created_at DESC;
