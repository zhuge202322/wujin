import { categoryJson, dataResponse, errorResponse, notFoundResponse, readJson, requireApiAdmin, routeId } from '../../../../../lib/admin-api.js';
import { getDatabase, nowIso } from '../../../../../lib/db.js';
import { validateCategoryInput } from '../../../../../lib/validation.js';

export async function PATCH(request, context) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  try {
    const id = await routeId(context);
    const database = getDatabase();
    const current = database.prepare('SELECT * FROM product_categories WHERE id = ?').get(id);
    if (!current) return notFoundResponse('Category');
    const changes = validateCategoryInput(await readJson(request), { partial: true });
    const next = {
      name: changes.name ?? current.name,
      slug: changes.slug ?? current.slug,
      description: changes.description !== undefined ? changes.description : current.description,
      sortOrder: changes.sortOrder ?? current.sort_order
    };
    database.prepare(`
      UPDATE product_categories SET name = ?, slug = ?, description = ?, sort_order = ?, updated_at = ? WHERE id = ?
    `).run(next.name, next.slug, next.description, next.sortOrder, nowIso(), id);
    return dataResponse(categoryJson(database.prepare('SELECT * FROM product_categories WHERE id = ?').get(id)));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request, context) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  try {
    const id = await routeId(context);
    const result = getDatabase().prepare('DELETE FROM product_categories WHERE id = ?').run(id);
    if (!result.changes) return notFoundResponse('Category');
    return dataResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}
