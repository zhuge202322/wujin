# LP Flange Admin Backoffice Design

## Goal

Add a self-hosted admin backoffice to the existing Next.js website. The backoffice uses one administrator account and SQLite, and allows the administrator to manage:

- product categories;
- products and their category assignments;
- customer-service contact details;
- company logo and website name;
- images used by every homepage and inner-page section, including alt text;
- social-media links;
- the administrator password.

Page titles, paragraphs, button labels, and page layout remain in the existing source code. This scope deliberately limits the content model to operational/catalog data and image assets.

## Architecture

Use the existing Next.js App Router as a single application:

- `app/admin/*` contains the login, dashboard, and CRUD screens.
- `app/api/admin/*` contains authenticated Route Handlers for CRUD and upload operations.
- `lib/db.js` opens a SQLite database at `data/lpflange.sqlite`, creates tables on first use, and seeds the current product and site settings where practical.
- `lib/auth.js` implements password hashing and signed HttpOnly session cookies.
- Uploaded files are stored at `public/uploads/<random-name>.<ext>`. SQLite stores metadata and the public URL, not binary data.
- Public pages continue to render from current code data until a later task explicitly wires editable records into each page. The admin image catalog is the source of truth for future image replacement integration.

The database path and initial administrator credentials are configurable with environment variables so deployment does not require code changes:

- `LPFLANGE_DB_PATH` defaults to `data/lpflange.sqlite`.
- `LPFLANGE_ADMIN_USERNAME` defaults to `admin` only for first-run initialization.
- `LPFLANGE_ADMIN_PASSWORD` is required for first-run initialization and must not have a committed fallback.
- `LPFLANGE_SESSION_SECRET` is required in production and signs session cookies.

## Data Model

### `admin_users`

- `id` integer primary key
- `username` unique text
- `password_hash` text
- `created_at`, `updated_at` text timestamps

Only one row is supported. Password changes replace the hash for that row.

### `product_categories`

- `id` integer primary key
- `name` text not null
- `slug` unique text not null
- `description` text nullable
- `sort_order` integer default 0
- `created_at`, `updated_at` text timestamps

Categories cannot be deleted while products reference them; the API returns a clear conflict response.

### `products`

- `id` integer primary key
- `category_id` foreign key nullable
- `name` text not null
- `slug` unique text not null
- `description` text nullable
- `image_url` text nullable
- `image_alt` text nullable
- `sort_order` integer default 0
- `is_active` integer default 1
- `created_at`, `updated_at` text timestamps

### `site_settings`

Key/value records for `site_name`, `logo_url`, `sales_email`, `sales_phone`, `whatsapp_url`, and other customer-service contact values. Keys are unique and validated by the API.

### `social_links`

- `id` integer primary key
- `platform` text not null
- `label` text not null
- `url` text not null
- `sort_order` integer default 0
- `is_active` integer default 1
- `created_at`, `updated_at` text timestamps

### `page_images`

- `id` integer primary key
- `page_key` text not null, such as `home`, `products`, `about`, `standards`, `custom-machining`
- `section_key` text not null, such as `hero-slide-1` or `applications-process-piping`
- `image_url` text not null
- `alt_text` text not null
- `sort_order` integer default 0
- `created_at`, `updated_at` text timestamps
- unique constraint on `(page_key, section_key)`

Replacing an image updates the metadata row and removes the previous local file only after the database write succeeds. Deleting a record removes its local file after the record is deleted.

## Authentication And Security

- Login accepts username and password over the same-origin `/admin/login` form.
- Passwords use Node's built-in `crypto.scrypt` with a per-user random salt.
- Successful login creates a signed, expiring HttpOnly cookie with `Secure` enabled when deployed over HTTPS and `SameSite=Lax`.
- Every admin page and admin API route checks the session before returning data or mutating state.
- API mutations validate JSON shape, URLs, slugs, numeric ordering, and upload MIME type/size.
- Uploads accept JPEG, PNG, WebP, and SVG only after extension/MIME validation; the implementation should cap files at 10 MB and generate random filenames.
- Error responses avoid returning password hashes or filesystem paths.
- The first-run password must be supplied via environment variable. The UI requires changing it after initial login.

## Admin UI

The admin UI uses a compact, work-focused layout consistent with the existing industrial site:

- fixed sidebar or top navigation for Dashboard, Products, Images, Settings;
- tables for categories, products, social links, and page images;
- modal or inline forms for create/edit operations;
- explicit delete confirmation;
- upload preview and alt-text field for images;
- success/error feedback after every mutation;
- responsive layout usable on a VPS laptop viewport and mobile viewport.

The dashboard displays counts for products, categories, managed images, and active social links, plus a warning when the administrator is still using the first-run password.

## API Surface

All routes require the admin session except login/logout:

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET/POST /api/admin/categories`
- `PATCH/DELETE /api/admin/categories/:id`
- `GET/POST /api/admin/products`
- `PATCH/DELETE /api/admin/products/:id`
- `GET/POST /api/admin/images`
- `PATCH/DELETE /api/admin/images/:id`
- `POST /api/admin/uploads`
- `GET/PATCH /api/admin/settings`
- `GET/POST /api/admin/social-links`
- `PATCH/DELETE /api/admin/social-links/:id`
- `POST /api/admin/password`

Responses use JSON with stable `{ data }` or `{ error: { code, message } }` shapes and appropriate HTTP statuses.

## Initialization And Deployment

- Add a database initialization command, `npm run db:init`, that creates the schema and first administrator.
- The app lazily verifies the schema at runtime so a fresh VPS can start safely after initialization.
- Add `.env.example` documenting all required variables.
- Add `data/.gitkeep` and ignore the SQLite database, WAL/SHM files, and upload contents in Git.
- Document a VPS flow: install Node.js, install dependencies, set environment variables, run `npm run db:init`, run `npm run build`, start with `npm run start`, and place Nginx/HTTPS in front.
- Recommend persistent backups of `data/lpflange.sqlite` and `public/uploads`.

## Testing And Acceptance

Source-level tests cover schema creation, password hashing/verification, session signing/expiry, validation, and CRUD behavior against a temporary SQLite database. Route tests cover unauthenticated rejection and authenticated create/update/delete operations.

Browser verification covers:

1. login with the configured administrator;
2. create, edit, and delete a category;
3. create and edit a product under a category;
4. upload, replace, and delete a page image;
5. edit site settings, social links, and password;
6. logout and verify protected routes reject access;
7. desktop and mobile admin layouts without horizontal overflow.

The existing public homepage tests and production build must continue to pass.
