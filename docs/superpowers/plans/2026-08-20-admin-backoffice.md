# Admin Backoffice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a self-hosted SQLite-backed admin area with one administrator account for managing product catalog data, site/contact settings, social links, and page-section images.

**Architecture:** Keep the existing Next.js App Router application and add server-only database/auth modules, `/api/admin/*` Route Handlers, and `/admin/*` client screens. SQLite stores structured records and upload metadata; uploaded files live under `public/uploads`. Existing public-page copy and layout stay source-controlled, while the admin image catalog provides the managed asset records for future public-page wiring.

**Tech Stack:** Next.js 15 App Router, React 19, Node `crypto.scrypt`, `better-sqlite3`, signed HttpOnly cookies, browser `FormData`, and Node's built-in test runner.

---

## File Map

Create the following focused modules and screens:

- `lib/db.js` — resolve the database path, open SQLite, create schema, seed the single admin and existing catalog/settings, and expose transaction/query helpers.
- `lib/auth.js` — hash/verify passwords, create/verify expiring signed sessions, read the request cookie, and enforce admin access.
- `lib/validation.js` — shared validation for slugs, URLs, settings keys, ordering values, and upload metadata.
- `lib/uploads.js` — validate image MIME/extension/size, generate random filenames, save files under `public/uploads`, and remove managed files safely.
- `scripts/db-init.mjs` — explicit `npm run db:init` entry point that initializes schema and first admin credentials.
- `app/api/admin/login/route.js` and `app/api/admin/logout/route.js` — unauthenticated login/logout handlers.
- `app/api/admin/categories/route.js`, `app/api/admin/categories/[id]/route.js` — category CRUD.
- `app/api/admin/products/route.js`, `app/api/admin/products/[id]/route.js` — product CRUD.
- `app/api/admin/images/route.js`, `app/api/admin/images/[id]/route.js`, `app/api/admin/uploads/route.js` — page image metadata CRUD and binary upload.
- `app/api/admin/settings/route.js` — site name, logo, and customer-service settings read/update.
- `app/api/admin/social-links/route.js`, `app/api/admin/social-links/[id]/route.js` — social link CRUD.
- `app/api/admin/password/route.js` — current-password verification and password replacement.
- `app/admin/layout.js`, `app/admin/page.js`, `app/admin/login/page.js` — protected shell, dashboard, and login screen.
- `app/admin/products/page.js`, `app/admin/images/page.js`, `app/admin/settings/page.js` — catalog, image library, and settings screens.
- `app/admin/admin.css` — responsive admin-only styles.
- `tests/admin-db.test.mjs`, `tests/admin-auth.test.mjs`, `tests/admin-validation.test.mjs`, `tests/admin-api.test.mjs` — schema, auth, validation, and Route Handler coverage.
- `.env.example`, `data/.gitkeep`, `docs/deployment-vps.md` — configuration, persistence, and deployment instructions.

Modify these existing files:

- `package.json` — add `better-sqlite3` and the `db:init` script.
- `.gitignore` — ignore the SQLite database/WAL files and upload contents while retaining `data/.gitkeep`.
- `app/layout.js` — keep the public metadata and load admin styles only through the admin layout.
- `app/content/homepage.js` — export stable seed values/keys for categories, products, site settings, social links, and page images without changing public copy.
- `app/globals.css` — add only shared form/table primitives if the admin layout cannot keep them scoped.

## Task 1: Add Database Dependency And Schema Contract

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`
- Create: `data/.gitkeep`
- Create: `lib/db.js`
- Create: `tests/admin-db.test.mjs`

- [ ] **Step 1: Write failing schema tests**

Add tests that create a temporary database path and assert that `initDatabase()` creates exactly these tables and constraints: `admin_users`, `product_categories`, `products`, `site_settings`, `social_links`, and `page_images`; `(page_key, section_key)` is unique; product category deletion is rejected when referenced; and initialization is idempotent.

```js
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
assert.deepEqual(tables.map((row) => row.name), [
  'admin_users', 'page_images', 'product_categories', 'products', 'site_settings', 'social_links'
]);
assert.throws(() => db.prepare('DELETE FROM product_categories WHERE id = ?').run(categoryId), /FOREIGN KEY/i);
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run `node --test tests/admin-db.test.mjs`.

Expected: FAIL because `lib/db.js` and the schema do not exist yet.

- [ ] **Step 3: Add the SQLite dependency and ignore rules**

Run `npm install better-sqlite3` and add:

```json
"db:init": "node scripts/db-init.mjs"
```

to `package.json`. Add `data/lpflange.sqlite`, `data/lpflange.sqlite-wal`, `data/lpflange.sqlite-shm`, and `public/uploads/*` to `.gitignore`, followed by `!public/uploads/.gitkeep` and keep `data/.gitkeep` tracked.

- [ ] **Step 4: Implement `lib/db.js`**

Export `getDatabase()`, `initDatabase(database = getDatabase())`, `closeDatabaseForTests()`, and `nowIso()`. Resolve `LPFLANGE_DB_PATH` relative to the repository when it is not absolute, enable foreign keys, and execute this schema:

```sql
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS product_categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  category_id INTEGER REFERENCES product_categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  image_alt TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS social_links (
  id INTEGER PRIMARY KEY,
  platform TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS page_images (
  id INTEGER PRIMARY KEY,
  page_key TEXT NOT NULL,
  section_key TEXT NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(page_key, section_key)
);
```

Set `PRAGMA foreign_keys = ON` for every connection and use transactions for seed writes. Seed current categories/products/settings/social links/page image keys only when rows are absent; never overwrite administrator edits on later starts.

- [ ] **Step 5: Run the schema tests**

Run `node --test tests/admin-db.test.mjs`.

Expected: PASS, including the idempotency and foreign-key assertions.

- [ ] **Step 6: Commit the database foundation**

Run `git add package.json package-lock.json .gitignore data/.gitkeep lib/db.js tests/admin-db.test.mjs && git commit -m "feat: add sqlite admin schema"`.

## Task 2: Implement Password And Session Authentication

**Files:**
- Create: `lib/auth.js`
- Create: `tests/admin-auth.test.mjs`
- Create: `.env.example`

- [ ] **Step 1: Write failing auth tests**

Cover random-salt scrypt hashing, successful and failed verification, signed session round trips, expiry rejection, tamper rejection, and missing production secret/password configuration.

```js
const hash = await hashPassword('correct horse');
assert.notEqual(hash, 'correct horse');
assert.equal(await verifyPassword('correct horse', hash), true);
assert.equal(await verifyPassword('wrong', hash), false);
const cookie = createSessionCookie({ userId: 1, username: 'admin' }, { secret: 'test-secret', now: 1000 });
assert.deepEqual(verifySessionCookie(cookie, { secret: 'test-secret', now: 1000 }), { userId: 1, username: 'admin' });
assert.equal(verifySessionCookie(cookie, { secret: 'test-secret', now: 1000 + SESSION_TTL_MS + 1 }), null);
```

- [ ] **Step 2: Run the auth tests and verify failure**

Run `node --test tests/admin-auth.test.mjs`.

Expected: FAIL because `lib/auth.js` does not exist.

- [ ] **Step 3: Implement `lib/auth.js`**

Export `hashPassword(password)`, `verifyPassword(password, encodedHash)`, `createSessionCookie(user, options)`, `verifySessionCookie(value, options)`, `getAdminFromRequest(request)`, and `requireAdmin(request)`. Encode hashes as `scrypt$N$r$p$salt$derivedKey` with a random 16-byte salt and constant-time comparison. Encode session payload `{ userId, username, exp }` as base64url plus HMAC-SHA256 signature using `LPFLANGE_SESSION_SECRET`; use a 12-hour TTL, HttpOnly, SameSite=Lax, Path=/, and `Secure` when `NODE_ENV === 'production'`. `requireAdmin()` must return a 401 JSON response for API callers and redirect page callers to `/admin/login` without exposing hashes or secrets.

- [ ] **Step 4: Document configuration**

Create `.env.example` with `LPFLANGE_DB_PATH=data/lpflange.sqlite`, `LPFLANGE_ADMIN_USERNAME=admin`, blank `LPFLANGE_ADMIN_PASSWORD`, and a long example `LPFLANGE_SESSION_SECRET`, plus comments stating that the password and session secret are required for production and must be changed before deployment.

- [ ] **Step 5: Run auth tests and commit**

Run `node --test tests/admin-auth.test.mjs`; expected: PASS. Then run `git add lib/auth.js tests/admin-auth.test.mjs .env.example && git commit -m "feat: add admin password sessions"`.

## Task 3: Add Validation And Upload Lifecycle Helpers

**Files:**
- Create: `lib/validation.js`
- Create: `lib/uploads.js`
- Create: `tests/admin-validation.test.mjs`

- [ ] **Step 1: Write failing validation/upload tests**

Test slug normalization and rejection, required strings, integer ordering, allowed setting keys, `http`/`https` URL validation, accepted JPEG/PNG/WebP/SVG MIME-extension pairs, 10 MB rejection, random filename generation, and deletion limited to `public/uploads`.

- [ ] **Step 2: Run tests and verify failure**

Run `node --test tests/admin-validation.test.mjs`; expected: FAIL because both helper modules are missing.

- [ ] **Step 3: Implement validation helpers**

Export `parseJson(request)`, `requireString(value, field, { max })`, `normalizeSlug(value)`, `requireInteger(value, field, { min, max })`, `requireHttpUrl(value, field)`, `requireSettingKey(key)`, `validateCategoryInput`, `validateProductInput`, `validateSocialLinkInput`, and `validateImageMetadata`. Reject unknown fields in mutation payloads, cap names/labels at 160 characters and descriptions/alt text at 500 characters, and return stable `{ code, message }` errors for route handlers.

- [ ] **Step 4: Implement upload helpers**

Export `saveUpload(file)`, `removeUpload(publicUrl)`, `validateUpload(file)`, and `uploadRoot()`. Read the `File` into a buffer only after checking size, verify extension and MIME against the four allowed pairs, use `crypto.randomBytes(16)` for the filename, create `public/uploads` recursively, and return `{ imageUrl, absolutePath, mimeType, size }`. `removeUpload()` must ignore non-local URLs and refuse paths that resolve outside the upload root.

- [ ] **Step 5: Run tests and commit**

Run `node --test tests/admin-validation.test.mjs`; expected: PASS. Commit with `git add lib/validation.js lib/uploads.js tests/admin-validation.test.mjs && git commit -m "feat: validate admin data and uploads"`.

## Task 4: Initialize Database From The CLI

**Files:**
- Create: `scripts/db-init.mjs`
- Modify: `lib/db.js`

- [ ] **Step 1: Write the initialization behavior test**

Extend `tests/admin-db.test.mjs` with a temporary environment test that runs the initializer with `LPFLANGE_ADMIN_PASSWORD=initial-secret`, verifies one `admin_users` row, and verifies a missing password exits non-zero without creating a default password.

- [ ] **Step 2: Implement seed behavior and CLI**

Use `LPFLANGE_ADMIN_USERNAME` or `admin` for the first username, require a non-empty `LPFLANGE_ADMIN_PASSWORD` only when the admin row is absent, hash it through `lib/auth.js`, and print the database path plus username (never the password). `scripts/db-init.mjs` should call `initDatabase()` and exit with code 1 and a clear message when first-run credentials are missing.

- [ ] **Step 3: Verify and commit**

Run `node --test tests/admin-db.test.mjs`, then `npm run db:init` with a temporary database and environment values; expected: successful initialization and one admin row. Commit `scripts/db-init.mjs` and any `lib/db.js` changes.

## Task 5: Implement Login, Logout, And Protected CRUD API Routes

**Files:**
- Create: `app/api/admin/login/route.js`
- Create: `app/api/admin/logout/route.js`
- Create: `app/api/admin/categories/route.js`
- Create: `app/api/admin/categories/[id]/route.js`
- Create: `app/api/admin/products/route.js`
- Create: `app/api/admin/products/[id]/route.js`
- Create: `app/api/admin/social-links/route.js`
- Create: `app/api/admin/social-links/[id]/route.js`
- Create: `tests/admin-api.test.mjs`

- [ ] **Step 1: Write route tests for unauthenticated rejection and CRUD**

Use temporary SQLite state and `NextRequest` objects to assert: unauthenticated protected routes return 401; login sets a cookie; authenticated category/product/social-link create, list, patch, and delete return `{ data }`; duplicate slugs return 409; and deleting a referenced category returns 409.

- [ ] **Step 2: Run route tests and verify failure**

Run `node --test tests/admin-api.test.mjs`; expected: FAIL because handlers are absent.

- [ ] **Step 3: Implement login/logout**

`POST /api/admin/login` accepts exactly `{ username, password }`, compares the single stored user, sets the signed session cookie, and returns `{ data: { user: { id, username } } }`; invalid credentials return 401 `{ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password.' } }`. `POST /api/admin/logout` clears the cookie and returns `{ data: { loggedOut: true } }`.

- [ ] **Step 4: Implement category handlers**

`GET/POST /api/admin/categories` and `PATCH/DELETE /api/admin/categories/:id` must call `requireAdmin()`, validate input, use parameterized statements, map SQLite uniqueness/foreign-key errors to 409, and return rows without internal filesystem or password fields.

- [ ] **Step 5: Implement product handlers**

Support nullable `categoryId`, `name`, `slug`, `description`, `imageUrl`, `imageAlt`, `sortOrder`, and `isActive`; reject unknown category IDs with 422 and preserve existing image values when omitted in a patch.

- [ ] **Step 6: Implement social-link handlers**

Support `platform`, `label`, `url`, `sortOrder`, and `isActive`; validate absolute HTTP(S) URLs and return stable 404/422/409 errors.

- [ ] **Step 7: Run tests and commit**

Run `node --test tests/admin-api.test.mjs`; expected: PASS. Commit all route and test files with `git add app/api/admin lib tests/admin-api.test.mjs && git commit -m "feat: add catalog and social admin api"`.

## Task 6: Implement Images, Uploads, Settings, And Password APIs

**Files:**
- Create: `app/api/admin/images/route.js`
- Create: `app/api/admin/images/[id]/route.js`
- Create: `app/api/admin/uploads/route.js`
- Create: `app/api/admin/settings/route.js`
- Create: `app/api/admin/password/route.js`
- Modify: `tests/admin-api.test.mjs`

- [ ] **Step 1: Add failing API tests**

Cover multipart upload rejection for unauthenticated users and invalid files, successful upload returning a local public URL, image metadata create/patch/delete, replacement removing the old file only after a successful database update, settings whitelist updates, and password change requiring the current password.

- [ ] **Step 2: Implement upload endpoint**

`POST /api/admin/uploads` accepts one `file` field, invokes `saveUpload()`, and returns `{ data: { imageUrl, mimeType, size } }`. It must never accept a client-provided filesystem path.

- [ ] **Step 3: Implement page-image CRUD**

`GET/POST /api/admin/images` and `PATCH/DELETE /api/admin/images/:id` validate `pageKey`, `sectionKey`, `imageUrl`, `altText`, and `sortOrder`; enforce the unique page/section pair; on replacement or deletion remove old local files only after the transaction succeeds.

- [ ] **Step 4: Implement settings endpoint**

`GET/PATCH /api/admin/settings` reads/writes only `site_name`, `logo_url`, `sales_email`, `sales_phone`, `whatsapp_url`, and `address`. Validate email-like values and HTTP(S) URLs where applicable; return a key/value object under `data`.

- [ ] **Step 5: Implement password endpoint**

`POST /api/admin/password` accepts `{ currentPassword, newPassword }`, requires the current hash, enforces 12-128 characters, hashes the new value, updates `updated_at`, and returns `{ data: { changed: true } }`. Do not invalidate the current session until the response succeeds.

- [ ] **Step 6: Run tests and commit**

Run `node --test tests/admin-api.test.mjs`; expected: PASS, including file cleanup assertions. Commit with `git add app/api/admin tests/admin-api.test.mjs && git commit -m "feat: add image settings and password api"`.

## Task 7: Build The Admin Shell And Dashboard

**Files:**
- Create: `app/admin/layout.js`
- Create: `app/admin/admin.css`
- Create: `app/admin/page.js`
- Create: `app/admin/login/page.js`

- [ ] **Step 1: Implement protected admin layout**

Use a server component to call `getAdminFromRequest()` and redirect unauthenticated users to `/admin/login`; render a compact sidebar/top navigation with Dashboard, Products, Images, Settings, and a logout button that posts to the logout API. Keep `/admin/login` outside the protected shell.

- [ ] **Step 2: Implement login page**

Use a client form with username/password fields, pending state, inline error feedback, and redirect to `/admin` after a successful JSON login. Do not prefill or render the configured password.

- [ ] **Step 3: Implement dashboard page**

Fetch protected API data server-side and display counts for products, categories, managed images, and active social links. Show a first-run-password warning when the user has not changed the configured initial password; expose quick links to each management page.

- [ ] **Step 4: Add responsive admin styles**

Scope styles under `.admin-shell` and include a fixed desktop sidebar, stacked mobile navigation, dense tables, 8px-or-less corners, visible focus states, 44px touch targets, and no horizontal overflow at 390px and 1280px.

- [ ] **Step 5: Start the dev server and manually verify login**

Run `npm run dev`, open `http://localhost:3000/admin/login`, and verify invalid credentials show an error while valid credentials reach the dashboard.

## Task 8: Build Product And Category Management UI

**Files:**
- Create: `app/admin/products/page.js`
- Modify: `app/admin/admin.css`

- [ ] **Step 1: Add the product page data hooks and forms**

Create client-side category and product tables with loading/error/empty states, category create/edit/delete form, product create/edit form with category select, active toggle, sort order, slug, description, image URL, and alt text fields.

- [ ] **Step 2: Add explicit destructive-action confirmation**

Require a confirmation dialog before category/product deletion; surface the API conflict message when a category still has products.

- [ ] **Step 3: Verify CRUD in the browser**

Create, edit, and delete a category; create and edit a product assigned to it; confirm the table updates without a full-page reload and remains usable on desktop and mobile.

## Task 9: Build Image Library UI

**Files:**
- Create: `app/admin/images/page.js`
- Modify: `app/admin/admin.css`

- [ ] **Step 1: Implement image catalog table and filters**

List page key, section key, preview, alt text, sort order, and actions. Provide page/section filters and an empty state. Use stable `object-fit: contain` previews so wide and portrait source files do not shift row dimensions.

- [ ] **Step 2: Implement upload/create/replace form**

Use `FormData` for upload, show a local preview before submission, require alt text, allow page/section keys, and submit the returned `imageUrl` to image metadata CRUD. Replacement must retain the old record until the API confirms success.

- [ ] **Step 3: Implement delete and verify lifecycle**

Confirm deletion, refresh the list after success, and verify through the browser and API tests that the local file is removed only after the database row is deleted.

## Task 10: Build Settings, Social Links, And Password UI

**Files:**
- Create: `app/admin/settings/page.js`
- Modify: `app/admin/admin.css`

- [ ] **Step 1: Implement site/contact settings form**

Edit website name, logo URL, sales email, sales phone, WhatsApp URL, and address. Include an image upload control that uses the upload API and a preview for the logo.

- [ ] **Step 2: Implement social-link CRUD**

Render platform/label/URL/order/active fields, add/edit/delete controls, URL validation feedback, and a clear empty state.

- [ ] **Step 3: Implement password change form**

Require current password, new password, and confirmation; enforce the API's 12-character minimum; show success/error feedback and retain the session after a successful change.

- [ ] **Step 4: Verify all settings flows**

Edit settings and a social link, change the password, log out, and confirm the old password fails while the new password succeeds.

## Task 11: Add Deployment Documentation And Public Integration Boundary

**Files:**
- Create: `docs/deployment-vps.md`
- Modify: `app/content/homepage.js`
- Modify: `README.md` if present, otherwise create it

- [ ] **Step 1: Document VPS deployment**

Describe Node.js installation, `npm ci`, `.env` creation, strong `LPFLANGE_ADMIN_PASSWORD` and `LPFLANGE_SESSION_SECRET`, `npm run db:init`, `npm run build`, `npm run start`, Nginx/HTTPS reverse proxy, writable `data/` and `public/uploads/`, and backups of both locations.

- [ ] **Step 2: Define the public asset key registry**

Export a `managedImageKeys` list from `app/content/homepage.js` covering every current homepage and inner-page section (`home`, `products`, `about`, `standards`, `custom-machining`, `technical-resources`). Keep current public rendering unchanged, but document that future integration should resolve these keys from `page_images` with source-code fallback.

- [ ] **Step 3: Run the full existing suite and production build**

Run `npm test` and `npm run build`; expected: all existing homepage tests plus new admin tests pass and Next.js builds successfully.

- [ ] **Step 4: Commit documentation and registry**

Run `git add docs/deployment-vps.md app/content/homepage.js README.md && git commit -m "docs: add admin deployment and image registry"`.

## Task 12: Final Verification And Handoff

**Files:**
- Modify: any test files needed for discovered defects only

- [ ] **Step 1: Run all automated checks**

Run `npm test`, `npm run build`, and `npm run lint` if the installed Next.js version still provides the script. Record exact pass/fail output and fix only failures caused by this feature.

- [ ] **Step 2: Perform the acceptance workflow**

With a temporary configured database, verify login, category CRUD, product CRUD with category assignment, image upload/replace/delete, site/contact settings, social-link CRUD, password change, logout, protected-route rejection, and desktop/mobile admin layouts without horizontal overflow.

- [ ] **Step 3: Check repository hygiene**

Run `git status --short` and confirm the two pre-existing Word documents remain untracked and untouched, SQLite/upload runtime data is ignored, and all feature commits are present.

- [ ] **Step 4: Commit any final test fixes**

Use a focused commit such as `git commit -am "test: verify admin backoffice workflows"` only when a final fix was required; otherwise leave the existing commits unchanged and report the verification results.

## Self-Review Against The Approved Design

- Categories, products, customer-service settings, logo, website name, page-section images with alt text, social URLs, and the single administrator password each have an API and UI task.
- SQLite schema, first-run seeding, environment variables, lazy runtime initialization, upload restrictions, signed HttpOnly sessions, and VPS persistence/backups are covered.
- Public text/layout is intentionally unchanged; the managed image-key registry documents the approved integration boundary and source fallback.
- Tests cover schema, auth, validation, protected CRUD, file lifecycle, browser acceptance, existing homepage tests, and production build.
- The plan contains no unresolved work markers and uses consistent table, function, route, and field names throughout.
