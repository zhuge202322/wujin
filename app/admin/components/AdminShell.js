'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/products', label: 'Products', icon: 'inventory_2' },
  { href: '/admin/images', label: 'Images', icon: 'image' },
  { href: '/admin/settings', label: 'Settings', icon: 'settings' }
];

export function AdminShell({ children, username }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/admin"><img src="/images/lpflange-wordmark.png" alt="LP Flange" /></a>
        <nav aria-label="Admin navigation">
          {navigation.map((item) => {
            const active = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
            return <a className={active ? 'active' : ''} href={item.href} key={item.href}><span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>{item.label}</a>;
          })}
        </nav>
        <div className="admin-account">
          <span>Signed in as</span><strong>{username}</strong>
          <button type="button" onClick={logout} disabled={pending}><span className="material-symbols-outlined" aria-hidden="true">logout</span>{pending ? 'Signing out...' : 'Sign out'}</button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
