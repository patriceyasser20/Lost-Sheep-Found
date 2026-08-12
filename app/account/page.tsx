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
    <main className="content-page">
      <p className="eyebrow">Your account</p>
      <h2>{user?.email ?? 'Loading…'}</h2>

      <h2>Order history</h2>
      {loading ? (
        <p>Loading orders…</p>
      ) : orders.length === 0 ? (
        <p>No orders yet — once you place one, it'll show up here.</p>
      ) : (
        <ul>
          {orders.map((o) => (
            <li key={o.id}>{o.created_at} — EGP {o.total} — {o.status}</li>
          ))}
        </ul>
      )}

      <button onClick={signOut} className="button button-line" style={{ marginTop: 30 }}>
        Sign out
      </button>
    </main>
  );
}
