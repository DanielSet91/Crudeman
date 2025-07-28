import { app } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

let db: Database.Database | null = null;

export function initDatabase() {
  if (db) return db;

  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'postman.sqlite');

  if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }

  db = new Database(dbPath);

  db.prepare(`
    CREATE TABLE IF NOT EXISTS requests_history (
      id TEXT PRIMARY KEY,
      method TEXT,
      url TEXT,
      headers TEXT,
      params TEXT,
      body TEXT,
      status INTEGER,
      ok BOOLEAN,
      response_data TEXT,
      created_at TEXT
    )
  `).run();

  return db;
}

interface SaveRequestOptions {
  method: string;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: string;
  status?: number;
  ok?: boolean;
  response_data?: any;
}

export function saveRequestToHistory(request: SaveRequestOptions) {
  if (!db) initDatabase();

  const id = uuidv4();
  const createdAt = new Date().toISOString();

  const stmt = db!.prepare(`
    INSERT INTO requests_history
    (id, method, url, headers, params, body, status, ok, response_data, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    request.method,
    request.url,
    JSON.stringify(request.headers || {}),
    JSON.stringify(request.params || {}),
    request.body || '',
    request.status || 0,
    request.ok ? 1 : 0,
    typeof request.response_data === 'string'
      ? request.response_data
      : JSON.stringify(request.response_data || {}),
    createdAt
  );
}

export function getAllRequests() {
  if (!db) initDatabase();

  const stmt = db!.prepare(`SELECT * FROM requests_history ORDER BY created_at DESC`);
  const requests = stmt.all(); // get all rows

  // Parse JSON fields before returning (optional, but useful)
  return requests.map((row) => ({
    ...row,
    headers: JSON.parse(row.headers),
    params: JSON.parse(row.params),
    response_data: (() => {
      try {
        return JSON.parse(row.response_data);
      } catch {
        return row.response_data;
      }
    })(),
    ok: Boolean(row.ok),
    status: row.status,
    created_at: row.created_at,
  }));
}
