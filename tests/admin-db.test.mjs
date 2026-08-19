import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';

import { initDatabase } from '../lib/db.js';

async function withDatabase(run) {
  const directory = await mkdtemp(path.join(tmpdir(), 'lpflange-db-'));
  const database = new Database(path.join(directory, 'test.sqlite'));
  try {
    initDatabase(database, { seedAdmin: false });
    await run(database);
  } finally {
    database.close();
    await rm(directory, { recursive: true, force: true });
  }
}

test('initialization creates the admin backoffice schema and is idempotent', async () => {
  await withDatabase((database) => {
    initDatabase(database, { seedAdmin: false });
    const tables = database.prepare(`
      SELECT name FROM sqlite_master
      WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `).all();

    assert.deepEqual(tables.map(({ name }) => name), [
      'admin_users',
      'page_images',
      'product_categories',
      'products',
      'site_settings',
      'social_links'
    ]);
  });
});

test('categories cannot be deleted while products reference them', async () => {
  await withDatabase((database) => {
    const now = new Date().toISOString();
    const category = database.prepare(`
      INSERT INTO product_categories (name, slug, created_at, updated_at)
      VALUES (?, ?, ?, ?)
    `).run('Weld Neck', 'weld-neck', now, now);
    database.prepare(`
      INSERT INTO products (category_id, name, slug, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(category.lastInsertRowid, 'ANSI Weld Neck', 'ansi-weld-neck', now, now);

    assert.throws(
      () => database.prepare('DELETE FROM product_categories WHERE id = ?').run(category.lastInsertRowid),
      /FOREIGN KEY constraint failed/i
    );
  });
});

test('page and section image keys are unique together', async () => {
  await withDatabase((database) => {
    const now = new Date().toISOString();
    const insert = database.prepare(`
      INSERT INTO page_images (page_key, section_key, image_url, alt_text, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insert.run('home', 'hero-slide-1', '/images/one.jpg', 'One', now, now);
    assert.throws(
      () => insert.run('home', 'hero-slide-1', '/images/two.jpg', 'Two', now, now),
      /UNIQUE constraint failed/i
    );
  });
});
