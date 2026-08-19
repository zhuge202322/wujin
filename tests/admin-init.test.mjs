import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import Database from 'better-sqlite3';

const projectRoot = new URL('..', import.meta.url);

test('db:init creates exactly one configured administrator and is idempotent', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'lpflange-init-'));
  const databasePath = path.join(directory, 'admin.sqlite');
  const environment = {
    ...process.env,
    LPFLANGE_DB_PATH: databasePath,
    LPFLANGE_ADMIN_USERNAME: 'site-admin',
    LPFLANGE_ADMIN_PASSWORD: 'initial-password-2026',
    LPFLANGE_SESSION_SECRET: 'test-secret-long-enough-for-init'
  };
  try {
    const first = spawnSync(process.execPath, ['scripts/db-init.mjs'], {
      cwd: projectRoot,
      env: environment,
      encoding: 'utf8'
    });
    const second = spawnSync(process.execPath, ['scripts/db-init.mjs'], {
      cwd: projectRoot,
      env: { ...environment, LPFLANGE_ADMIN_PASSWORD: 'a-different-password-2026' },
      encoding: 'utf8'
    });
    assert.equal(first.status, 0, first.stderr);
    assert.equal(second.status, 0, second.stderr);

    const database = new Database(databasePath, { readonly: true });
    const users = database.prepare('SELECT username, password_hash FROM admin_users').all();
    database.close();
    assert.equal(users.length, 1);
    assert.equal(users[0].username, 'site-admin');
    assert.match(users[0].password_hash, /^scrypt\$/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('db:init refuses to invent a first-run password', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'lpflange-init-missing-'));
  const databasePath = path.join(directory, 'admin.sqlite');
  const environment = { ...process.env, LPFLANGE_DB_PATH: databasePath };
  delete environment.LPFLANGE_ADMIN_PASSWORD;
  try {
    const result = spawnSync(process.execPath, ['scripts/db-init.mjs'], {
      cwd: projectRoot,
      env: environment,
      encoding: 'utf8'
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /LPFLANGE_ADMIN_PASSWORD is required/i);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
