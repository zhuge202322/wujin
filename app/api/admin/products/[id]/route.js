import { dataResponse, errorResponse, notFoundResponse, productJson, readJson, requireApiAdmin, routeId } from '../../../../../lib/admin-api.js';
import { getDatabase, nowIso } from '../../../../../lib/db.js';
import { validateProductInput } from '../../../../../lib/validation.js';
import { ensureCategory, productSelect } from '../route.js';

export async function PATCH(request, context) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  try {
    const id = await routeId(context);
    const database = getDatabase();
    const current = database.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!current) return notFoundResponse('Product');
    const changes = validateProductInput(await readJson(request), { partial: true });
    const next = {
      categoryId: changes.categoryId !== undefined ? changes.categoryId : current.category_id,
      name: changes.name ?? current.name,
      slug: changes.slug ?? current.slug,
      description: changes.description !== undefined ? changes.description : current.description,
      imageUrl: changes.imageUrl !== undefined ? changes.imageUrl : current.image_url,
      imageAlt: changes.imageAlt !== undefined ? changes.imageAlt : current.image_alt,
      sortOrder: changes.sortOrder ?? current.sort_order,
      isActive: changes.isActive !== undefined ? changes.isActive : Boolean(current.is_active)
    };
    ensureCategory(database, next.categoryId);
    database.prepare(`
      UPDATE products SET category_id = ?, name = ?, slug = ?, description = ?, image_url = ?, image_alt = ?,
      sort_order = ?, is_active = ?, updated_at = ? WHERE id = ?
    `).run(next.categoryId, next.name, next.slug, next.description, next.imageUrl, next.imageAlt, next.sortOrder, Number(next.isActive), nowIso(), id);
    return dataResponse(productJson(database.prepare(`${productSelect} WHERE products.id = ?`).get(id)));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request, context) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  try {
    const id = await routeId(context);
    const result = getDatabase().prepare('DELETE FROM products WHERE id = ?').run(id);
    if (!result.changes) return notFoundResponse('Product');
    return dataResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}
