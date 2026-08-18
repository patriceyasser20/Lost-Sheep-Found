'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabaseClient } from '../../lib/supabaseClient';
import VerseBlock from '../components/VerseBlock';

export default function ConfirmPage() {
  const [status, setStatus] = useState<'checking' | 'confirmed' | 'error'>('checking');

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setStatus(session ? 'confirmed' : 'error');
    });
  }, []);

  return (
    <main className="overflow-x-hidden pt-[120px] pb-[80px] text-center">
      <div className="mx-auto max-w-[420px] px-[30px]">
        <div className="mb-[18px] text-[22px] text-[#c2a97e]">✦</div>
        {status === 'checking' && <h2 className="font-display text-3xl font-medium">Confirming your email…</h2>}
        {status === 'confirmed' && (
          <>
            <h2 className="font-display text-3xl font-medium">You're all set</h2>
            <p className="mt-[14px] text-brown-soft">Your email has been confirmed.</p>
            <Link href="/account" className="mt-[10px] inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]">Go to your account</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h2 className="font-display text-3xl font-medium">Couldn't confirm your email</h2>
            <p className="mt-[14px] text-brown-soft">The link may have expired. Try signing in — we'll send a fresh one if needed.</p>
            <Link href="/login" className="mt-[10px] inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]">Go to sign in</Link>
          </>
        )}
      </div>

      {status !== 'checking' && (
        <div className="relative left-1/2 right-1/2 mt-16 -ml-[50vw] -mr-[50vw] w-screen">
          <VerseBlock
            verse="I have called you by name, you are mine."
            reference="Isaiah 43:1"
          />
        </div>
      )}
    </main>
  );
}