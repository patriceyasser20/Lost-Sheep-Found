'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div className="custom-symbol">✦</div>
        <h2 style={{ fontSize: 30, letterSpacing: '-.03em', marginBottom: 14 }}>Something went wrong</h2>
        <p style={{ color: 'var(--brown-soft)', marginBottom: 30 }}>
          We hit an unexpected error. Please try again, or head back to the homepage.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <button onClick={() => reset()} className="button button-dark">Try again</button>
          <Link href="/" className="text-link">Return home</Link>
        </div>
      </div>
    </div>
  );
}
