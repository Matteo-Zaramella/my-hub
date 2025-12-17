-- ADD ALL GAME TASKS
-- Aggiunge task a My Hub Development e crea progetto A Tutto Reality con tutte le task dalla checklist

-- 1. Aggiungi task a My Hub Development per sistemare progetti duplicati
INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Sistemare progetti Todo duplicati',
  'Eliminare i progetti duplicati "My Hub Development" vuoto e "cIAO" dal sistema Todo. Gli script SQL non stanno funzionando correttamente.',
  'da_fare',
  2,
  ARRAY['bug', 'database', 'todo']
FROM todo_projects
WHERE nome = 'My Hub Development'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
AND id = '5866e976-894b-4bbe-a6e5-767c7fce9b68'
LIMIT 1;

-- 2. Crea progetto "A Tutto Reality: La Rivoluzione"
INSERT INTO todo_projects (user_id, nome, descrizione, colore, priorita, stato)
VALUES (
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  'A Tutto Reality: La Rivoluzione',
  'Gestione e sviluppo del gioco interattivo A Tutto Reality: La Rivoluzione - Cerimonia 24 Gennaio 2026',
  '#ef4444',
  3,
  'attivo'
)
ON CONFLICT DO NOTHING;

-- 3. Aggiungi tutte le task dalla checklist

-- URGENTI - Scadenza questa settimana
INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags, data_scadenza)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Confermare Location Festa Padova',
  'Decidere tra Fenice Green Energy Park (€340) e Oste Divino (€200). Prenotazione da confermare entro metà dicembre.',
  'in_corso',
  3,
  ARRAY['urgente', 'location', 'festa'],
  '2025-11-25'
FROM todo_projects
WHERE nome = 'A Tutto Reality: La Rivoluzione'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags, data_completamento)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Creare 10 Indizi Cerimonia (EVOLUZIONE)',
  'Sistema implementato con griglia 10x10, password EVOLUZIONE assegna +100pt a tutti. COMPLETATO.',
  'completato',
  3,
  ARRAY['completato', 'indizi', 'cerimonia'],
  '2025-11-14'
FROM todo_projects
WHERE nome = 'A Tutto Reality: La Rivoluzione'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags, data_completamento)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Sistema Email Automatiche - Setup Base',
  'Resend configurato, template professionale, invio automatico. COMPLETATO.',
  'completato',
  2,
  ARRAY['completato', 'email', 'automazione'],
  '2025-11-18'
FROM todo_projects
WHERE nome = 'A Tutto Reality: La Rivoluzione'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags, data_completamento)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Form Raccolta Dati Partecipanti',
  'Form 2-step con verifica identità, email, telefono, Instagram. COMPLETATO.',
  'completato',
  2,
  ARRAY['completato', 'form', 'partecipanti'],
  '2025-11-14'
FROM todo_projects
WHERE nome = 'A Tutto Reality: La Rivoluzione'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

-- ALTA PRIORITÀ - Prossime 2 settimane
INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags, data_scadenza)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Definire Sfida Febbraio 2026 (21-22/02)',
  'Prima sfida mensile dopo cerimonia. Decidere tipo, location, scrivere 3 indizi. Date rivelazione: 31/01, 07/02, 14/02.',
  'da_fare',
  3,
  ARRAY['urgente', 'sfida', 'febbraio'],
  '2025-11-30'
FROM todo_projects
WHERE nome = 'A Tutto Reality: La Rivoluzione'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags, data_scadenza)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Definire Sfida Marzo 2026 (21-22/03)',
  'Seconda sfida mensile. Decidere tipo, location, scrivere 3 indizi. Date rivelazione: 28/02, 07/03, 14/03.',
  'da_fare',
  3,
  ARRAY['urgente', 'sfida', 'marzo'],
  '2025-12-05'
FROM todo_projects
WHERE nome = 'A Tutto Reality: La Rivoluzione'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags, data_scadenza)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Implementare Chat di Gruppo - Miglioramenti',
  'Base implementata. Mancano: moderazione, lista partecipanti online, reazioni, notifiche push.',
  'in_corso',
  2,
  ARRAY['chat', 'features', 'miglioramenti'],
  '2025-12-10'
FROM todo_projects
WHERE nome = 'A Tutto Reality: La Rivoluzione'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags, data_completamento)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Sistema Registrazione Partecipanti',
  'Form completo, timer 10sec, blocco modifica, pallini stato. COMPLETATO.',
  'completato',
  2,
  ARRAY['completato', 'registrazione', 'partecipanti'],
  '2025-11-14'
FROM todo_projects
WHERE nome = 'A Tutto Reality: La Rivoluzione'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags, data_completamento)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Sistema Fasi del Gioco',
  '6 fasi implementate, timeline visiva, plot twist valigetta. COMPLETATO.',
  'completato',
  2,
  ARRAY['completato', 'fasi', 'timeline'],
  '2025-11-17'
FROM todo_projects
WHERE nome = 'A Tutto Reality: La Rivoluzione'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags, data_scadenza)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Sistema Notifiche Push',
  'Implementare Web Push API per: nuovi indizi, messaggi chat, reminder sfide, aggiornamenti classifica.',
  'da_fare',
  2,
  ARRAY['notifiche', 'push', 'api'],
  '2025-12-15'
FROM todo_projects
WHERE nome = 'A Tutto Reality: La Rivoluzione'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

-- MEDIA PRIORITÀ - Dicembre 2025
INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags, data_scadenza)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Materiali Fisici Evento',
  'Stampare 10 indizi A5, cartellonistica benvenuto, regolamento, kit benvenuto, mappa posizionamento.',
  'da_fare',
  1,
  ARRAY['stampa', 'materiali', 'fisico'],
  '2025-12-20'
FROM todo_projects
WHERE nome = 'A Tutto Reality: La Rivoluzione'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags, data_scadenza)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Definire Sfide Aprile-Maggio 2026',
  'Sfida 3 Aprile (25-26/04) con 4 indizi. Sfida 4 Maggio (23-24/05) con 3 indizi.',
  'da_fare',
  1,
  ARRAY['sfida', 'aprile', 'maggio'],
  '2025-12-31'
FROM todo_projects
WHERE nome = 'A Tutto Reality: La Rivoluzione'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags, data_scadenza)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Test Completi Pre-Evento',
  'Test funzionali, dispositivi, carico (50+ utenti). Homepage, password, login, chat, indizi, dashboard, responsive.',
  'da_fare',
  2,
  ARRAY['test', 'qa', 'pre-evento'],
  '2026-01-10'
FROM todo_projects
WHERE nome = 'A Tutto Reality: La Rivoluzione'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags, data_scadenza)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Cron Jobs & Automazioni',
  'Vercel Edge Functions: reveal-clue, send-notification, calculate-leaderboard. Cron: sabato 00:00 indizi, venerdì 18:00 reminder.',
  'da_fare',
  1,
  ARRAY['automazione', 'cron', 'vercel'],
  '2026-01-15'
FROM todo_projects
WHERE nome = 'A Tutto Reality: La Rivoluzione'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

-- BASSA PRIORITÀ - Gennaio 2026
INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags, data_scadenza)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Dashboard Admin - Features Avanzate',
  'Moderazione messaggi, statistiche real-time, export CSV/Excel, grafici punteggi, log attività, backup automatico.',
  'da_fare',
  0,
  ARRAY['dashboard', 'admin', 'features'],
  '2026-01-20'
FROM todo_projects
WHERE nome = 'A Tutto Reality: La Rivoluzione'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags, data_scadenza)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Miglioramenti UX/UI',
  'Animazioni transizioni, loading states, error handling UI, toast notifications, dark mode, accessibility WCAG.',
  'da_fare',
  0,
  ARRAY['ux', 'ui', 'design'],
  '2026-01-22'
FROM todo_projects
WHERE nome = 'A Tutto Reality: La Rivoluzione'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

INSERT INTO todo_tasks (user_id, project_id, titolo, descrizione, stato, priorita, tags, data_scadenza)
SELECT
  '3c3da68d-f561-4224-81d4-875f6b7146e5',
  id,
  'Security & Performance Optimization',
  'Rate limiting, sanitizzazione input, moderazione linguaggio, RLS verificate, backup DB, caching, lazy loading, CDN, monitoring Sentry.',
  'da_fare',
  0,
  ARRAY['security', 'performance', 'optimization'],
  '2026-01-23'
FROM todo_projects
WHERE nome = 'A Tutto Reality: La Rivoluzione'
AND user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5';

-- Verifica risultato finale
SELECT
  p.nome as progetto,
  p.colore,
  p.priorita,
  COUNT(t.id) as num_tasks,
  COUNT(CASE WHEN t.stato = 'completato' THEN 1 END) as completate,
  COUNT(CASE WHEN t.stato = 'in_corso' THEN 1 END) as in_corso,
  COUNT(CASE WHEN t.stato = 'da_fare' THEN 1 END) as da_fare
FROM todo_projects p
LEFT JOIN todo_tasks t ON t.project_id = p.id
WHERE p.user_id = '3c3da68d-f561-4224-81d4-875f6b7146e5'
GROUP BY p.id, p.nome, p.colore, p.priorita
ORDER BY p.priorita DESC, p.created_at DESC;
