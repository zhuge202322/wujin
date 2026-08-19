import { AdminLoginForm } from '../components/AdminLoginForm.js';

export default function AdminLoginPage() {
  return (
    <main className="admin-login-page">
      <section className="admin-login-panel" aria-labelledby="admin-login-title">
        <a className="admin-login-brand" href="/" aria-label="Return to LP Flange website">
          <img src="/images/lpflange-wordmark.png" alt="LP Flange" />
        </a>
        <h1 id="admin-login-title">Administrator login</h1>
        <p>Sign in to manage catalog data, website settings and images.</p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
