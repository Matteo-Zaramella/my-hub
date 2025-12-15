-- CLEANUP TODO DUPLICATES
-- Rimuovi progetti duplicati mantenendo solo il più recente

-- Elimina progetti duplicati (mantiene solo il più recente per ogni nome)
DELETE FROM todo_projects
WHERE id NOT IN (
  SELECT DISTINCT ON (nome, user_id) id
  FROM todo_projects
  ORDER BY nome, user_id, created_at DESC
)
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

-- Verifica progetti rimasti
SELECT
  id,
  nome,
  created_at,
  (SELECT COUNT(*) FROM todo_tasks WHERE project_id = todo_projects.id) as num_tasks
FROM todo_projects
WHERE user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
ORDER BY created_at DESC;
