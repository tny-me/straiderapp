-- UDSG Admin Panel — esquema de base de datos (Cloudflare D1)
-- Instalación nueva: incluye ya las subtareas y fecha de entrega.
-- Si tu base de datos ya existía antes de estos campos, usa migrations/002_tasks_and_duedate.sql en su lugar.

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  client TEXT,
  status TEXT NOT NULL DEFAULT 'Solicitud',
  priority TEXT NOT NULL DEFAULT 'Normal',
  progress INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  due_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
