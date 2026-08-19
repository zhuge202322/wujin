import { dataResponse, errorResponse, productJson, readJson, requireApiAdmin } from '../../../../lib/admin-api.js';
import { getDatabase, nowIso } from '../../../../lib/db.js';
import { ValidationError, validateProductInput } from '../../../../lib/validation.js';

const productSelect = `
  SELECT products.*, product_categories.name AS category_name
  FROM products LEFT JOIN product_categories ON product_categories.id = products.category_id
`;

function ensureCategory(database, categoryId) {
  if (categoryId !== null && !database.prepare('SELECT 1 FROM product_categories WHERE id = ?').get(categoryId)) {
    throw new ValidationError('The selected category does not exist.', 'INVALID_CATEGORY');
  }
}

export async function GET(request) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  const rows = getDatabase().prepare(`${productSelect} ORDER BY products.sort_order, products.id`).all();
  return dataResponse(rows.map(productJson));
}

export async function POST(request) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  try {
    const input = validateProductInput(await readJson(request));
    const database = getDatabase();
    ensureCategory(database, input.categoryId);
    const timestamp = nowIso();
    const result = database.prepare(`
      INSERT INTO products (category_id, name, slug, description, image_url, image_alt, sort_order, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(input.categoryId, input.name, input.slug, input.description ?? null, input.imageUrl ?? null, input.imageAlt ?? null, input.sortOrder, Number(input.isActive), timestamp, timestamp);
    return dataResponse(productJson(database.prepare(`${productSelect} WHERE products.id = ?`).get(result.lastInsertRowid)), 201);
  } catch (error) {
    return errorResponse(error);
  }
}

export { ensureCategory, productSelect };
