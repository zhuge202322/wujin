import { cookies } from 'next/headers';

import { SESSION_COOKIE_NAME, verifySessionToken } from '../../../lib/auth.js';
import { getDatabase } from '../../../lib/db.js';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const database = getDatabase();
  const cookieStore = await cookies();
  const admin = verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  const user = database.prepare('SELECT created_at, updated_at FROM admin_users WHERE id = ?').get(admin.userId);
  const counts = {
    categories: database.prepare('SELECT COUNT(*) AS count FROM product_categories').get().count,
    products: database.prepare('SELECT COUNT(*) AS count FROM products').get().count,
    images: database.prepare('SELECT COUNT(*) AS count FROM page_images').get().count,
    social: database.prepare('SELECT COUNT(*) AS count FROM social_links WHERE is_active = 1').get().count
  };
  const initialPassword = user?.created_at === user?.updated_at;

  return (
    <div className="admin-page">
      <header className="admin-page-header"><div><h1>Dashboard</h1><p>Website operations overview</p></div><a className="admin-button secondary" href="/" target="_blank" rel="noreferrer">View website</a></header>
      {initialPassword ? <div className="admin-notice warning"><span className="material-symbols-outlined" aria-hidden="true">warning</span><div><strong>Change the initial password</strong><p>Set a private administrator password before deploying this website.</p></div><a href="/admin/settings#password">Open settings</a></div> : null}
      <section className="admin-metrics" aria-label="Content totals">
        <a href="/admin/products"><span>Product categories</span><strong>{counts.categories}</strong></a>
        <a href="/admin/products"><span>Products</span><strong>{counts.products}</strong></a>
        <a href="/admin/images"><span>Managed images</span><strong>{counts.images}</strong></a>
        <a href="/admin/settings"><span>Active social links</span><strong>{counts.social}</strong></a>
      </section>
      <section className="admin-section dashboard-actions"><div className="section-heading"><div><h2>Common tasks</h2><p>Update the content most frequently used by the public website.</p></div></div><div className="action-list"><a href="/admin/products"><span className="material-symbols-outlined">add_box</span><div><strong>Add a product</strong><span>Create catalog records and assign categories.</span></div></a><a href="/admin/images"><span className="material-symbols-outlined">add_photo_alternate</span><div><strong>Replace an image</strong><span>Upload a new section image and update its alt text.</span></div></a><a href="/admin/settings"><span className="material-symbols-outlined">contact_phone</span><div><strong>Update contact details</strong><span>Manage sales contacts and social links.</span></div></a></div></section>
    </div>
  );
}
