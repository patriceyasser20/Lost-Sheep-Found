'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabaseClient } from '../../lib/supabaseClient';

export default function ConfirmPage() {
  const [status, setStatus] = useState<'checking' | 'confirmed' | 'error'>('checking');

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setStatus(session ? 'confirmed' : 'error');
    });
  }, []);

  return (
    <main className="content-page" style={{ maxWidth: 420, paddingTop: 120, textAlign: 'center' }}>
      <div className="custom-symbol">✦</div>
      {status === 'checking' && <h2>Confirming your email…</h2>}
      {status === 'confirmed' && (
        <>
          <h2>You're all set</h2>
          <p>Your email has been confirmed.</p>
          <Link href="/account" className="button button-dark" style={{ marginTop: 10 }}>Go to your account</Link>
        </>
      )}
      {status === 'error' && (
        <>
          <h2>Couldn't confirm your email</h2>
          <p>The link may have expired. Try signing in — we'll send a fresh one if needed.</p>
          <Link href="/login" className="button button-dark" style={{ marginTop: 10 }}>Go to sign in</Link>
        </>
      )}
    </main>
  );
}
