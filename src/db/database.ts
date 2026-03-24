import * as SQLite from 'expo-sqlite';
import { Oshi, OshiLog, Genre, LogType } from '../types';

const db = SQLite.openDatabaseSync('oshi-log.db');

export const initDatabase = (): void => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS oshis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      group_name TEXT DEFAULT '',
      genre TEXT NOT NULL,
      icon_path TEXT DEFAULT '',
      color TEXT NOT NULL DEFAULT '#FF69B4',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      oshi_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      amount INTEGER DEFAULT 0,
      memo TEXT DEFAULT '',
      photo_path TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      FOREIGN KEY (oshi_id) REFERENCES oshis(id) ON DELETE CASCADE
    );
  `);
};

// ── Oshi CRUD ──────────────────────────────────────────

export const insertOshi = (
  name: string,
  group_name: string,
  genre: Genre,
  icon_path: string,
  color: string
): number => {
  const now = new Date().toISOString();
  const result = db.runSync(
    'INSERT INTO oshis (name, group_name, genre, icon_path, color, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [name, group_name, genre, icon_path, color, now]
  );
  return result.lastInsertRowId;
};

export const getAllOshis = (): Oshi[] => {
  return db.getAllSync<Oshi>('SELECT * FROM oshis ORDER BY created_at DESC');
};

export const getOshiById = (id: number): Oshi | null => {
  return db.getFirstSync<Oshi>('SELECT * FROM oshis WHERE id = ?', [id]) ?? null;
};

export const updateOshi = (
  id: number,
  name: string,
  group_name: string,
  genre: Genre,
  icon_path: string,
  color: string
): void => {
  db.runSync(
    'UPDATE oshis SET name=?, group_name=?, genre=?, icon_path=?, color=? WHERE id=?',
    [name, group_name, genre, icon_path, color, id]
  );
};

export const deleteOshi = (id: number): void => {
  db.runSync('DELETE FROM oshis WHERE id = ?', [id]);
};

// ── Log CRUD ───────────────────────────────────────────

export const insertLog = (
  oshi_id: number,
  type: LogType,
  date: string,
  amount: number,
  memo: string,
  photo_path: string
): number => {
  const now = new Date().toISOString();
  const result = db.runSync(
    'INSERT INTO logs (oshi_id, type, date, amount, memo, photo_path, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [oshi_id, type, date, amount, memo, photo_path, now]
  );
  return result.lastInsertRowId;
};

export const getLogsByOshiId = (oshi_id: number): OshiLog[] => {
  return db.getAllSync<OshiLog>(
    'SELECT * FROM logs WHERE oshi_id = ? ORDER BY date DESC',
    [oshi_id]
  );
};

export const getLogsByDate = (date: string): OshiLog[] => {
  return db.getAllSync<OshiLog>(
    'SELECT * FROM logs WHERE date = ? ORDER BY created_at DESC',
    [date]
  );
};

export const getAllLogs = (): OshiLog[] => {
  return db.getAllSync<OshiLog>('SELECT * FROM logs ORDER BY date DESC');
};

export const deleteLog = (id: number): void => {
  db.runSync('DELETE FROM logs WHERE id = ?', [id]);
};

export const getTotalAmountByOshiId = (oshi_id: number): number => {
  const row = db.getFirstSync<{ total: number }>(
    'SELECT COALESCE(SUM(amount), 0) as total FROM logs WHERE oshi_id = ?',
    [oshi_id]
  );
  return row?.total ?? 0;
};

export const getLogCountByOshiId = (oshi_id: number): number => {
  const row = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM logs WHERE oshi_id = ?',
    [oshi_id]
  );
  return row?.count ?? 0;
};
