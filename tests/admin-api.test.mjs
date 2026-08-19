import test from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { closeDatabaseForTests, getDatabase, initDatabase } from '../lib/db.js';
import { SESSION_COOKIE_NAME } from '../lib/auth.js';
import { POST as login } from '../app/api/admin/login/route.js';
import { GET as listCategories, POST as createCategory } from '../app/api/admin/categories/route.js';
import { PATCH as patchCategory, DELETE as deleteCategory } from '../app/api/admin/categories/[id]/route.js';
import { GET as listProducts, POST as createProduct } from '../app/api/admin/products/route.js';
import { PATCH as patchProduct, DELETE as deleteProduct } from '../app/api/admin/products/[id]/route.js';
import { GET as listSocialLinks, POST as createSocialLink } from '../app/api/admin/social-links/route.js';
import { PATCH as patchSocialLink, DELETE as deleteSocialLink } from '../app/api/admin/social-links/[id]/route.js';
import { POST as uploadImage } from '../app/api/admin/uploads/route.js';
import { GET as listImages, POST as createImage } from '../app/api/admin/images/route.js';
import { PATCH as patchImage, DELETE as deleteImage } from '../app/api/admin/images/[id]/route.js';
import { GET as getSettings, PATCH as patchSettings } from '../app/api/admin/settings/route.js';
import { POST as changePassword } from '../app/api/admin/password/route.js';
import { POST as logout } from '../app/api/admin/logout/route.js';
import { uploadRoot } from '../lib/uploads.js';

async function createFixture() {
  closeDatabaseForTests();
  const directory = await mkdtemp(path.join(tmpdir(), 'lpflange-api-'));
  process.env.LPFLANGE_DB_PATH = path.join(directory, 'api.sqlite');
  process.env.LPFLANGE_ADMIN_USERNAME = 'admin';
  process.env.LPFLANGE_ADMIN_PASSWORD = 'test-admin-password';
  process.env.LPFLANGE_SESSION_SECRET = 'test-api-session-secret-long-enough';
  initDatabase(getDatabase(), { seedAdmin: true });

  return async () => {
    closeDatabaseForTests();
    await rm(directory, { recursive: true, force: true });
  };
}

function jsonRequest(url, method, body, cookie) {
  const headers = { 'content-type': 'application/json' };
  if (cookie) headers.cookie = cookie;
  return new Request(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
}

async function loginCookie() {
  const response = await login(jsonRequest('http://localhost/api/admin/login', 'POST', {
    username: 'admin',
    password: 'test-admin-password'
  }));
  assert.equal(response.status, 200);
  const setCookie = response.headers.get('set-cookie');
  assert.match(setCookie, new RegExp(`^${SESSION_COOKIE_NAME}=`));
  return setCookie.split(';')[0];
}

test('protected routes reject unauthenticated requests with the stable error shape', async () => {
  const cleanup = await createFixture();
  try {
    const response = await listCategories(new Request('http://localhost/api/admin/categories'));
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), {
      error: { code: 'UNAUTHORIZED', message: 'Administrator authentication is required.' }
    });
  } finally {
    await cleanup();
  }
});

test('login rejects invalid credentials and creates a signed cookie for valid credentials', async () => {
  const cleanup = await createFixture();
  try {
    const invalid = await login(jsonRequest('http://localhost/api/admin/login', 'POST', {
      username: 'admin', password: 'wrong-password-value'
    }));
    assert.equal(invalid.status, 401);
    assert.equal((await invalid.json()).error.code, 'INVALID_CREDENTIALS');
    await loginCookie();
  } finally {
    await cleanup();
  }
});

test('authenticated category and product CRUD enforces unique slugs and category references', async () => {
  const cleanup = await createFixture();
  try {
    const cookie = await loginCookie();
    const categoryResponse = await createCategory(jsonRequest('http://localhost/api/admin/categories', 'POST', {
      name: 'Weld Neck Flanges', slug: 'weld-neck-flanges', description: 'Forged neck flanges', sortOrder: 10
    }, cookie));
    assert.equal(categoryResponse.status, 201);
    const category = (await categoryResponse.json()).data;

    const duplicate = await createCategory(jsonRequest('http://localhost/api/admin/categories', 'POST', {
      name: 'Duplicate', slug: 'weld-neck-flanges', sortOrder: 20
    }, cookie));
    assert.equal(duplicate.status, 409);

    const productResponse = await createProduct(jsonRequest('http://localhost/api/admin/products', 'POST', {
      categoryId: category.id,
      name: 'ASME B16.5 Weld Neck',
      slug: 'asme-b16-5-weld-neck',
      description: 'Industrial stainless steel flange',
      imageUrl: '/images/stitch-product-1.jpg',
      imageAlt: 'ASME stainless steel weld neck flange',
      sortOrder: 1,
      isActive: true
    }, cookie));
    assert.equal(productResponse.status, 201);
    const product = (await productResponse.json()).data;
    assert.equal(product.categoryId, category.id);

    const conflict = await deleteCategory(
      jsonRequest(`http://localhost/api/admin/categories/${category.id}`, 'DELETE', undefined, cookie),
      { params: Promise.resolve({ id: String(category.id) }) }
    );
    assert.equal(conflict.status, 409);

    const changedProduct = await patchProduct(
      jsonRequest(`http://localhost/api/admin/products/${product.id}`, 'PATCH', { name: 'Updated Weld Neck' }, cookie),
      { params: Promise.resolve({ id: String(product.id) }) }
    );
    assert.equal((await changedProduct.json()).data.name, 'Updated Weld Neck');

    assert.equal((await listProducts(new Request('http://localhost/api/admin/products', { headers: { cookie } }))).status, 200);
    assert.equal((await deleteProduct(
      jsonRequest(`http://localhost/api/admin/products/${product.id}`, 'DELETE', undefined, cookie),
      { params: Promise.resolve({ id: String(product.id) }) }
    )).status, 200);
    assert.equal((await patchCategory(
      jsonRequest(`http://localhost/api/admin/categories/${category.id}`, 'PATCH', { description: 'Updated category' }, cookie),
      { params: Promise.resolve({ id: String(category.id) }) }
    )).status, 200);
    assert.equal((await deleteCategory(
      jsonRequest(`http://localhost/api/admin/categories/${category.id}`, 'DELETE', undefined, cookie),
      { params: Promise.resolve({ id: String(category.id) }) }
    )).status, 200);
  } finally {
    await cleanup();
  }
});

test('authenticated social link CRUD validates URLs and returns public fields', async () => {
  const cleanup = await createFixture();
  try {
    const cookie = await loginCookie();
    const invalid = await createSocialLink(jsonRequest('http://localhost/api/admin/social-links', 'POST', {
      platform: 'LinkedIn', label: 'LinkedIn', url: 'javascript:alert(1)', sortOrder: 1, isActive: true
    }, cookie));
    assert.equal(invalid.status, 422);

    const createdResponse = await createSocialLink(jsonRequest('http://localhost/api/admin/social-links', 'POST', {
      platform: 'LinkedIn', label: 'LP Flange LinkedIn', url: 'https://linkedin.com/company/lpflange', sortOrder: 1, isActive: true
    }, cookie));
    assert.equal(createdResponse.status, 201);
    const created = (await createdResponse.json()).data;

    const patched = await patchSocialLink(
      jsonRequest(`http://localhost/api/admin/social-links/${created.id}`, 'PATCH', { label: 'Longping Metal LinkedIn' }, cookie),
      { params: Promise.resolve({ id: String(created.id) }) }
    );
    assert.equal((await patched.json()).data.label, 'Longping Metal LinkedIn');
    const list = await listSocialLinks(new Request('http://localhost/api/admin/social-links', { headers: { cookie } }));
    assert.equal((await list.json()).data.length, 1);
    assert.equal((await deleteSocialLink(
      jsonRequest(`http://localhost/api/admin/social-links/${created.id}`, 'DELETE', undefined, cookie),
      { params: Promise.resolve({ id: String(created.id) }) }
    )).status, 200);
  } finally {
    await cleanup();
  }
});

async function assertMissing(filename) {
  await assert.rejects(() => access(filename), { code: 'ENOENT' });
}

test('image upload, replacement, and deletion remove managed files only after database success', async () => {
  const cleanup = await createFixture();
  const savedFiles = [];
  try {
    const cookie = await loginCookie();
    async function upload(name, contents) {
      const form = new FormData();
      form.set('file', new File([contents], name, { type: 'image/png' }));
      const response = await uploadImage(new Request('http://localhost/api/admin/uploads', {
        method: 'POST', headers: { cookie }, body: form
      }));
      assert.equal(response.status, 201);
      const data = (await response.json()).data;
      savedFiles.push(path.join(uploadRoot(), path.basename(data.imageUrl)));
      return data.imageUrl;
    }

    const firstUrl = await upload('first.png', 'first');
    const createdResponse = await createImage(jsonRequest('http://localhost/api/admin/images', 'POST', {
      pageKey: 'home', sectionKey: 'hero-slide-1', imageUrl: firstUrl,
      altText: 'First hero image', sortOrder: 1
    }, cookie));
    assert.equal(createdResponse.status, 201);
    const image = (await createdResponse.json()).data;
    await access(savedFiles[0]);

    const secondUrl = await upload('second.png', 'second');
    const patched = await patchImage(
      jsonRequest(`http://localhost/api/admin/images/${image.id}`, 'PATCH', {
        imageUrl: secondUrl, altText: 'Replacement hero image'
      }, cookie),
      { params: Promise.resolve({ id: String(image.id) }) }
    );
    assert.equal(patched.status, 200);
    await assertMissing(savedFiles[0]);
    await access(savedFiles[1]);

    const listed = await listImages(new Request('http://localhost/api/admin/images', { headers: { cookie } }));
    assert.equal((await listed.json()).data[0].altText, 'Replacement hero image');
    assert.equal((await deleteImage(
      jsonRequest(`http://localhost/api/admin/images/${image.id}`, 'DELETE', undefined, cookie),
      { params: Promise.resolve({ id: String(image.id) }) }
    )).status, 200);
    await assertMissing(savedFiles[1]);
  } finally {
    for (const filename of savedFiles) await rm(filename, { force: true });
    await cleanup();
  }
});

test('settings API updates only supported site and customer-service values', async () => {
  const cleanup = await createFixture();
  try {
    const cookie = await loginCookie();
    const response = await patchSettings(jsonRequest('http://localhost/api/admin/settings', 'PATCH', {
      site_name: 'LP Flange Industrial',
      logo_url: '/images/lpflange-wordmark.png',
      sales_email: 'sales@example.com',
      sales_phone: '+86 178 2647 2173',
      whatsapp_url: 'https://wa.me/8617826472173',
      address: 'Jiangsu, China'
    }, cookie));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).data.site_name, 'LP Flange Industrial');

    const invalid = await patchSettings(jsonRequest('http://localhost/api/admin/settings', 'PATCH', {
      page_title: 'Not editable'
    }, cookie));
    assert.equal(invalid.status, 422);
    const settings = await getSettings(new Request('http://localhost/api/admin/settings', { headers: { cookie } }));
    assert.equal((await settings.json()).data.sales_email, 'sales@example.com');
  } finally {
    await cleanup();
  }
});

test('password change verifies the current password and logout expires the session cookie', async () => {
  const cleanup = await createFixture();
  try {
    const cookie = await loginCookie();
    const wrong = await changePassword(jsonRequest('http://localhost/api/admin/password', 'POST', {
      currentPassword: 'wrong-current-password', newPassword: 'new-password-value-2026'
    }, cookie));
    assert.equal(wrong.status, 400);

    const changed = await changePassword(jsonRequest('http://localhost/api/admin/password', 'POST', {
      currentPassword: 'test-admin-password', newPassword: 'new-password-value-2026'
    }, cookie));
    assert.equal(changed.status, 200);
    assert.deepEqual(await changed.json(), { data: { changed: true } });

    const oldLogin = await login(jsonRequest('http://localhost/api/admin/login', 'POST', {
      username: 'admin', password: 'test-admin-password'
    }));
    assert.equal(oldLogin.status, 401);
    const newLogin = await login(jsonRequest('http://localhost/api/admin/login', 'POST', {
      username: 'admin', password: 'new-password-value-2026'
    }));
    assert.equal(newLogin.status, 200);

    const loggedOut = await logout(new Request('http://localhost/api/admin/logout', {
      method: 'POST', headers: { cookie }
    }));
    assert.equal(loggedOut.status, 200);
    assert.match(loggedOut.headers.get('set-cookie'), /Max-Age=0/);
  } finally {
    await cleanup();
  }
});
