'use client';

import { useState } from 'react';
import { mockOrders, type AdminOrder, type OrderStatus } from '../../lib/adminTypes';
import { adminApi } from '../../lib/adminApi';

const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrdersPanel() {
  const [orders, setOrders] = useState<AdminOrder[]>(mockOrders);

  async function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await adminApi.updateOrderStatus({ id, status });
  }

  return (
    <div>
      <h3 className="mb-2 text-lg font-medium">Orders ({orders.length})</h3>
      <p className="mb-5 text-[13px] text-brown-soft">
        Live orders will populate here once Supabase's `orders` table is connected — showing sample data for now.
      </p>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-[11px] uppercase tracking-[.08em] text-brown-soft">
            <th className="py-3">Order</th>
            <th className="py-3">Customer</th>
            <th className="py-3">Items</th>
            <th className="py-3">Total</th>
            <th className="py-3">Date</th>
            <th className="py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-line">
              <td className="py-3 font-medium">{o.id}</td>
              <td className="py-3">
                {o.customerName}
                <div className="text-xs text-brown-soft">{o.email}</div>
              </td>
              <td className="py-3 text-brown-soft">{o.itemsSummary}</td>
              <td className="py-3">EGP {o.total}</td>
              <td className="py-3 text-brown-soft">{o.createdAt}</td>
              <td className="py-3">
                <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)} className="border border-line bg-cream px-2 py-1 text-xs">
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}