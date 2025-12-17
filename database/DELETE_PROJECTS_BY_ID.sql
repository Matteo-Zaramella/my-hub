-- DELETE PROJECTS BY ID
-- Prima identifichiamo gli ID dei progetti da eliminare

-- Mostra tutti i progetti con i loro ID
SELECT
  id,
  nome,
  (SELECT COUNT(*) FROM todo_tasks WHERE project_id = todo_projects.id) as num_tasks
FROM todo_projects
WHERE user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
ORDER BY created_at DESC;

-- Dopo aver identificato gli ID, elimina i progetti indesiderati
-- Sostituisci gli ID sotto con quelli dei progetti da eliminare

-- Elimina tutti i progetti "My Hub Development" e "cIAO"
DELETE FROM todo_projects
WHERE nome IN ('My Hub Development', 'cIAO')
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

-- ATTENZIONE: Questo eliminerà anche le task associate!
-- Se vuoi salvare le task, prima spostale al nuovo progetto:

-- 1. Sposta le task al progetto "A Tutto Reality: La Rivoluzione"
UPDATE todo_tasks
SET project_id = '656ba838-77ea-48ad-8801-23c926e1d05c'
WHERE project_id IN (
  SELECT id FROM todo_projects
  WHERE nome = 'My Hub Development'
  AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
);

-- 2. Poi elimina i vecchi progetti
DELETE FROM todo_projects
WHERE nome IN ('My Hub Development', 'cIAO')
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

-- Verifica finale
SELECT
  p.id,
  p.nome,
  COUNT(t.id) as num_tasks
FROM todo_projects p
LEFT JOIN todo_tasks t ON t.project_id = p.id
WHERE p.user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
GROUP BY p.id, p.nome
ORDER BY p.created_at DESC;
