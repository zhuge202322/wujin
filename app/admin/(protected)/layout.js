import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { verifySessionToken, SESSION_COOKIE_NAME } from '../../../lib/auth.js';
import { AdminShell } from '../components/AdminShell.js';

export default async function ProtectedAdminLayout({ children }) {
  const cookieStore = await cookies();
  const admin = verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!admin) redirect('/admin/login');
  return <AdminShell username={admin.username}>{children}</AdminShell>;
}
