import { dataResponse } from '../../../../lib/admin-api.js';
import { SESSION_COOKIE_NAME } from '../../../../lib/auth.js';

export async function POST() {
  const response = dataResponse({ loggedOut: true });
  response.headers.set('set-cookie', `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  return response;
}
