'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function SeasonalBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div style={{ background: 'var(--brown)', color: 'var(--cream)', textAlign: 'center', padding: '10px 40px', fontSize: 12, letterSpacing: '.04em', position: 'relative' }}>
      <Link href="/sale" style={{ borderBottom: '1px solid var(--gold)', paddingBottom: 2 }}>
        Advent sale — 15% off journals and wood verses, this week only
      </Link>
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss banner"
        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', border: 0, background: 'transparent', color: 'var(--cream)', cursor: 'pointer' }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
