'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');

      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminToken', data.token);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="content-page" style={{ maxWidth: 420, paddingTop: 100 }}>
      <p className="eyebrow" style={{ textAlign: 'center' }}>Admin</p>
      <h2 style={{ textAlign: 'center' }}>Sign in</h2>

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
          <Lock size={14} /> {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
