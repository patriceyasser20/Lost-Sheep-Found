'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { products } from '../../lib/products';

const cart = [
  { id: 'the-shepherd-journal', qty: 1 },
  { id: 'grace-and-truth-bookmark', qty: 2 },
];

export default function ReviewOrderPage() {
  const router = useRouter();
  const [promo, setPromo] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [discountPct, setDiscountPct] = useState(0);

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

  return (
    <main className="content-page" style={{ maxWidth: 700 }}>
      <p className="eyebrow">Step 1 of 2</p>
      <h2>Review your order</h2>

      <div className="cart-list">
        {lines.map(({ line, product }) => (
          <div className="cart-row" key={line.id} style={{ gridTemplateColumns: '1fr auto' }}>
            <div className="cart-item-info">
              <h3>{product!.name} × {line.qty}</h3>
              <p>{product!.tag}</p>
            </div>
            <div className="cart-line-price">EGP {product!.price * line.qty}</div>
          </div>
        ))}
      </div>

      <div className="promo-row" style={{ marginTop: 24 }}>
        <input type="text" placeholder="Promo code" value={promo} onChange={(e) => setPromo(e.target.value)} />
        <button onClick={applyPromo}>Apply</button>
      </div>
      {promoMessage && <p className="form-note">{promoMessage}</p>}

      <div className="summary-row"><span>Subtotal</span><span>EGP {subtotal}</span></div>
      {discount > 0 && <div className="summary-row"><span>Discount</span><span>-EGP {discount}</span></div>}
      <div className="summary-row total"><span>Total (before shipping)</span><span>EGP {subtotal - discount}</span></div>

      <button
        className="button button-dark button-block"
        style={{ marginTop: 22 }}
        onClick={() => router.push('/checkout')}
      >
        Continue to shipping <ArrowRight size={16} />
      </button>
      <Link href="/cart" className="text-link" style={{ display: 'inline-block', marginTop: 16 }}>
        Back to cart <span>→</span>
      </Link>
    </main>
  );
}
