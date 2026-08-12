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
    <div className="fixed bottom-6 left-6 z-40 max-w-[300px] bg-brown px-6 py-[26px] text-cream">
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-[10px] top-[10px] cursor-pointer border-0 bg-transparent text-cream"
      >
        <X size={16} />
      </button>
      <p className="text-[10px] tracking-[.22em] uppercase text-[#c2a97e]">Welcome</p>
      <h3 className="my-[6px] mb-[10px] font-display text-xl font-medium">10% off your first order</h3>
      <p className="mb-4 text-[12.5px] text-cream/[.75]">
        Use code <strong>FIRST10</strong> at checkout.
      </p>
    </div>
  );
}