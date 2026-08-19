'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username: form.get('username'), password: form.get('password') })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || 'Unable to sign in.');
      router.replace('/admin');
      router.refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="admin-form login-form" onSubmit={submit}>
      <label>Username<input name="username" autoComplete="username" required /></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
      {error ? <p className="admin-feedback error" role="alert">{error}</p> : null}
      <button className="admin-button primary" disabled={pending} type="submit">
        {pending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
