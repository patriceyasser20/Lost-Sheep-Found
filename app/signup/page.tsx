'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabaseClient } from '../../lib/supabaseClient';
import VerseBlock from '../components/VerseBlock';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const existsRes = await fetch('/api/check-existing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const { exists } = await existsRes.json();
    if (exists) {
      setError('An account with this email already exists.');
      setLoading(false);
      return;
    }

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: `${window.location.origin}/confirm`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <main className="mx-auto max-w-[420px] px-[30px] pt-[100px] text-center">
        <div className="mb-[18px] text-[22px] text-[#c2a97e]">✦</div>
        <h2 className="mt-[30px] mb-4 font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Check your inbox</h2>
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">We've sent a confirmation link to {email}.</p>

        <VerseBlock
          verse="The Lord bless you and keep you."
          reference="Numbers 6:24"
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[420px] px-[30px] pb-[80px] pt-[100px]">
      <p className="mb-[6px] text-center text-[10px] uppercase tracking-[.16em] text-gold">Join us</p>
      <h2 className="mt-[30px] mb-4 text-center font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Create an account</h2>

      <form onSubmit={handleSignup}>
        <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
          <div className="mb-[18px] flex flex-col gap-2">
            <label htmlFor="firstName" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">First name</label>
            <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
          </div>
          <div className="mb-[18px] flex flex-col gap-2">
            <label htmlFor="lastName" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Last name</label>
            <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
          </div>
        </div>
        <div className="mb-[18px] flex flex-col gap-2">
          <label htmlFor="email" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
        </div>
        <div className="mb-[18px] flex flex-col gap-2">
          <label htmlFor="password" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
        </div>
        {error && <p className="mt-1 text-xs text-[#a14b3c]">{error}</p>}
        <button
          type="submit"
          className="flex w-full min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
          disabled={loading}
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-[18px] text-center py-5 text-xs text-brown-soft">
        Already have an account? <Link href="/login" className="text-xs uppercase tracking-[.08em] border-b border-gold pb-[5px]">Sign in</Link>
      </p>
      <VerseBlock
          verse="In all things God works for the good of those who love him."
          reference="Romans 8:28"
        />
    </main>
  );
}