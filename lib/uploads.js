import { randomBytes } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ValidationError } from './validation.js';

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const allowedTypes = new Map([
  ['image/jpeg', new Set(['.jpg', '.jpeg'])],
  ['image/png', new Set(['.png'])],
  ['image/webp', new Set(['.webp'])],
  ['image/svg+xml', new Set(['.svg'])]
]);

export function uploadRoot() {
  return path.join(projectRoot, 'public', 'uploads');
}

export function validateUpload(file) {
  if (!file || typeof file.name !== 'string' || typeof file.arrayBuffer !== 'function') {
    throw new ValidationError('An image file is required.', 'INVALID_UPLOAD');
  }
  if (file.size <= 0) throw new ValidationError('The uploaded file is empty.', 'INVALID_UPLOAD');
  if (file.size > MAX_UPLOAD_BYTES) throw new ValidationError('Images must be 10 MB or smaller.', 'UPLOAD_TOO_LARGE');
  const extension = path.extname(file.name).toLowerCase();
  const extensions = allowedTypes.get(file.type);
  if (!extensions) throw new ValidationError('Only JPEG, PNG, WebP, and SVG images are allowed.', 'INVALID_UPLOAD_TYPE');
  if (!extensions.has(extension)) throw new ValidationError('The file extension does not match its image type.', 'INVALID_UPLOAD_TYPE');
  return { extension, mimeType: file.type, size: file.size };
}

export async function saveUpload(file, options = {}) {
  const metadata = validateUpload(file);
  const root = path.resolve(options.root || uploadRoot());
  await mkdir(root, { recursive: true });
  const filename = `${randomBytes(16).toString('hex')}${metadata.extension}`;
  const absolutePath = path.join(root, filename);
  await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()), { flag: 'wx' });
  return {
    imageUrl: `/uploads/${filename}`,
    absolutePath,
    mimeType: metadata.mimeType,
    size: metadata.size
  };
}

export async function removeUpload(publicUrl, options = {}) {
  if (typeof publicUrl !== 'string' || !/^\/uploads\/[a-f0-9]{32}\.(?:jpe?g|png|webp|svg)$/.test(publicUrl)) return false;
  const root = path.resolve(options.root || uploadRoot());
  const target = path.resolve(root, path.posix.basename(publicUrl));
  if (path.dirname(target) !== root) return false;
  await rm(target, { force: true });
  return true;
}
