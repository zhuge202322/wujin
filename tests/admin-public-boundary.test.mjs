import test from 'node:test';
import assert from 'node:assert/strict';

import { managedImageKeys } from '../app/content/homepage.js';

test('managed image registry covers the public pages and uses stable unique keys', () => {
  const pages = new Set(managedImageKeys.map((record) => record.pageKey));
  assert.deepEqual([...pages].sort(), ['about', 'custom-machining', 'home', 'products', 'site', 'standards', 'technical-resources']);
  assert.equal(new Set(managedImageKeys.map(({ pageKey, sectionKey }) => `${pageKey}:${sectionKey}`)).size, managedImageKeys.length);
  assert.ok(managedImageKeys.every(({ pageKey, sectionKey, imageUrl, altText }) => pageKey && sectionKey && imageUrl && altText));
});
