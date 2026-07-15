-- UDSG Admin Panel — esquema de base de datos (Cloudflare D1)

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  client TEXT,
  status TEXT NOT NULL DEFAULT 'Solicitud',
  priority TEXT NOT NULL DEFAULT 'Normal',
  progress INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
