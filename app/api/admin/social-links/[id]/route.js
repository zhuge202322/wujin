import { dataResponse, errorResponse, notFoundResponse, readJson, requireApiAdmin, routeId, socialLinkJson } from '../../../../../lib/admin-api.js';
import { getDatabase, nowIso } from '../../../../../lib/db.js';
import { validateSocialLinkInput } from '../../../../../lib/validation.js';

export async function PATCH(request, context) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  try {
    const id = await routeId(context);
    const database = getDatabase();
    const current = database.prepare('SELECT * FROM social_links WHERE id = ?').get(id);
    if (!current) return notFoundResponse('Social link');
    const changes = validateSocialLinkInput(await readJson(request), { partial: true });
    const next = {
      platform: changes.platform ?? current.platform,
      label: changes.label ?? current.label,
      url: changes.url ?? current.url,
      sortOrder: changes.sortOrder ?? current.sort_order,
      isActive: changes.isActive !== undefined ? changes.isActive : Boolean(current.is_active)
    };
    database.prepare(`
      UPDATE social_links SET platform = ?, label = ?, url = ?, sort_order = ?, is_active = ?, updated_at = ? WHERE id = ?
    `).run(next.platform, next.label, next.url, next.sortOrder, Number(next.isActive), nowIso(), id);
    return dataResponse(socialLinkJson(database.prepare('SELECT * FROM social_links WHERE id = ?').get(id)));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request, context) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  try {
    const id = await routeId(context);
    const result = getDatabase().prepare('DELETE FROM social_links WHERE id = ?').run(id);
    if (!result.changes) return notFoundResponse('Social link');
    return dataResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}
