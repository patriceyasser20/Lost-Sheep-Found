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
    <main className="content-page" style={{ maxWidth: 900 }}>
      <p className="eyebrow">Admin</p>
      <h2>Dashboard</h2>
      <p>
        Product, promo, and shipping management will live here once Supabase
        is connected — this scaffold reads from the local product list for
        now.
      </p>

      <h2>Products ({products.length})</h2>
      <ul>
        {products.map((p) => (
          <li key={p.slug}>{p.name} — {p.priceLabel} — stock: {p.stock}</li>
        ))}
      </ul>
    </main>
  );
}
