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
    <main className="mx-auto max-w-[420px] px-[30px] pt-[100px]">
      <p className="mb-[6px] text-center text-[10px] uppercase tracking-[.16em] text-gold">Admin</p>
      <h2 className="mt-[30px] mb-4 text-center font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Sign in</h2>

      <form onSubmit={handleLogin}>
        <div className="mb-[18px] flex flex-col gap-2">
          <label htmlFor="email" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
        </div>
        <div className="mb-[18px] flex flex-col gap-2">
          <label htmlFor="password" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
        </div>
        {error && <p className="mt-1 text-xs text-[#a14b3c]">{error}</p>}
        <button
          type="submit"
          className="flex w-full min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
          disabled={loading}
        >
          <Lock size={14} /> {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}