import { dataResponse, errorResponse, imageJson, readJson, requireApiAdmin } from '../../../../lib/admin-api.js';
import { getDatabase, nowIso } from '../../../../lib/db.js';
import { validateImageMetadata } from '../../../../lib/validation.js';

export async function GET(request) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  const rows = getDatabase().prepare('SELECT * FROM page_images ORDER BY page_key, sort_order, id').all();
  return dataResponse(rows.map(imageJson));
}

export async function POST(request) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  try {
    const input = validateImageMetadata(await readJson(request));
    const timestamp = nowIso();
    const database = getDatabase();
    const result = database.prepare(`
      INSERT INTO page_images (page_key, section_key, image_url, alt_text, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(input.pageKey, input.sectionKey, input.imageUrl, input.altText, input.sortOrder, timestamp, timestamp);
    return dataResponse(imageJson(database.prepare('SELECT * FROM page_images WHERE id = ?').get(result.lastInsertRowid)), 201);
  } catch (error) {
    return errorResponse(error);
  }
}
