'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { type AdminOrder, type OrderStatus } from '../../lib/adminTypes';
import { adminApi } from '../../lib/adminApi';

const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

type Resolved = { optionName: string; label: string; swatch?: string; image?: string };

function resolveSelection(value: any): Resolved {
  if (value && typeof value === 'object' && 'optionName' in value) {
    return {
      optionName: value.optionName || 'Option',
      label: value.value != null ? String(value.value) : '—',
      swatch: value.swatch,
      image: value.image,
    };
  }
  return { optionName: 'Option', label: String(value) };
}

export default function OrdersPanel() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getOrders()
      .then(setOrders)
      .catch((err) => console.error('Failed to load orders:', err.message))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: OrderStatus) {
    const prev = orders;
    setOrders((p) => p.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await adminApi.updateOrderStatus({ id, status });
    } catch (err: any) {
      setOrders(prev); // revert on failure
      alert('Failed to update status: ' + err.message);
    }
  }

  if (loading) return <p className="text-sm text-brown-soft">Loading orders…</p>;

  return (
    <div>
      <h3 className="mb-5 text-lg font-medium">Orders ({orders.length})</h3>

      {orders.length === 0 ? (
        <p className="border border-line bg-paper-light p-6 text-center text-sm text-brown-soft">
          No orders yet.
        </p>
      ) : (
        <div className="space-y-5">
          {orders.map((o) => {
            const isFreeShipping = o.deliveryFee === 0;
            return (
              <div key={o.id} className="border border-line bg-paper-light p-6">
                {/* Top row: order id/customer + status control */}
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-line pb-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[.08em] text-brown-soft">
                      Order {o.id.slice(0, 8)}
                    </p>
                    <p className="mt-1 text-sm text-brown">
                      <span className={o.isRegistered ? 'text-brown' : 'text-brown-soft'}>
                        {o.isRegistered ? 'User' : 'Guest'}
                      </span>
                      {o.customerName !== 'Guest' && <> · {o.customerName}</>}
                      {' '}<span className="text-brown-soft">· {o.email}</span>
                    </p>
                    <p className="mt-1 text-[12px] text-brown-soft">{o.createdAt}</p>
                    {o.city !== '—' && (
                      <p className="mt-1 text-[12px] text-brown-soft">
                        Shipping to <span className="text-brown">{o.city}</span>
                      </p>
                    )}
                  </div>

                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                    className="border border-line bg-cream px-3 py-2 text-xs uppercase tracking-[.06em]"
                  >
                    {!statuses.includes(o.status) && (
                      <option value={o.status}>{o.status} (unrecognized)</option>
                    )}
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {o.items.length === 0 ? (
                    <p className="text-[13px] text-brown-soft">No items found for this order.</p>
                  ) : (
                    o.items.map((item, i) => {
                      const selections = item.customization
                        ? Object.values(item.customization).map(resolveSelection)
                        : [];
                      return (
                        <div key={i} className="flex items-start gap-4 text-[13.5px]">
                          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden border border-line bg-cream">
                            {item.imageUrl ? (
                              <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gold">
                                <span className="text-lg">✦</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <p className="text-brown">
                              {item.productName} × {item.quantity}
                            </p>
                            {selections.length > 0 && (
                              <div className="mt-2 space-y-1.5">
                                {selections.map((s, j) => (
                                  <div key={j} className="flex items-center gap-2">
                                    {s.image ? (
                                      <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden border border-line">
                                        <Image src={s.image} alt={s.label} fill className="object-cover" />
                                      </div>
                                    ) : s.swatch ? (
                                      <span
                                        className="h-3.5 w-3.5 flex-shrink-0 border border-line"
                                        style={{ backgroundColor: s.swatch }}
                                      />
                                    ) : null}
                                    <span className="text-[11.5px] text-brown-soft">
                                      {s.optionName}: <span className="text-brown">{s.label}</span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <span className="flex-shrink-0 text-brown">
                            EGP {item.unitPrice * item.quantity}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Totals */}
                <div className="mt-6 space-y-2 border-t border-line pt-5 text-[13.5px]">
                  <div className="flex justify-between text-brown-soft">
                    <span>Subtotal</span>
                    <span className="text-brown">EGP {o.subtotal}</span>
                  </div>
                  {o.discount > 0 && (
                    <div className="flex justify-between text-brown-soft">
                      <span>Discount</span>
                      <span className="text-brown">-EGP {o.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brown-soft">
                    <span>Shipping</span>
                    <span className="text-brown">{isFreeShipping ? 'Free' : `EGP ${o.deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between border-t border-line pt-3 text-base text-brown">
                    <span>Total</span>
                    <span className="font-display text-lg">EGP {o.total}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}