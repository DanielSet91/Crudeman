import { app } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import Database from 'better-sqlite3'

let db

export function initDatabase() {
  if (db) return db

  const userDataPath = app.getPath('userData')
  const dbPath = path.join(userDataPath, 'postman.sqlite')

  if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  }

  db = new Database(dbPath)

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY,
      name TEXT,
      url TEXT,
      method TEXT,
      headers TEXT,
      body TEXT,
      createdAt TEXT
    )
  `
  ).run()

  return db
}

export async function saveRequest(request) {
  // Convert headers object to JSON string for storage
  const headersStr = JSON.stringify(request.headers || {})

  const stmt = db.prepare(`
    INSERT INTO requests (id, name, url, method, headers, body, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  stmt.run(request.id, request.name, request.url, request.method, headersStr, request.body, request.createdAt)
}

export async function getAllRequests() {
  const stmt = db.prepare('SELECT * FROM requests')
  const rows = stmt.all()

  // Parse headers JSON string back to object
  return rows.map((row) => ({
    ...row,
    headers: JSON.parse(row.headers),
  }))
}
