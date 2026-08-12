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
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-20">
      <div className="max-w-[420px] text-center">
        <div className="mb-[18px] text-[22px] text-[#c2a97e]">✦</div>
        <h2 className="mb-[14px] text-[30px] tracking-[-.03em]">Something went wrong</h2>
        <p className="mb-[30px] text-brown-soft">
          We hit an unexpected error. Please try again, or head back to the homepage.
        </p>
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={() => reset()}
            className="inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]"
          >
            Try again
          </button>
          <Link href="/" className="text-xs uppercase tracking-[.08em] border-b border-gold pb-[5px]">Return home</Link>
        </div>
      </div>
    </div>
  );
}