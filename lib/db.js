import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

import { hashPassword } from './auth.js';
import { managedImageKeys } from '../app/content/homepage.js';

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

  seedPublicContent(database);

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

function seedPublicContent(database) {
  const timestamp = nowIso();
  const setting = database.prepare(`
    INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)
    ON CONFLICT(key) DO NOTHING
  `);
  for (const [key, value] of [
    ['site_name', 'LP Flange'],
    ['logo_url', '/images/lpflange-wordmark.png'],
    ['sales_email', 'sales@lpflange.com'],
    ['sales_phone', '+86 178 2647 2173'],
    ['whatsapp_url', 'https://wa.me/8617826472173'],
    ['address', 'Jiangsu, China']
  ]) setting.run(key, value, timestamp);

  const category = database.prepare(`
    INSERT INTO product_categories (name, slug, description, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO NOTHING
  `);
  for (const [name, slug, description, sortOrder] of [
    ['Standard Flanges', 'standard-flanges', 'Common stainless steel flange types for industrial supply.', 10],
    ['Other Flanges', 'other-flanges', 'Specialized flange components for process and equipment systems.', 20],
    ['Custom Solutions', 'custom-solutions', 'Drawing-based and non-standard stainless steel flange work.', 30],
    ['Pipework Components', 'pipework-components', 'Related stainless steel fittings and connection components.', 40]
  ]) category.run(name, slug, description, sortOrder, timestamp, timestamp);

  const image = database.prepare(`
    INSERT INTO page_images (page_key, section_key, image_url, alt_text, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(page_key, section_key) DO NOTHING
  `);
  for (const [index, record] of managedImageKeys.entries()) {
    image.run(record.pageKey, record.sectionKey, record.imageUrl, record.altText, index, timestamp, timestamp);
  }
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
