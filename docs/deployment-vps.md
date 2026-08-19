# VPS Deployment

The admin backoffice runs in the same Next.js process as the public website. Use a persistent filesystem for the SQLite database and uploaded images.

## First deployment

1. Install Node.js 20 or newer on the VPS and clone the repository.
2. Run `npm ci` in the project directory.
3. Copy `.env.example` to `.env` and set:

   - `LPFLANGE_DB_PATH=data/lpflange.sqlite` (or an absolute persistent path)
   - `LPFLANGE_ADMIN_USERNAME` (the single administrator username)
   - `LPFLANGE_ADMIN_PASSWORD` (at least 12 characters; never commit it)
   - `LPFLANGE_SESSION_SECRET` (a long random value; never reuse a public example)

4. Ensure the Node process can write to `data/` and `public/uploads/`.
5. Run `npm run db:init`. The command creates the schema, default site settings, initial product categories, and the managed image registry. It never replaces an existing administrator password.
6. Run `npm run build`, then start the service with `npm run start` (or a process manager such as systemd or PM2).

## Nginx and HTTPS

Put Nginx or another reverse proxy in front of the Node process. Forward the public hostname to the local Next.js port, enable HTTPS, and preserve `Host`, `X-Forwarded-For`, and `X-Forwarded-Proto` headers. The session cookie is marked `Secure` when `NODE_ENV=production`, so production admin access must use HTTPS.

## Backups and updates

- Back up `data/lpflange.sqlite` together with `data/lpflange.sqlite-wal` and `data/lpflange.sqlite-shm` when present.
- Back up `public/uploads/`; database image URLs refer to these files.
- Before an update, stop the service or take a consistent SQLite backup, run `npm ci`, run `npm run build`, then restart.
- Do not put `.env`, the SQLite database, or upload files in Git.

## Admin URL

Open `/admin/login` on the configured HTTPS hostname. The public pages continue using their source-code content and image fallbacks. `page_images` is the editable source of truth for future page-by-page asset resolution; each record is identified by `page_key` and `section_key` and includes required alt text.
