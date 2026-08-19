import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function source(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), 'utf8');
}

test('admin routes separate public login from the protected application shell', async () => {
  const [login, protectedLayout, dashboard, shell] = await Promise.all([
    source('app/admin/login/page.js'),
    source('app/admin/(protected)/layout.js'),
    source('app/admin/(protected)/page.js'),
    source('app/admin/components/AdminShell.js')
  ]);
  assert.match(login, /AdminLoginForm/);
  assert.match(protectedLayout, /redirect\('\/admin\/login'\)/);
  assert.match(dashboard, /if \(!admin\) redirect\('\/admin\/login'\)/);
  assert.match(shell, /Dashboard/);
  assert.match(shell, /Products/);
  assert.match(shell, /Images/);
  assert.match(shell, /Settings/);
  assert.match(shell, /\/api\/admin\/logout/);
});

test('product manager exposes category and product create, edit, and confirmed delete workflows', async () => {
  const manager = await source('app/admin/components/CatalogManager.js');
  assert.match(manager, /\/api\/admin\/categories/);
  assert.match(manager, /\/api\/admin\/products/);
  assert.match(manager, /window\.confirm/);
  assert.match(manager, /categoryId/);
  assert.match(manager, /isActive/);
  assert.match(manager, /imageAlt/);
});

test('image manager uploads files and manages page/section metadata with alt text', async () => {
  const manager = await source('app/admin/components/ImageManager.js');
  assert.match(manager, /new FormData/);
  assert.match(manager, /\/api\/admin\/uploads/);
  assert.match(manager, /pageKey/);
  assert.match(manager, /sectionKey/);
  assert.match(manager, /altText/);
  assert.match(manager, /window\.confirm/);
});

test('settings manager covers identity, contact, social links, and password changes', async () => {
  const manager = await source('app/admin/components/SettingsManager.js');
  for (const field of ['site_name', 'logo_url', 'sales_email', 'sales_phone', 'whatsapp_url', 'address']) {
    assert.match(manager, new RegExp(field));
  }
  assert.match(manager, /\/api\/admin\/social-links/);
  assert.match(manager, /\/api\/admin\/password/);
  assert.match(manager, /currentPassword/);
  assert.match(manager, /passwordConfirmation/);
});

test('admin CSS has stable desktop and mobile layout constraints', async () => {
  const css = await source('app/admin/admin.css');
  assert.match(css, /grid-template-columns:\s*240px minmax\(0, 1fr\)/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /min-height:\s*44px/);
});
