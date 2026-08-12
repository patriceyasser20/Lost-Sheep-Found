'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function SeasonalBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="relative bg-brown px-10 py-[10px] text-center text-xs tracking-[.04em] text-cream">
      <Link href="/sale" className="border-b border-gold pb-[2px]">
        Advent sale — 15% off journals and wood verses, this week only
      </Link>
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss banner"
        className="absolute right-[14px] top-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent text-cream"
      >
        <X size={14} />
      </button>
    </div>
  );
}