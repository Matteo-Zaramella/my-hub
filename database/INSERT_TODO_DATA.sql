-- INSERT TODO DATA
-- Popola il database con progetto e task iniziali

-- Inserisci progetto "My Hub Development"
INSERT INTO todo_projects (user_id, nome, descrizione, colore, priorita, stato)
VALUES (
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  'My Hub Development',
  'Sviluppo e manutenzione del progetto My Hub',
  '#6366f1',
  2,
  'attivo'
)
ON CONFLICT DO NOTHING
RETURNING id, nome;

-- IMPORTANTE: Copia l'ID del progetto che viene ritornato sopra e sostituiscilo qui sotto
-- Se non viene mostrato, esegui prima questa query per trovarlo:
-- SELECT id FROM todo_projects WHERE nome = 'My Hub Development' AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

-- Inserisci task "Fix wishlist public RLS policies"
INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Fix wishlist public RLS policies',
  'Le policy RLS per la wishlist pubblica non permettono l''accesso anonimo. Eseguire lo script CLEANUP_WISHLIST_POLICIES.sql per risolvere.',
  'da_fare',
  2,
  ARRAY['bug', 'database', 'wishlist']
FROM todo_projects
WHERE nome = 'My Hub Development' AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

-- Inserisci task "Test sistema Todo"
INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Test sistema Todo completato',
  'Verificare creazione progetti, task, cambio stati, filtri e tutte le funzionalità del sistema Todo.',
  'da_fare',
  1,
  ARRAY['test', 'todo', 'ui']
FROM todo_projects
WHERE nome = 'My Hub Development' AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

-- Inserisci task "Documentare API del progetto"
INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Documentare API del progetto',
  'Creare documentazione per le API utilizzate nel progetto My Hub.',
  'da_fare',
  0,
  ARRAY['documentazione', 'api']
FROM todo_projects
WHERE nome = 'My Hub Development' AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

-- Verifica dati inseriti
SELECT
  p.nome as progetto,
  COUNT(t.id) as num_tasks
FROM todo_projects p
LEFT JOIN todo_tasks t ON t.project_id = p.id
WHERE p.user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
GROUP BY p.id, p.nome;
