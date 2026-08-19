'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { supabaseClient } from '../../lib/supabaseClient';
import VerseBlock from '../components/VerseBlock';

type OrderItem = {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  original_price: number | null;
  discount_percentage: number;
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

const ORDER_SELECT = `
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
    original_price,
    discount_percentage,
    customization,
    products ( name, image_url )
  )
`;

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('order_id');

  const { user, signOut, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Viewing a single order via ?order_id= works for guests too (that's how
  // a guest checkout lands on their confirmation) — only the full "my
  // orders" list requires being logged in.
  useEffect(() => {
    if (orderIdParam) return;
    if (authLoading) return;
    if (!user) router.replace('/login');
  }, [orderIdParam, user, authLoading, router]);

  useEffect(() => {
    if (orderIdParam) {
      supabaseClient
        .from('orders')
        .select(ORDER_SELECT)
        .eq('id', orderIdParam)
        .maybeSingle()
        .then(({ data, error: fetchError }) => {
          if (fetchError || !data) {
            setError("We couldn't find that order.");
          } else {
            setOrders([data as any]);
          }
          setLoading(false);
        });
      return;
    }

    if (authLoading) return;
    if (!user) return; // redirect effect above will send them to /login

    supabaseClient
      .from('orders')
      .select(ORDER_SELECT)
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
  }, [orderIdParam, user, authLoading]);

  const singleOrderMode = !!orderIdParam;

  return (
    <main className="overflow-x-hidden pb-[120px] pt-[70px]">
      <div className="mx-auto max-w-[780px] px-[30px]">
        {!singleOrderMode && (
          <>
            <p className="mb-[6px] text-[10px] uppercase tracking-[.16em] text-gold">Your account</p>
            <h2 className="mt-[30px] mb-4 font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">
              {user?.email ?? 'Loading…'}
            </h2>
          </>
        )}

        <h2 className="mb-4 mt-[52px] font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">
          {singleOrderMode ? 'Your order' : 'Order history'}
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

                            <div className="flex-shrink-0 text-right">
                              {item.discount_percentage > 0 && item.original_price != null ? (
                                <>
                                  <div className="text-[11px] text-brown-soft line-through">
                                    EGP {item.original_price * item.quantity}
                                  </div>
                                  <div className="text-[#a14b3c]">
                                    EGP {item.unit_price * item.quantity}
                                    <span className="ml-1.5 text-[10px]">(-{item.discount_percentage}%)</span>
                                  </div>
                                </>
                              ) : (
                                <span className="text-brown">EGP {item.unit_price * item.quantity}</span>
                              )}
                            </div>
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

        {!singleOrderMode && user && (
          <button
            onClick={signOut}
            className="mt-[30px] inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-brown bg-transparent px-5 text-[11px] uppercase tracking-[.08em] text-brown transition duration-200 hover:bg-brown hover:text-cream"
          >
            Sign out
          </button>
        )}
      </div>

      <div className="relative left-1/2 right-1/2 mt-16 -ml-[50vw] -mr-[50vw] w-screen">
        <VerseBlock verse="I will never leave you nor forsake you." reference="Hebrews 13:5" />
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountContent />
    </Suspense>
  );
}