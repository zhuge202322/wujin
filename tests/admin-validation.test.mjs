import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import {
  normalizeSlug,
  requireHttpUrl,
  requireInteger,
  validateCategoryInput,
  validateImageMetadata
} from '../lib/validation.js';
import { MAX_UPLOAD_BYTES, removeUpload, saveUpload, validateUpload } from '../lib/uploads.js';

test('validation normalizes slugs and rejects invalid structured fields', () => {
  assert.equal(normalizeSlug('  Weld Neck Flanges  '), 'weld-neck-flanges');
  assert.equal(requireInteger('12', 'sortOrder', { min: 0, max: 9999 }), 12);
  assert.equal(requireHttpUrl('https://example.com/path', 'url'), 'https://example.com/path');
  assert.throws(() => requireHttpUrl('javascript:alert(1)', 'url'), /HTTP or HTTPS/i);
  assert.throws(() => validateCategoryInput({ name: 'Valid', unexpected: true }), /Unknown field/i);
});

test('image metadata requires stable page/section keys and alt text', () => {
  assert.deepEqual(validateImageMetadata({
    pageKey: 'home',
    sectionKey: 'hero-slide-1',
    imageUrl: '/uploads/example.webp',
    altText: 'Stainless steel flanges',
    sortOrder: 1
  }), {
    pageKey: 'home',
    sectionKey: 'hero-slide-1',
    imageUrl: '/uploads/example.webp',
    altText: 'Stainless steel flanges',
    sortOrder: 1
  });
  assert.throws(() => validateImageMetadata({
    pageKey: 'home page', sectionKey: 'hero', imageUrl: '/x.jpg', altText: 'Image'
  }), /pageKey/i);
});

test('uploads accept matching image types, cap size, and remove only managed files', async () => {
  const uploadDirectory = await mkdtemp(path.join(tmpdir(), 'lpflange-uploads-'));
  try {
    const validFile = new File([Buffer.from('fake-png')], 'flange.png', { type: 'image/png' });
    assert.deepEqual(validateUpload(validFile), { extension: '.png', mimeType: 'image/png', size: 8 });

    const tooLarge = new File([new Uint8Array(MAX_UPLOAD_BYTES + 1)], 'large.png', { type: 'image/png' });
    assert.throws(() => validateUpload(tooLarge), /10 MB/i);
    assert.throws(
      () => validateUpload(new File(['x'], 'image.jpg', { type: 'image/png' })),
      /extension/i
    );

    const saved = await saveUpload(validFile, { root: uploadDirectory });
    assert.match(saved.imageUrl, /^\/uploads\/[a-f0-9]{32}\.png$/);
    assert.equal((await readFile(saved.absolutePath)).toString(), 'fake-png');
    assert.equal(await removeUpload(saved.imageUrl, { root: uploadDirectory }), true);

    const outside = path.join(uploadDirectory, '..', 'outside.txt');
    await writeFile(outside, 'keep');
    assert.equal(await removeUpload('/outside.txt', { root: uploadDirectory }), false);
    assert.equal((await readFile(outside)).toString(), 'keep');
    await rm(outside, { force: true });
  } finally {
    await rm(uploadDirectory, { recursive: true, force: true });
  }
});
