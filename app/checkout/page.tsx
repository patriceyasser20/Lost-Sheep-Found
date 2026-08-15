'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Truck, CreditCard } from 'lucide-react';
import { createPaymobPayment } from '../actions/paymob';
import { createClient } from '../../lib/supabaseClient';
import { getProductsClient, type Product } from '../../lib/products';
import { getCart, type CartLine } from '../../lib/localCart';
import { useAuth } from '../context/AuthContext';
import { getShippingCitiesClient, type ShippingCity } from '../../lib/shipping';

type PaymentMethod = 'paymob' | 'cod';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [supabase] = useState(() => createClient());

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paymob');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Contact & shipping fields, controlled so we can pre-fill and re-use on submit
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  

  // Governorate — driven by whatever the admin has entered in the shipping panel
  const [cities, setCities] = useState<ShippingCity[]>([]);
  const [selectedCityId, setSelectedCityId] = useState('');
  const selectedCity = cities.find((c) => c.id === selectedCityId);

  // Promo code
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  // First-order welcome discount — auto-applied for logged-in accounts with
  // zero prior orders. Guests aren't eligible (nothing to check against).
  const FIRST_ORDER_DISCOUNT_PCT = 5;
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const shipping = selectedCity ? selectedCity.fee : 0;

  useEffect(() => {
    setCart(getCart());
    getProductsClient().then(setProducts);
    getShippingCitiesClient().then(setCities);
  }, []);

  // Pre-fill contact info + check first-order eligibility once we know who's logged in
  useEffect(() => {
    if (!user) return;
    if (user.email) setEmail(user.email);
    if (user.user_metadata?.phone) setPhone(user.user_metadata.phone as string);

    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .then(({ count, error: countError }) => {
        if (!countError) setIsFirstOrder((count || 0) === 0);
      });
  }, [user, supabase]);

  const lines = cart
    .map((line) => ({ line, product: products.find((p) => p.id === line.id) }))
    .filter((l) => l.product);

  const subtotal = lines.reduce((sum, l) => sum + l.product!.price * l.line.qty, 0);
  

  const promoDiscount = appliedPromo ? Math.round((subtotal * appliedPromo.discount) / 100) : 0;
  const firstOrderDiscount = isFirstOrder ? Math.round((subtotal * FIRST_ORDER_DISCOUNT_PCT) / 100) : 0;
  const total = Math.max(0, subtotal - promoDiscount - firstOrderDiscount) + shipping;

  async function applyPromoCode() {
    if (!promoCodeInput.trim()) return;
    setPromoError('');
    setAppliedPromo(null);

    const res = await fetch('/api/promo/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: promoCodeInput.trim() }),
    });
    const data = await res.json();

    if (!data.valid) {
      setPromoError(data.message || 'Invalid promo code');
      return;
    }
    setAppliedPromo({ code: promoCodeInput.trim().toUpperCase(), discount: data.discount });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (lines.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (!firstName || !lastName || !email || !phone || !address || !selectedCityId) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      // Re-verify first-order eligibility right before charging rather than
      // trusting the state computed on page load, in case an order was
      // placed in another tab in the meantime.
      let verifiedFirstOrderDiscount = 0;
      if (user?.id) {
        const { count } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);
        if ((count || 0) === 0) {
          verifiedFirstOrderDiscount = Math.round((subtotal * FIRST_ORDER_DISCOUNT_PCT) / 100);
        }
      }

      const totalDiscount = Math.min(promoDiscount + verifiedFirstOrderDiscount, subtotal);
      const orderEmail = user?.email || email;
      const status = paymentMethod === 'cod' ? 'succeeded' : 'pending';
      const governorateName = selectedCity!.city;

      // NOTE: adjust these column names if your `orders`/`order_items` schema differs —
      // I haven't seen your current schema, so this mirrors the shape from your
      // previous full checkout implementation as closely as possible.
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          subtotal,
          delivery_fee: shipping,
          discount: totalDiscount,
          total,
          status,
          city: governorateName,
          shipping_address: {
            first_name: firstName,
            last_name: lastName,
            email: orderEmail,
            contact_email: email,
            phone,
            street: address,
            payment_method: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit / Debit Card',
            promo_code: appliedPromo?.code || null,
          },
        })
        .select()
        .single();

      if (orderError || !order) throw new Error(orderError?.message || 'Failed to create order.');

      const orderItemsData = lines.map(({ line, product }) => ({
        order_id: order.id,
        product_id: product!.id,
        quantity: line.qty,
        unit_price: product!.price,
        customization: line.selections || null,
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);
      if (itemsError) console.error('Failed to insert order items:', itemsError);

      if (paymentMethod === 'cod') {
        router.push(`/checkout/success?order_id=${order.id}`);
        return;
      }

      const { iframeUrl } = await createPaymobPayment(
        total,
        lines.map((l) => ({ id: l.product!.id, name: l.product!.name, price: l.product!.price, quantity: l.line.qty })),
        order.id,
        { firstName, lastName, email, phone, street: address, city: governorateName },
        appliedPromo?.code,
        appliedPromo?.discount
      );
      window.location.href = iframeUrl;
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="mx-auto max-w-[640px] px-5 pb-10 pt-[65px] text-center md:px-[30px] md:pb-[55px] md:pt-[95px]">
        <p className="mb-[17px] block text-[10px] font-semibold uppercase tracking-[.22em] text-gold">Step 2 of 2</p>
        <h1 className="my-[18px] font-display text-[clamp(46px,5.6vw,76px)] font-medium leading-[.92] tracking-[-.045em]">Checkout</h1>
      </section>

      <form className="mx-auto grid max-w-[1240px] grid-cols-1 items-start gap-11 px-5 py-10 md:grid-cols-[1.5fr_1fr] md:gap-[60px] md:px-[30px] md:py-[60px]" onSubmit={handleSubmit}>
        <div>
          <div className="mb-[42px]">
            <h2 className="mb-5 flex items-center gap-[10px] text-xl tracking-[-.02em]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold text-[11px] font-sans text-gold">1</span>
              Contact & shipping
            </h2>
            <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
              <div className="mb-[18px] flex flex-col gap-2">
                <label htmlFor="firstName" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">First name</label>
                <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
              </div>
              <div className="mb-[18px] flex flex-col gap-2">
                <label htmlFor="lastName" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Last name</label>
                <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
              </div>
              <div className="col-span-1 mb-[18px] flex flex-col gap-2 md:col-span-2">
                <label htmlFor="email" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Email</label>
                <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
              </div>
              <div className="col-span-1 mb-[18px] flex flex-col gap-2 md:col-span-2">
                <label htmlFor="address" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Address</label>
                <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} type="text" required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
              </div>
              <div className="mb-[18px] flex flex-col gap-2 md:col-span-2">
                <label htmlFor="phone" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Phone</label>
                <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
              </div>
              <div className="col-span-1 mb-[18px] flex flex-col gap-2 md:col-span-2">
                <label htmlFor="governorate" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Governorate</label>
                <select
                  id="governorate"
                  value={selectedCityId}
                  onChange={(e) => setSelectedCityId(e.target.value)}
                  required
                  className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold"
                >
                  <option value="">Select your governorate</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.city} — {c.freeShipping ? 'Free' : `EGP ${c.fee}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-[42px]">
            <h2 className="mb-5 flex items-center gap-[10px] text-xl tracking-[-.02em]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold text-[11px] font-sans text-gold">2</span>
              Payment
            </h2>
            <label className={`mb-[10px] flex cursor-pointer items-center gap-3 border px-[18px] py-4 text-[13.5px] ${paymentMethod === 'paymob' ? 'border-gold bg-paper-light' : 'border-line'}`}>
              <input type="radio" name="payment" checked={paymentMethod === 'paymob'} onChange={() => setPaymentMethod('paymob')} className="accent-brown" />
              <CreditCard size={18} className="text-brown-soft" />
              Credit or debit card
            </label>
            <label className={`mb-[10px] flex cursor-pointer items-center gap-3 border px-[18px] py-4 text-[13.5px] ${paymentMethod === 'cod' ? 'border-gold bg-paper-light' : 'border-line'}`}>
              <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-brown" />
              <Truck size={18} className="text-brown-soft" />
              Cash on delivery
            </label>
          </div>

          {error && <p className="mt-1 text-xs text-[#a14b3c]">{error}</p>}
        </div>

        <aside className="static border border-line bg-paper-light px-[30px] py-[34px] md:sticky md:top-[100px]">
          <h3 className="mb-[22px] text-xl">Order summary</h3>
          <div className="mt-[18px] flex flex-col gap-[14px] border-t border-line pt-[18px]">
            {lines.map(({ line, product }) => (
              <div className="flex justify-between text-[13px] text-brown-soft" key={line.lineId}>
                <span>{product!.name} × {line.qty}</span>
                <span className="text-brown">EGP {product!.price * line.qty}</span>
              </div>
            ))}
          </div>

          <div className="my-[18px] flex gap-2">
            <input
              type="text"
              placeholder="Promo code"
              value={promoCodeInput}
              onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
              className="flex-1 border border-line bg-cream px-3 py-[11px] text-[13px] uppercase tracking-widest outline-none"
            />
            <button type="button" onClick={applyPromoCode} className="cursor-pointer border border-brown bg-transparent px-4 text-[11px] uppercase tracking-[.06em] text-brown">
              Apply
            </button>
          </div>
          {promoError && <p className="text-xs text-[#a14b3c]">{promoError}</p>}
          {appliedPromo && (
            <p className="text-xs text-brown-soft">{appliedPromo.code} applied — {appliedPromo.discount}% off</p>
          )}

          <div className="mt-4 flex justify-between border-b border-line py-[11px] text-[13.5px] text-brown-soft"><span>Subtotal</span><span className="text-brown">EGP {subtotal}</span></div>
          {promoDiscount > 0 && (
            <div className="flex justify-between border-b border-line py-[11px] text-[13.5px] text-brown-soft"><span>Promo discount</span><span className="text-brown">-EGP {promoDiscount}</span></div>
          )}
          {firstOrderDiscount > 0 && (
            <div className="flex justify-between border-b border-line py-[11px] text-[13.5px] text-brown-soft"><span>Welcome offer ({FIRST_ORDER_DISCOUNT_PCT}% off)</span><span className="text-brown">-EGP {firstOrderDiscount}</span></div>
          )}
          <div className="flex justify-between border-b border-line py-[11px] text-[13.5px] text-brown-soft">
            <span>Shipping{selectedCity ? ` (${selectedCity.city})` : ''}</span>
            <span className="text-brown">EGP {shipping}</span>
          </div>
          <div className="flex justify-between pt-[18px] text-base text-brown"><span>Total</span><span className="font-display text-xl">EGP {total}</span></div>

          <button
            type="submit"
            className="mt-[22px] flex w-full min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
            disabled={loading}
          >
            <Lock size={14} />
            {loading ? 'Processing…' : paymentMethod === 'cod' ? 'Place order' : 'Pay with Paymob'}
          </button>
          <p className="mt-3 text-center text-xs text-brown-soft">
            {paymentMethod === 'cod' ? "You'll pay when your order arrives." : "You'll be redirected to Paymob's secure payment page."}
          </p>
        </aside>
      </form>
    </main>
  );
}