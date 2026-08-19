import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SESSION_TTL_MS,
  createSessionToken,
  hashPassword,
  verifyPassword,
  verifySessionToken
} from '../lib/auth.js';

test('password hashes use random salts and verify without exposing the password', () => {
  const first = hashPassword('a sufficiently long password');
  const second = hashPassword('a sufficiently long password');

  assert.notEqual(first, second);
  assert.equal(first.includes('a sufficiently long password'), false);
  assert.equal(verifyPassword('a sufficiently long password', first), true);
  assert.equal(verifyPassword('incorrect password', first), false);
});

test('signed sessions round trip and reject tampering', () => {
  const options = { secret: 'test-session-secret-that-is-long', now: 1_000 };
  const token = createSessionToken({ userId: 7, username: 'admin' }, options);

  assert.deepEqual(verifySessionToken(token, options), {
    userId: 7,
    username: 'admin',
    exp: 1_000 + SESSION_TTL_MS
  });
  assert.equal(verifySessionToken(`${token}changed`, options), null);
});

test('signed sessions reject expired tokens and the wrong secret', () => {
  const token = createSessionToken(
    { userId: 1, username: 'admin' },
    { secret: 'first-test-secret-long-enough', now: 5_000 }
  );

  assert.equal(verifySessionToken(token, {
    secret: 'first-test-secret-long-enough',
    now: 5_000 + SESSION_TTL_MS + 1
  }), null);
  assert.equal(verifySessionToken(token, {
    secret: 'second-test-secret-long-enough',
    now: 5_000
  }), null);
});
