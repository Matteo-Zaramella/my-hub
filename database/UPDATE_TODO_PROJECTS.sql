-- UPDATE TODO PROJECTS
-- Elimina progetti indesiderati e aggiunge "A Tutto Reality: La Rivoluzione"

-- Elimina il progetto "cIAO"
DELETE FROM todo_projects
WHERE nome = 'cIAO'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

-- Elimina il progetto "My Hub Development" senza task
DELETE FROM todo_projects
WHERE nome = 'My Hub Development'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
AND id NOT IN (
  SELECT DISTINCT project_id
  FROM todo_tasks
  WHERE project_id IS NOT NULL
);

-- Aggiungi il nuovo progetto "A Tutto Reality: La Rivoluzione"
INSERT INTO todo_projects (user_id, nome, descrizione, colore, priorita, stato)
VALUES (
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  'A Tutto Reality: La Rivoluzione',
  'Gestione e sviluppo del gioco interattivo A Tutto Reality: La Rivoluzione',
  '#ef4444',
  3,
  'attivo'
);

-- Verifica progetti finali
SELECT
  id,
  nome,
  descrizione,
  colore,
  priorita,
  stato,
  created_at,
  (SELECT COUNT(*) FROM todo_tasks WHERE project_id = todo_projects.id) as num_tasks
FROM todo_projects
WHERE user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
ORDER BY priorita DESC, created_at DESC;
