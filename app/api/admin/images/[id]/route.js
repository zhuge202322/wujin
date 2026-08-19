import { dataResponse, errorResponse, imageJson, notFoundResponse, readJson, requireApiAdmin, routeId } from '../../../../../lib/admin-api.js';
import { getDatabase, nowIso } from '../../../../../lib/db.js';
import { removeUpload } from '../../../../../lib/uploads.js';
import { validateImageMetadata } from '../../../../../lib/validation.js';

async function removeAfterWrite(imageUrl) {
  try {
    await removeUpload(imageUrl);
  } catch (error) {
    console.error('Unable to remove replaced upload:', error);
  }
}

export async function PATCH(request, context) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  try {
    const id = await routeId(context);
    const database = getDatabase();
    const current = database.prepare('SELECT * FROM page_images WHERE id = ?').get(id);
    if (!current) return notFoundResponse('Image');
    const changes = validateImageMetadata(await readJson(request), { partial: true });
    const next = {
      pageKey: changes.pageKey ?? current.page_key,
      sectionKey: changes.sectionKey ?? current.section_key,
      imageUrl: changes.imageUrl ?? current.image_url,
      altText: changes.altText ?? current.alt_text,
      sortOrder: changes.sortOrder ?? current.sort_order
    };
    database.prepare(`
      UPDATE page_images SET page_key = ?, section_key = ?, image_url = ?, alt_text = ?, sort_order = ?, updated_at = ?
      WHERE id = ?
    `).run(next.pageKey, next.sectionKey, next.imageUrl, next.altText, next.sortOrder, nowIso(), id);
    if (next.imageUrl !== current.image_url) await removeAfterWrite(current.image_url);
    return dataResponse(imageJson(database.prepare('SELECT * FROM page_images WHERE id = ?').get(id)));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request, context) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  try {
    const id = await routeId(context);
    const database = getDatabase();
    const current = database.prepare('SELECT * FROM page_images WHERE id = ?').get(id);
    if (!current) return notFoundResponse('Image');
    database.prepare('DELETE FROM page_images WHERE id = ?').run(id);
    await removeAfterWrite(current.image_url);
    return dataResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}
