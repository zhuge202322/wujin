import { getAdminFromRequest, unauthorizedResponse } from './auth.js';
import { ValidationError } from './validation.js';

export async function readJson(request) {
  try {
    const value = await request.json();
    if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error();
    return value;
  } catch {
    throw new ValidationError('The request body must be a JSON object.', 'INVALID_JSON');
  }
}

export function requireApiAdmin(request) {
  const admin = getAdminFromRequest(request);
  return admin ? { admin } : { response: unauthorizedResponse() };
}

export function dataResponse(data, status = 200) {
  return Response.json({ data }, { status });
}

export function errorResponse(error) {
  if (error instanceof ValidationError) {
    return Response.json({ error: { code: error.code, message: error.message } }, { status: 422 });
  }
  const message = String(error?.message || '');
  if (/UNIQUE constraint failed/i.test(message)) {
    return Response.json({ error: { code: 'CONFLICT', message: 'A record with the same unique value already exists.' } }, { status: 409 });
  }
  if (/FOREIGN KEY constraint failed/i.test(message)) {
    return Response.json({ error: { code: 'RECORD_IN_USE', message: 'This record is still referenced and cannot be deleted.' } }, { status: 409 });
  }
  console.error(error);
  return Response.json({ error: { code: 'INTERNAL_ERROR', message: 'The request could not be completed.' } }, { status: 500 });
}

export async function routeId(context) {
  const params = await context.params;
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) throw new ValidationError('A valid record id is required.');
  return id;
}

export function notFoundResponse(resource = 'Record') {
  return Response.json({ error: { code: 'NOT_FOUND', message: `${resource} was not found.` } }, { status: 404 });
}

export function categoryJson(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function productJson(row) {
  return {
    id: row.id,
    categoryId: row.category_id,
    categoryName: row.category_name ?? null,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imageUrl: row.image_url,
    imageAlt: row.image_alt,
    sortOrder: row.sort_order,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function socialLinkJson(row) {
  return {
    id: row.id,
    platform: row.platform,
    label: row.label,
    url: row.url,
    sortOrder: row.sort_order,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function imageJson(row) {
  return {
    id: row.id,
    pageKey: row.page_key,
    sectionKey: row.section_key,
    imageUrl: row.image_url,
    altText: row.alt_text,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
