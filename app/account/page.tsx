'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequireAuth } from '../../lib/useRequireAuth';

type Order = { id: string; created_at: string; total: number; status: string };

export default function AccountPage() {
  useRequireAuth();
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: once Supabase is wired up —
    //   supabaseClient.from('orders').select('*').eq('user_id', user.id)
    setOrders([]);
    setLoading(false);
  }, [user]);

  return (
    <main className="mx-auto max-w-[780px] px-[30px] pb-[120px] pt-[70px]">
      <p className="mb-[6px] text-[10px] uppercase tracking-[.16em] text-gold">Your account</p>
      <h2 className="mt-[30px] mb-4 font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">{user?.email ?? 'Loading…'}</h2>

      <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Order history</h2>
      {loading ? (
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">No orders yet — once you place one, it'll show up here.</p>
      ) : (
        <ul className="mb-[18px] list-disc pl-5 text-[14.5px] leading-[1.85] text-brown-soft">
          {orders.map((o) => (
            <li key={o.id} className="mb-1.5">{o.created_at} — EGP {o.total} — {o.status}</li>
          ))}
        </ul>
      )}

      <button
        onClick={signOut}
        className="mt-[30px] inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-brown bg-transparent px-5 text-[11px] uppercase tracking-[.08em] text-brown transition duration-200 hover:bg-brown hover:text-cream"
      >
        Sign out
      </button>
    </main>
  );
}