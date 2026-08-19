import { dataResponse, errorResponse, readJson, requireApiAdmin, socialLinkJson } from '../../../../lib/admin-api.js';
import { getDatabase, nowIso } from '../../../../lib/db.js';
import { validateSocialLinkInput } from '../../../../lib/validation.js';

export async function GET(request) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  return dataResponse(getDatabase().prepare('SELECT * FROM social_links ORDER BY sort_order, id').all().map(socialLinkJson));
}

export async function POST(request) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  try {
    const input = validateSocialLinkInput(await readJson(request));
    const timestamp = nowIso();
    const database = getDatabase();
    const result = database.prepare(`
      INSERT INTO social_links (platform, label, url, sort_order, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(input.platform, input.label, input.url, input.sortOrder, Number(input.isActive), timestamp, timestamp);
    return dataResponse(socialLinkJson(database.prepare('SELECT * FROM social_links WHERE id = ?').get(result.lastInsertRowid)), 201);
  } catch (error) {
    return errorResponse(error);
  }
}
