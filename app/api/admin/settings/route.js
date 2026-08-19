import { dataResponse, errorResponse, readJson, requireApiAdmin } from '../../../../lib/admin-api.js';
import { getDatabase, nowIso } from '../../../../lib/db.js';
import { EDITABLE_SETTING_KEYS, requireHttpUrl, requireImageUrl, requireSettingKey, requireString, ValidationError } from '../../../../lib/validation.js';

function validateEmail(value) {
  const email = requireString(value, 'sales_email', { max: 254 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ValidationError('sales_email must be a valid email address.');
  return email;
}

function validateSetting(key, value) {
  requireSettingKey(key);
  if (key === 'logo_url') return requireImageUrl(value, key);
  if (key === 'whatsapp_url') return requireHttpUrl(value, key);
  if (key === 'sales_email') return validateEmail(value);
  return requireString(value, key, { max: key === 'address' ? 500 : 160 });
}

function readSettings(database) {
  const values = Object.fromEntries([...EDITABLE_SETTING_KEYS].map((key) => [key, '']));
  for (const row of database.prepare('SELECT key, value FROM site_settings').all()) {
    if (EDITABLE_SETTING_KEYS.has(row.key)) values[row.key] = row.value;
  }
  return values;
}

export async function GET(request) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  return dataResponse(readSettings(getDatabase()));
}

export async function PATCH(request) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  try {
    const input = await readJson(request);
    if (!Object.keys(input).length) throw new ValidationError('At least one setting is required.');
    const entries = Object.entries(input).map(([key, value]) => [key, validateSetting(key, value)]);
    const database = getDatabase();
    const update = database.prepare(`
      INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `);
    const timestamp = nowIso();
    database.transaction(() => {
      for (const [key, value] of entries) update.run(key, value, timestamp);
    })();
    return dataResponse(readSettings(database));
  } catch (error) {
    return errorResponse(error);
  }
}
