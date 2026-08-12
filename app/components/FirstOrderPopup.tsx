'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'lsf_first_order_popup_seen';

export default function FirstOrderPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : 'true';
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed', bottom: 24, left: 24, zIndex: 40, maxWidth: 300,
        background: 'var(--brown)', color: 'var(--cream)', padding: '26px 24px',
      }}
    >
      <button onClick={dismiss} aria-label="Dismiss" style={{ position: 'absolute', top: 10, right: 10, border: 0, background: 'transparent', color: 'var(--cream)', cursor: 'pointer' }}>
        <X size={16} />
      </button>
      <p className="eyebrow" style={{ color: '#c2a97e' }}>Welcome</p>
      <h3 style={{ margin: '6px 0 10px', fontSize: 20 }}>10% off your first order</h3>
      <p style={{ fontSize: 12.5, color: 'rgba(255,253,248,.75)', margin: '0 0 16px' }}>
        Use code <strong>FIRST10</strong> at checkout.
      </p>
    </div>
  );
}
