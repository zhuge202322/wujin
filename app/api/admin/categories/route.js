import { categoryJson, dataResponse, errorResponse, readJson, requireApiAdmin } from '../../../../lib/admin-api.js';
import { getDatabase, nowIso } from '../../../../lib/db.js';
import { validateCategoryInput } from '../../../../lib/validation.js';

export async function GET(request) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  const rows = getDatabase().prepare('SELECT * FROM product_categories ORDER BY sort_order, id').all();
  return dataResponse(rows.map(categoryJson));
}

export async function POST(request) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  try {
    const input = validateCategoryInput(await readJson(request));
    const timestamp = nowIso();
    const result = getDatabase().prepare(`
      INSERT INTO product_categories (name, slug, description, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(input.name, input.slug, input.description ?? null, input.sortOrder, timestamp, timestamp);
    return dataResponse(categoryJson(getDatabase().prepare('SELECT * FROM product_categories WHERE id = ?').get(result.lastInsertRowid)), 201);
  } catch (error) {
    return errorResponse(error);
  }
}
