'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '../../lib/supabaseClient';
import VerseBlock from '../components/VerseBlock';

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

    let isAdmin = false;
    if (data.session) isAdmin = await checkAndSetAdmin(data.session.access_token);

    router.push(isAdmin ? '/admin' : '/account');
  }

  return (
    <main className="mx-auto max-w-[420px] px-[30px] pb-[80px] pt-[100px]">
      <p className="mb-[6px] text-center text-[10px] uppercase tracking-[.16em] text-gold">Welcome back</p>
      <h2 className="mt-[30px] mb-4 text-center font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Sign in</h2>

      <button
        onClick={signInWithGoogle}
        className="mb-5 flex w-full min-h-[46px] items-center justify-center gap-[10px] border border-brown bg-transparent px-5 text-[11px] uppercase tracking-[.08em] text-brown transition duration-200 hover:bg-brown hover:text-cream disabled:cursor-not-allowed disabled:opacity-45"
        disabled={loading}
      >
        Continue with Google
      </button>

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
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-[18px] text-center py-5 text-xs text-brown-soft">
        New here? <Link href="/signup" className="text-xs uppercase tracking-[.08em] border-b border-gold pb-[5px]">Create an account</Link>
      </p>

      <VerseBlock
        verse="Come to me, all you who are weary and burdened, and I will give you rest."
        reference="Matthew 11:28"
      />
    </main>
  );
}