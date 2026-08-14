'use client';


import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { createPaymobPayment } from '../actions/paymob';
import { useEffect, useState } from 'react';
import { getProductsClient, type Product } from '../../lib/products';

const cart = [
  { id: 'the-shepherd-journal', qty: 1 },
  { id: 'grace-and-truth-bookmark', qty: 2 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [delivery, setDelivery] = useState('standard');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { getProductsClient().then(setProducts); }, []);

  const lines = cart
    .map((line) => ({ line, product: products.find((p) => p.id === line.id) }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((sum, l) => sum + l.product!.price * l.line.qty, 0);
  const shipping = delivery === 'express' ? 150 : 90;
  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.target as HTMLFormElement);
    const billing = {
      firstName: String(form.get('firstName')),
      lastName: String(form.get('lastName')),
      email: String(form.get('email')),
      phone: String(form.get('phone')),
      street: String(form.get('address')),
      city: String(form.get('city')),
    };

    try {
      const orderId = crypto.randomUUID();
      const { iframeUrl } = await createPaymobPayment(
        total,
        lines.map((l) => ({ id: l.product!.id, name: l.product!.name, price: l.product!.price, quantity: l.line.qty })),
        orderId,
        billing
      );
      window.location.href = iframeUrl;
    } catch (err: any) {
      setError(err.message ?? 'Payment could not be started.');
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
                <input id="firstName" name="firstName" type="text" required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
              </div>
              <div className="mb-[18px] flex flex-col gap-2">
                <label htmlFor="lastName" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Last name</label>
                <input id="lastName" name="lastName" type="text" required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
              </div>
              <div className="col-span-1 mb-[18px] flex flex-col gap-2 md:col-span-2">
                <label htmlFor="email" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Email</label>
                <input id="email" name="email" type="email" required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
              </div>
              <div className="col-span-1 mb-[18px] flex flex-col gap-2 md:col-span-2">
                <label htmlFor="address" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Address</label>
                <input id="address" name="address" type="text" required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
              </div>
              <div className="mb-[18px] flex flex-col gap-2">
                <label htmlFor="city" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">City</label>
                <input id="city" name="city" type="text" required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
              </div>
              <div className="mb-[18px] flex flex-col gap-2">
                <label htmlFor="phone" className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft">Phone</label>
                <input id="phone" name="phone" type="tel" required className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold" />
              </div>
            </div>
          </div>

          <div className="mb-[42px]">
            <h2 className="mb-5 flex items-center gap-[10px] text-xl tracking-[-.02em]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold text-[11px] font-sans text-gold">2</span>
              Delivery method
            </h2>
            <label className={`mb-[10px] flex cursor-pointer items-center gap-3 border px-[18px] py-4 text-[13.5px] ${delivery === 'standard' ? 'border-gold bg-paper-light' : 'border-line'}`}>
              <input type="radio" name="delivery" checked={delivery === 'standard'} onChange={() => setDelivery('standard')} className="accent-brown" />
              Standard delivery — 3 to 5 days
              <span className="ml-auto text-xs text-brown-soft">EGP 90</span>
            </label>
            <label className={`mb-[10px] flex cursor-pointer items-center gap-3 border px-[18px] py-4 text-[13.5px] ${delivery === 'express' ? 'border-gold bg-paper-light' : 'border-line'}`}>
              <input type="radio" name="delivery" checked={delivery === 'express'} onChange={() => setDelivery('express')} className="accent-brown" />
              Express delivery — 1 to 2 days
              <span className="ml-auto text-xs text-brown-soft">EGP 150</span>
            </label>
          </div>

          {error && <p className="mt-1 text-xs text-[#a14b3c]">{error}</p>}
        </div>

        <aside className="static border border-line bg-paper-light px-[30px] py-[34px] md:sticky md:top-[100px]">
          <h3 className="mb-[22px] text-xl">Order summary</h3>
          <div className="mt-[18px] flex flex-col gap-[14px] border-t border-line pt-[18px]">
            {lines.map(({ line, product }) => (
              <div className="flex justify-between text-[13px] text-brown-soft" key={line.id}>
                <span>{product!.name} × {line.qty}</span>
                <span className="text-brown">EGP {product!.price * line.qty}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-b border-line py-[11px] text-[13.5px] text-brown-soft"><span>Subtotal</span><span className="text-brown">EGP {subtotal}</span></div>
          <div className="flex justify-between border-b border-line py-[11px] text-[13.5px] text-brown-soft"><span>Shipping</span><span className="text-brown">EGP {shipping}</span></div>
          <div className="flex justify-between pt-[18px] text-base text-brown"><span>Total</span><span className="font-display text-xl">EGP {total}</span></div>
          <button
            type="submit"
            className="mt-[22px] flex w-full min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
            disabled={loading}
          >
            <Lock size={14} /> {loading ? 'Redirecting to payment…' : 'Pay with Paymob'}
          </button>
          <p className="mt-3 text-center text-xs text-brown-soft">
            You'll be redirected to Paymob's secure payment page.
          </p>
        </aside>
      </form>
    </main>
  );
}