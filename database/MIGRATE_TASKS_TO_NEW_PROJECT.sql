-- MIGRATE TASKS TO NEW PROJECT
-- Sposta le task da "My Hub Development" a "A Tutto Reality: La Rivoluzione"

-- Aggiorna le task esistenti per spostarle al nuovo progetto
UPDATE todo_tasks
SET project_id = (
  SELECT id
  FROM todo_projects
  WHERE nome = 'A Tutto Reality: La Rivoluzione'
  AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
)
WHERE project_id = (
  SELECT id
  FROM todo_projects
  WHERE nome = 'My Hub Development'
  AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
)
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

-- Elimina il vecchio progetto "My Hub Development"
DELETE FROM todo_projects
WHERE nome = 'My Hub Development'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

-- Verifica il risultato finale
SELECT
  p.nome as progetto,
  COUNT(t.id) as num_tasks
FROM todo_projects p
LEFT JOIN todo_tasks t ON t.project_id = p.id
WHERE p.user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
GROUP BY p.id, p.nome
ORDER BY p.created_at DESC;

-- Mostra le task migrate
SELECT
  t.titolo,
  t.stato,
  t.priorita,
  p.nome as progetto
FROM todo_tasks t
JOIN todo_projects p ON t.project_id = p.id
WHERE t.user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
ORDER BY t.priorita DESC, t.created_at DESC;
