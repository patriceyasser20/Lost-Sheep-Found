'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { getSaleBannerClient } from '../../lib/sale';
import { getActiveOffersClient } from '../../lib/offers';

type BannerData = { text: string; href: string };

export default function SeasonalBanner() {
  const [visible, setVisible] = useState(true);
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      const sale = await getSaleBannerClient();
      if (!active) return;

      if (sale) {
        setBanner(sale);
        setChecked(true);
        return;
      }

      try {
        const offers = await getActiveOffersClient();
        if (!active) return;
        setBanner(
          offers && offers.length > 0
            ? { text: 'New offers available — shop now', href: '/offers' }
            : null
        );
      } catch {
        if (active) setBanner(null);
      } finally {
        if (active) setChecked(true);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (!checked || !visible || !banner) return null;

  return (
    <div className="relative bg-brown px-10 py-[10px] text-center text-xs tracking-[.04em] text-cream">
      <Link href={banner.href} className="border-b border-gold pb-[2px]">
        {banner.text}
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