import { createSessionToken, sessionCookieOptions, SESSION_COOKIE_NAME, verifyPassword } from '../../../../lib/auth.js';
import { dataResponse, readJson } from '../../../../lib/admin-api.js';
import { getDatabase } from '../../../../lib/db.js';

function serializeCookie(name, value, options) {
  const parts = [
    `${name}=${value}`,
    `Path=${options.path}`,
    `Max-Age=${options.maxAge}`,
    'HttpOnly',
    `SameSite=${options.sameSite === 'lax' ? 'Lax' : options.sameSite}`
  ];
  if (options.secure) parts.push('Secure');
  return parts.join('; ');
}

export async function POST(request) {
  let input;
  try {
    input = await readJson(request);
  } catch {
    return Response.json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password.' } }, { status: 401 });
  }
  const user = getDatabase().prepare('SELECT * FROM admin_users WHERE username = ? LIMIT 1').get(String(input.username || ''));
  if (!user || !verifyPassword(String(input.password || ''), user.password_hash)) {
    return Response.json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password.' } }, { status: 401 });
  }
  const response = dataResponse({ user: { id: user.id, username: user.username } });
  const token = createSessionToken({ userId: user.id, username: user.username });
  response.headers.set('set-cookie', serializeCookie(SESSION_COOKIE_NAME, token, sessionCookieOptions()));
  return response;
}
