import { app } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import { createRequire } from 'module';
import { SavedRequest, SaveRequestOptions } from '../../src/types/commonTypes';

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

export class RequestHistoryDatabase {
  private db: typeof Database.prototype;

  constructor() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'postman.sqlite');

    if (!fs.existsSync(path.dirname(dbPath))) {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }

    this.db = new Database(dbPath);

    this.db
      .prepare(
        `
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
    `
      )
      .run();
  }

  saveRequest(request: SaveRequestOptions) {
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const stmt = this.db.prepare(`
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
      typeof request.response_data === 'string' ? request.response_data : JSON.stringify(request.response_data || {}),
      createdAt
    );
  }

  getAllRequests() {
    const stmt = this.db.prepare(`SELECT * FROM requests_history ORDER BY created_at DESC`);
    const rows = stmt.all();

    return rows.map((row: SavedRequest) => ({
      ...row,
      headers: typeof row.headers === 'string' ? JSON.parse(row.headers) : (row.headers ?? {}),
      params: typeof row.params === 'string' ? JSON.parse(row.params) : (row.params ?? {}),
      response_data: (() => {
        try {
          return typeof row.response_data === 'string' ? JSON.parse(row.response_data) : row.response_data;
        } catch {
          return row.response_data;
        }
      })(),
      ok: Boolean(row.ok),
      status: row.status,
      created_at: row.created_at,
    }));
  }

  deleteRequest(id: string) {
    if (!id) {
      throw new Error('Missing id for deletion.');
    }
    const stmt = this.db.prepare(`DELETE FROM requests_history WHERE id = ?`);
    stmt.run(id);
  }

  editRequest(id: string, updates: Partial<SaveRequestOptions>) {
    if (!id) {
      throw new Error('Missing id for editing.');
    }

    const fields: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined) continue;

      let dbValue = value;

      // Handle specific JSON stringification for complex fields
      if (key === 'headers' || key === 'params') {
        dbValue = JSON.stringify(value);
      } else if (key === 'response_data') {
        dbValue = typeof value === 'string' ? value : JSON.stringify(value);
      } else if (key === 'ok') {
        dbValue = value ? 1 : 0;
      }

      fields.push(`${key} = ?`);
      values.push(dbValue);
    }

    if (fields.length === 0) {
      throw new Error('No fields provided to update.');
    }

    const sql = `UPDATE requests_history SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const stmt = this.db.prepare(sql);
    stmt.run(...values);
  }
}
