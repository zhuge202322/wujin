import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

import { hashPassword } from './auth.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let databaseInstance;

export function nowIso() {
  return new Date().toISOString();
}

export function resolveDatabasePath() {
  const configured = process.env.LPFLANGE_DB_PATH || 'data/lpflange.sqlite';
  return path.isAbsolute(configured) ? configured : path.resolve(projectRoot, configured);
}

export function initDatabase(database, options = {}) {
  database.pragma('foreign_keys = ON');
  database.pragma('journal_mode = WAL');
  database.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS product_categories (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      category_id INTEGER REFERENCES product_categories(id) ON DELETE RESTRICT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      image_url TEXT,
      image_alt TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS social_links (
      id INTEGER PRIMARY KEY,
      platform TEXT NOT NULL,
      label TEXT NOT NULL,
      url TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS page_images (
      id INTEGER PRIMARY KEY,
      page_key TEXT NOT NULL,
      section_key TEXT NOT NULL,
      image_url TEXT NOT NULL,
      alt_text TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(page_key, section_key)
    );
  `);

  if (options.seedAdmin) {
    const userCount = database.prepare('SELECT COUNT(*) AS count FROM admin_users').get().count;
    if (userCount === 0) {
      const password = process.env.LPFLANGE_ADMIN_PASSWORD;
      if (!password) throw new Error('LPFLANGE_ADMIN_PASSWORD is required to create the first administrator.');
      const username = process.env.LPFLANGE_ADMIN_USERNAME || 'admin';
      const timestamp = nowIso();
      database.prepare(`
        INSERT INTO admin_users (username, password_hash, created_at, updated_at)
        VALUES (?, ?, ?, ?)
      `).run(username, hashPassword(password), timestamp, timestamp);
    }
  }

  return database;
}

export function getDatabase() {
  if (!databaseInstance) {
    const filename = resolveDatabasePath();
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    databaseInstance = initDatabase(new Database(filename), { seedAdmin: false });
  }
  return databaseInstance;
}

export function closeDatabaseForTests() {
  if (databaseInstance) databaseInstance.close();
  databaseInstance = undefined;
}
