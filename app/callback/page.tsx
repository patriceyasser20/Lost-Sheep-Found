'use client';

import { useEffect, useState } from 'react';
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

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    supabaseClient.auth.getSession().then(async ({ data: { session }, error: sessionError }) => {
      if (sessionError || !session) {
        setError('Sign-in did not complete. Please try again.');
        return;
      }

      const isAdmin = await checkAndSetAdmin(session.access_token);
      router.replace(isAdmin ? '/admin' : '/account');
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