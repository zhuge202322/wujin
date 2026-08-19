import { getDatabase, initDatabase, resolveDatabasePath } from '../lib/db.js';

try {
  const database = getDatabase();
  initDatabase(database, { seedAdmin: true });
  const administrator = database.prepare('SELECT username FROM admin_users LIMIT 1').get();
  process.stdout.write(`Database initialized: ${resolveDatabasePath()}\n`);
  process.stdout.write(`Administrator: ${administrator.username}\n`);
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
