'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useRequireAuth } from '../../lib/useRequireAuth';
import { supabaseClient } from '../../lib/supabaseClient';

type OrderItem = {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  customization: Record<string, any> | null;
  products: { name: string; image_url: string | null } | null;
};

type Order = {
  id: string;
  created_at: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  city: string | null;
  shipping_address: any;
  order_items: OrderItem[];
};

type Resolved = { optionName: string; label: string; swatch?: string; image?: string };

// Selections are stored at checkout as self-contained snapshots:
// { value, optionName, swatch?, image? } — no lookup needed.
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

export default function AccountPage() {
  useRequireAuth();
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    supabaseClient
      .from('orders')
      .select(`
        id,
        created_at,
        status,
        subtotal,
        delivery_fee,
        discount,
        total,
        city,
        shipping_address,
        order_items (
          id,
          product_id,
          quantity,
          unit_price,
          customization,
          products ( name, image_url )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          console.error('Failed to load orders:', fetchError.message);
          setError('Could not load your orders. Please try again.');
        } else {
          setOrders((data as any) || []);
        }
        setLoading(false);
      });
  }, [user]);

  return (
    <main className="mx-auto max-w-[780px] px-[30px] pb-[120px] pt-[70px]">
      <p className="mb-[6px] text-[10px] uppercase tracking-[.16em] text-gold">Your account</p>
      <h2 className="mt-[30px] mb-4 font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">
        {user?.email ?? 'Loading…'}
      </h2>

      <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">
        Order history
      </h2>

      {loading ? (
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">Loading orders…</p>
      ) : error ? (
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-[#a14b3c]">{error}</p>
      ) : orders.length === 0 ? (
        <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
          No orders yet — once you place one, it'll show up here.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isFreeShipping = !order.delivery_fee || Number(order.delivery_fee) === 0;
            const paymentMethod = order.shipping_address?.payment_method || '—';
            const promoCode = order.shipping_address?.promo_code;

            return (
              <div key={order.id} className="border border-line bg-paper-light p-6 md:p-8">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-line pb-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[.08em] text-brown-soft">
                      Order {order.id.slice(0, 8)}
                    </p>
                    <p className="mt-1 text-[12.5px] text-brown-soft">
                      {new Date(order.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="border border-line px-2.5 py-1 text-[10px] uppercase tracking-[.08em] text-brown-soft">
                      {order.status}
                    </span>
                    <span className="border border-gold px-2.5 py-1 text-[10px] uppercase tracking-[.08em] text-gold">
                      {paymentMethod}
                    </span>
                  </div>
                </div>

                {order.city && (
                  <p className="mb-5 text-[13px] text-brown-soft">
                    Shipping to <span className="text-brown">{order.city}</span>
                  </p>
                )}

                <div className="space-y-5">
                  {order.order_items?.length > 0 ? (
                    order.order_items.map((item) => {
                      const selections = item.customization && typeof item.customization === 'object'
                        ? Object.values(item.customization).map(resolveSelection)
                        : [];

                      return (
                        <div key={item.id} className="flex items-start gap-4 text-[13.5px]">
                          {/* Product thumbnail */}
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden border border-line bg-cream">
                            {item.products?.image_url ? (
                              <Image
                                src={item.products.image_url}
                                alt={item.products.name || 'Product'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gold">
                                <span className="text-lg">✦</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <p className="text-brown">
                              {item.products?.name || 'Product'} × {item.quantity}
                            </p>
                            {selections.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {selections.map((s, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    {s.image ? (
                                      <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden border border-line">
                                        <Image src={s.image} alt={s.label} fill className="object-cover" />
                                      </div>
                                    ) : s.swatch ? (
                                      <span
                                        className="h-4 w-4 flex-shrink-0 border border-line"
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

                          <span className="flex-shrink-0 text-brown">EGP {item.unit_price * item.quantity}</span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-[13px] text-brown-soft">No items found for this order.</p>
                  )}
                </div>

                <div className="mt-6 space-y-2 border-t border-line pt-5 text-[13.5px]">
                  <div className="flex justify-between text-brown-soft">
                    <span>Subtotal</span>
                    <span className="text-brown">EGP {order.subtotal}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-brown-soft">
                      <span>Discount{promoCode ? ` (${promoCode})` : ''}</span>
                      <span className="text-brown">-EGP {order.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brown-soft">
                    <span>Shipping</span>
                    <span className="text-brown">{isFreeShipping ? 'Free' : `EGP ${order.delivery_fee}`}</span>
                  </div>
                  <div className="flex justify-between border-t border-line pt-3 text-base text-brown">
                    <span>Total</span>
                    <span className="font-display text-lg">EGP {order.total}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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