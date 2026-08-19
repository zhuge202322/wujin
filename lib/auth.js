import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual
} from 'node:crypto';

export const SESSION_COOKIE_NAME = 'lpflange_admin_session';
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_COST = 16_384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;

function sessionSecret(explicitSecret) {
  const secret = explicitSecret || process.env.LPFLANGE_SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('LPFLANGE_SESSION_SECRET is required in production.');
  }
  return secret || 'lpflange-local-development-session-secret';
}

function sign(value, secret) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) {
    throw new Error('Password must be between 12 and 128 characters.');
  }
  const salt = randomBytes(16);
  const derivedKey = scryptSync(password, salt, SCRYPT_KEY_LENGTH, {
    N: SCRYPT_COST,
    r: SCRYPT_BLOCK_SIZE,
    p: SCRYPT_PARALLELIZATION
  });
  return [
    'scrypt',
    SCRYPT_COST,
    SCRYPT_BLOCK_SIZE,
    SCRYPT_PARALLELIZATION,
    salt.toString('base64url'),
    derivedKey.toString('base64url')
  ].join('$');
}

export function verifyPassword(password, encodedHash) {
  try {
    const [algorithm, cost, blockSize, parallelization, salt, expected] = encodedHash.split('$');
    if (algorithm !== 'scrypt' || !salt || !expected) return false;
    const expectedBuffer = Buffer.from(expected, 'base64url');
    const actualBuffer = scryptSync(password, Buffer.from(salt, 'base64url'), expectedBuffer.length, {
      N: Number(cost),
      r: Number(blockSize),
      p: Number(parallelization)
    });
    return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export function createSessionToken(user, options = {}) {
  const now = options.now ?? Date.now();
  const payload = Buffer.from(JSON.stringify({
    userId: Number(user.userId),
    username: String(user.username),
    exp: now + SESSION_TTL_MS
  })).toString('base64url');
  return `${payload}.${sign(payload, sessionSecret(options.secret))}`;
}

export function verifySessionToken(token, options = {}) {
  try {
    const [payload, signature, extra] = String(token || '').split('.');
    if (!payload || !signature || extra) return null;
    const expectedSignature = sign(payload, sessionSecret(options.secret));
    const supplied = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
    const value = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    const now = options.now ?? Date.now();
    if (!Number.isInteger(value.userId) || typeof value.username !== 'string' || value.exp <= now) return null;
    return value;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000
  };
}

export function getAdminFromRequest(request) {
  const cookieValue = request?.cookies?.get?.(SESSION_COOKIE_NAME)?.value;
  if (cookieValue) return verifySessionToken(cookieValue);
  const cookieHeader = request?.headers?.get?.('cookie') || '';
  const value = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`));
  return verifySessionToken(value?.slice(SESSION_COOKIE_NAME.length + 1));
}

export function unauthorizedResponse() {
  return Response.json({
    error: { code: 'UNAUTHORIZED', message: 'Administrator authentication is required.' }
  }, { status: 401 });
}
