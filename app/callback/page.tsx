'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '../../lib/supabaseClient';

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (sessionError || !session) {
        setError('Sign-in did not complete. Please try again.');
        return;
      }
      router.replace('/account');
    });
  }, [router]);

  return (
    <main className="content-page" style={{ maxWidth: 420, paddingTop: 120, textAlign: 'center' }}>
      {error ? (
        <>
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </>
      ) : (
        <>
          <div className="custom-symbol">✦</div>
          <h2>Signing you in…</h2>
        </>
      )}
    </main>
  );
}
