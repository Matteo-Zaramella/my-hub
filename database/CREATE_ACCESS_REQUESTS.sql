-- =============================================
-- TABELLA RICHIESTE ACCESSO
-- Data: 24/01/2026
-- =============================================

CREATE TABLE IF NOT EXISTS game_access_requests (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);

-- Indice per cercare per status
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON game_access_requests(status);

-- Verifica
SELECT * FROM game_access_requests;
