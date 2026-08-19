export class ValidationError extends Error {
  constructor(message, code = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
  }
}

function rejectUnknownFields(input, fields) {
  for (const key of Object.keys(input)) {
    if (!fields.includes(key)) throw new ValidationError(`Unknown field: ${key}.`);
  }
}

export function requireString(value, field, options = {}) {
  if (typeof value !== 'string' || !value.trim()) throw new ValidationError(`${field} is required.`);
  const result = value.trim();
  if (result.length > (options.max ?? 160)) throw new ValidationError(`${field} is too long.`);
  return result;
}

export function optionalString(value, field, options = {}) {
  if (value === undefined || value === null || value === '') return null;
  return requireString(value, field, options);
}

export function normalizeSlug(value, field = 'slug') {
  const result = requireString(value, field).toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!result || result.length > 160) throw new ValidationError(`${field} must contain letters or numbers.`);
  return result;
}

export function requireKey(value, field) {
  const result = requireString(value, field, { max: 120 });
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result)) {
    throw new ValidationError(`${field} must use lowercase letters, numbers, and hyphens.`);
  }
  return result;
}

export function requireInteger(value, field, options = {}) {
  const number = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (!Number.isInteger(number)) throw new ValidationError(`${field} must be an integer.`);
  if (options.min !== undefined && number < options.min) throw new ValidationError(`${field} is too small.`);
  if (options.max !== undefined && number > options.max) throw new ValidationError(`${field} is too large.`);
  return number;
}

export function requireHttpUrl(value, field) {
  const result = requireString(value, field, { max: 500 });
  let url;
  try {
    url = new URL(result);
  } catch {
    throw new ValidationError(`${field} must be a valid HTTP or HTTPS URL.`);
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new ValidationError(`${field} must be a valid HTTP or HTTPS URL.`);
  }
  return url.toString();
}

export function requireImageUrl(value, field = 'imageUrl') {
  const result = requireString(value, field, { max: 500 });
  if (result.startsWith('/')) return result;
  return requireHttpUrl(result, field);
}

export function validateCategoryInput(input, options = {}) {
  rejectUnknownFields(input, ['name', 'slug', 'description', 'sortOrder']);
  const output = {};
  if (!options.partial || input.name !== undefined) output.name = requireString(input.name, 'name');
  if (!options.partial || input.slug !== undefined) output.slug = normalizeSlug(input.slug);
  if (input.description !== undefined) output.description = optionalString(input.description, 'description', { max: 500 });
  if (!options.partial || input.sortOrder !== undefined) output.sortOrder = requireInteger(input.sortOrder ?? 0, 'sortOrder', { min: 0, max: 9999 });
  return output;
}

export function validateProductInput(input, options = {}) {
  rejectUnknownFields(input, ['categoryId', 'name', 'slug', 'description', 'imageUrl', 'imageAlt', 'sortOrder', 'isActive']);
  const output = {};
  if (input.categoryId !== undefined || !options.partial) {
    output.categoryId = input.categoryId === null || input.categoryId === '' ? null : requireInteger(input.categoryId, 'categoryId', { min: 1 });
  }
  if (!options.partial || input.name !== undefined) output.name = requireString(input.name, 'name');
  if (!options.partial || input.slug !== undefined) output.slug = normalizeSlug(input.slug);
  if (input.description !== undefined) output.description = optionalString(input.description, 'description', { max: 500 });
  if (input.imageUrl !== undefined) output.imageUrl = input.imageUrl ? requireImageUrl(input.imageUrl) : null;
  if (input.imageAlt !== undefined) output.imageAlt = optionalString(input.imageAlt, 'imageAlt', { max: 500 });
  if (!options.partial || input.sortOrder !== undefined) output.sortOrder = requireInteger(input.sortOrder ?? 0, 'sortOrder', { min: 0, max: 9999 });
  if (!options.partial || input.isActive !== undefined) {
    if (typeof (input.isActive ?? true) !== 'boolean') throw new ValidationError('isActive must be true or false.');
    output.isActive = input.isActive ?? true;
  }
  return output;
}

export function validateSocialLinkInput(input, options = {}) {
  rejectUnknownFields(input, ['platform', 'label', 'url', 'sortOrder', 'isActive']);
  const output = {};
  if (!options.partial || input.platform !== undefined) output.platform = requireString(input.platform, 'platform');
  if (!options.partial || input.label !== undefined) output.label = requireString(input.label, 'label');
  if (!options.partial || input.url !== undefined) output.url = requireHttpUrl(input.url, 'url');
  if (!options.partial || input.sortOrder !== undefined) output.sortOrder = requireInteger(input.sortOrder ?? 0, 'sortOrder', { min: 0, max: 9999 });
  if (!options.partial || input.isActive !== undefined) {
    if (typeof (input.isActive ?? true) !== 'boolean') throw new ValidationError('isActive must be true or false.');
    output.isActive = input.isActive ?? true;
  }
  return output;
}

export function validateImageMetadata(input, options = {}) {
  rejectUnknownFields(input, ['pageKey', 'sectionKey', 'imageUrl', 'altText', 'sortOrder']);
  const output = {};
  if (!options.partial || input.pageKey !== undefined) output.pageKey = requireKey(input.pageKey, 'pageKey');
  if (!options.partial || input.sectionKey !== undefined) output.sectionKey = requireKey(input.sectionKey, 'sectionKey');
  if (!options.partial || input.imageUrl !== undefined) output.imageUrl = requireImageUrl(input.imageUrl);
  if (!options.partial || input.altText !== undefined) output.altText = requireString(input.altText, 'altText', { max: 500 });
  if (!options.partial || input.sortOrder !== undefined) output.sortOrder = requireInteger(input.sortOrder ?? 0, 'sortOrder', { min: 0, max: 9999 });
  return output;
}

export const EDITABLE_SETTING_KEYS = new Set([
  'site_name', 'logo_url', 'sales_email', 'sales_phone', 'whatsapp_url', 'address'
]);

export function requireSettingKey(key) {
  if (!EDITABLE_SETTING_KEYS.has(key)) throw new ValidationError(`Setting ${key} is not editable.`);
  return key;
}
