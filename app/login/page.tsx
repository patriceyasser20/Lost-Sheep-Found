'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '../../lib/supabaseClient';

async function checkAndSetAdmin(accessToken: string): Promise<boolean> {
  const res = await fetch('/api/admin-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: accessToken }),
  });
  if (!res.ok) return false;
  const data = await res.json();
  localStorage.setItem('isAdmin', 'true');
  localStorage.setItem('adminToken', data.token);
  return true;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle() {
    setLoading(true);
    setError('');
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/callback` },
    });
    if (error) setError(error.message);
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) await checkAndSetAdmin(data.session.access_token);
    router.push('/account');
  }

  return (
    <main className="content-page" style={{ maxWidth: 420, paddingTop: 100 }}>
      <p className="eyebrow" style={{ textAlign: 'center' }}>Welcome back</p>
      <h2 style={{ textAlign: 'center' }}>Sign in</h2>

      <button onClick={signInWithGoogle} className="button button-line button-block" disabled={loading} style={{ marginBottom: 20 }}>
        Continue with Google
      </button>

      <form onSubmit={handleLogin}>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="form-note" style={{ color: '#a14b3c' }}>{error}</p>}
        <button type="submit" className="button button-dark button-block" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="form-note" style={{ textAlign: 'center', marginTop: 18 }}>
        New here? <Link href="/signup" className="text-link">Create an account</Link>
      </p>
    </main>
  );
}
