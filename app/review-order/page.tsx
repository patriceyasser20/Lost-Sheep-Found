'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { getProductsClient, type Product } from '../../lib/products';

const cart = [
  { id: 'the-shepherd-journal', qty: 1 },
  { id: 'grace-and-truth-bookmark', qty: 2 },
];

export default function ReviewOrderPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [promo, setPromo] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [discountPct, setDiscountPct] = useState(0);

  useEffect(() => {
    getProductsClient().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const lines = cart
    .map((line) => ({ line, product: products.find((p) => p.id === line.id) }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((sum, l) => sum + l.product!.price * l.line.qty, 0);
  const discount = Math.round(subtotal * (discountPct / 100));

  async function applyPromo() {
    const res = await fetch('/api/promo/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: promo }),
    });
    const data = await res.json();
    setPromoMessage(data.message);
    setDiscountPct(data.valid ? data.discount : 0);
  }

  if (loading) return <main className="mx-auto max-w-[700px] px-[30px] pt-[70px]">Loading…</main>;

  return (
    <main className="mx-auto max-w-[700px] px-[30px] pb-[120px] pt-[70px]">
      <p className="mb-[6px] text-[10px] uppercase tracking-[.16em] text-gold">Step 1 of 2</p>
      <h2 className="mt-[30px] mb-4 font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">Review your order</h2>

      <div className="border-t border-line">
        {lines.map(({ line, product }) => (
          <div className="grid grid-cols-[1fr_auto] items-center gap-[22px] border-b border-line py-[26px]" key={line.id}>
            <div>
              <h3 className="mb-[6px] text-lg tracking-[-.01em]">{product!.name} × {line.qty}</h3>
              <p className="m-0 text-[11px] tracking-[.04em] text-brown-soft">{product!.priceLabel}</p>
            </div>
            <div className="min-w-[80px] text-right text-sm">EGP {product!.price * line.qty}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <input
          type="text"
          placeholder="Promo code"
          value={promo}
          onChange={(e) => setPromo(e.target.value)}
          className="flex-1 border border-line bg-cream px-3 py-[11px] text-[13px] outline-none"
        />
        <button onClick={applyPromo} className="cursor-pointer border border-brown bg-transparent px-4 text-[11px] uppercase tracking-[.06em] text-brown">Apply</button>
      </div>
      {promoMessage && <p className="mt-1 text-xs text-brown-soft">{promoMessage}</p>}

      <div className="flex justify-between border-b border-line py-[11px] text-[13.5px] text-brown-soft"><span>Subtotal</span><span className="text-brown">EGP {subtotal}</span></div>
      {discount > 0 && <div className="flex justify-between border-b border-line py-[11px] text-[13.5px] text-brown-soft"><span>Discount</span><span className="text-brown">-EGP {discount}</span></div>}
      <div className="flex justify-between pt-[18px] text-base text-brown"><span>Total (before shipping)</span><span className="font-display text-xl">EGP {subtotal - discount}</span></div>

      <button
        className="mt-[22px] flex w-full min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]"
        onClick={() => router.push('/checkout')}
      >
        Continue to shipping <ArrowRight size={16} />
      </button>
      <Link href="/cart" className="mt-4 inline-block text-xs uppercase tracking-[.08em] border-b border-gold pb-[5px]">
        Back to cart <span className="ml-[7px]">→</span>
      </Link>
    </main>
  );
}