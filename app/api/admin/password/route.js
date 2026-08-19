import { dataResponse, errorResponse, readJson, requireApiAdmin } from '../../../../lib/admin-api.js';
import { hashPassword, verifyPassword } from '../../../../lib/auth.js';
import { getDatabase, nowIso } from '../../../../lib/db.js';
import { requireString } from '../../../../lib/validation.js';

export async function POST(request) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  try {
    const input = await readJson(request);
    const currentPassword = requireString(input.currentPassword, 'currentPassword', { max: 128 });
    const newPassword = requireString(input.newPassword, 'newPassword', { max: 128 });
    const database = getDatabase();
    const user = database.prepare('SELECT * FROM admin_users WHERE id = ?').get(auth.admin.userId);
    if (!user || !verifyPassword(currentPassword, user.password_hash)) {
      return Response.json({ error: { code: 'INVALID_CURRENT_PASSWORD', message: 'The current password is incorrect.' } }, { status: 400 });
    }
    const passwordHash = hashPassword(newPassword);
    database.prepare('UPDATE admin_users SET password_hash = ?, updated_at = ? WHERE id = ?')
      .run(passwordHash, nowIso(), user.id);
    return dataResponse({ changed: true });
  } catch (error) {
    return errorResponse(error);
  }
}
