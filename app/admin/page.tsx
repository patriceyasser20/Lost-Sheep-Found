'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { products } from '../../lib/products';

// Real product/order management would call lib/adminApi.ts, which posts to
// /api/admin-ops with the token below. This page just gates access and
// shows the current (local) product list as a starting point.

export default function AdminDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <main className="mx-auto max-w-[900px] px-[30px] pb-[120px] pt-[70px]">
      <p className="mb-[6px] text-[10px] uppercase tracking-[.16em] text-gold">Admin</p>
      <h2 className="mt-[30px] mb-4 font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Dashboard</h2>
      <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
        Product, promo, and shipping management will live here once Supabase
        is connected — this scaffold reads from the local product list for
        now.
      </p>

      <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Products ({products.length})</h2>
      <ul className="mb-[18px] list-disc pl-5 text-[14.5px] leading-[1.85] text-brown-soft">
        {products.map((p) => (
          <li key={p.slug} className="mb-1.5">{p.name} — {p.priceLabel} — stock: {p.stock}</li>
        ))}
      </ul>
    </main>
  );
}