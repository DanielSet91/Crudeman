import { app } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import { createRequire } from 'module';
import { SavedRequest, SaveRequestOptions } from '../../src/types/commonTypes';

const nodeRequire = createRequire(import.meta.url);
const Database = nodeRequire('better-sqlite3');

/**
 * RequestHistoryDatabase provides persistent storage for HTTP requests and their responses
 * using SQLite in the Electron userData directory.
 *
 * It creates a `requests_history` table if it does not exist, and supports
 * saving, retrieving, deleting, and editing request records.
 */
export class RequestHistoryDatabase {
  private db: typeof Database.prototype;

  /**
   * Initializes the database connection and ensures the storage folder and table exist.
   *
   * Creates the SQLite database file in Electron's userData directory.
   * If the database or its folder doesn't exist, they are created.
   * The table `requests_history` is created if not existing.
   */
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

  /**
   * Saves a new HTTP request and its response data to the database.
   *
   * @param {SaveRequestOptions} request - The request data to save.
   *   Includes method, URL, headers, params, body, status, ok flag, and response data.
   */
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

  /**
   * Retrieves all saved HTTP requests ordered by creation date descending.
   *
   * Parses JSON fields (headers, params, response_data) before returning.
   *
   * @returns {SavedRequest[]} Array of saved requests with parsed fields.
   */
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

  /**
   * Deletes a saved request by its unique identifier.
   *
   * @param {string} id - The unique ID of the request to delete.
   * @throws Will throw an error if the ID is missing or empty.
   */
  deleteRequest(id: string) {
    if (!id) {
      throw new Error('Missing id for deletion.');
    }
    const stmt = this.db.prepare(`DELETE FROM requests_history WHERE id = ?`);
    stmt.run(id);
  }

  /**
   * Edits fields of an existing saved request by its ID.
   *
   * Supports partial updates; only provided fields will be updated.
   * Automatically handles JSON stringification of complex fields.
   *
   * @param {string} id - The unique ID of the request to update.
   * @param {Partial<SaveRequestOptions>} updates - Object with fields to update.
   * @throws Will throw an error if ID is missing or no update fields are provided.
   */
  editRequest(id: string, updates: Partial<SaveRequestOptions>) {
    if (!id) {
      throw new Error('Missing id for editing.');
    }

    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined) continue;
      let dbValue: string | number | null = null;
      // Handle specific JSON stringification for complex fields
      if (key === 'headers' || key === 'params') {
        dbValue = JSON.stringify(value);
      } else if (key === 'response_data') {
        dbValue = typeof value === 'string' ? value : JSON.stringify(value);
      } else if (key === 'ok') {
        dbValue = value ? 1 : 0;
      } else if (key === 'body') {
        dbValue = typeof value === 'string' ? value : JSON.stringify(value);
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
