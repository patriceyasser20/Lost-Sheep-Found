'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { createPaymobPayment } from '../actions/paymob';
import { products } from '../../lib/products';

const cart = [
  { id: 'the-shepherd-journal', qty: 1 },
  { id: 'grace-and-truth-bookmark', qty: 2 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [delivery, setDelivery] = useState('standard');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      <section className="page-hero">
        <p className="eyebrow">Step 2 of 2</p>
        <h1>Checkout</h1>
      </section>

      <form className="checkout-layout" onSubmit={handleSubmit}>
        <div>
          <div className="checkout-section">
            <h2><span className="checkout-step-number">1</span> Contact & shipping</h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="firstName">First name</label>
                <input id="firstName" name="firstName" type="text" required />
              </div>
              <div className="form-field">
                <label htmlFor="lastName">Last name</label>
                <input id="lastName" name="lastName" type="text" required />
              </div>
              <div className="form-field full">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div className="form-field full">
                <label htmlFor="address">Address</label>
                <input id="address" name="address" type="text" required />
              </div>
              <div className="form-field">
                <label htmlFor="city">City</label>
                <input id="city" name="city" type="text" required />
              </div>
              <div className="form-field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" required />
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h2><span className="checkout-step-number">2</span> Delivery method</h2>
            <label className="radio-option">
              <input type="radio" name="delivery" checked={delivery === 'standard'} onChange={() => setDelivery('standard')} />
              Standard delivery — 3 to 5 days
              <span className="radio-price">EGP 90</span>
            </label>
            <label className="radio-option">
              <input type="radio" name="delivery" checked={delivery === 'express'} onChange={() => setDelivery('express')} />
              Express delivery — 1 to 2 days
              <span className="radio-price">EGP 150</span>
            </label>
          </div>

          {error && <p className="form-note" style={{ color: '#a14b3c' }}>{error}</p>}
        </div>

        <aside className="order-summary">
          <h3>Order summary</h3>
          <div className="checkout-summary-items">
            {lines.map(({ line, product }) => (
              <div className="checkout-summary-item" key={line.id}>
                <span>{product!.name} × {line.qty}</span>
                <span>EGP {product!.price * line.qty}</span>
              </div>
            ))}
          </div>
          <div className="summary-row" style={{ marginTop: 16 }}><span>Subtotal</span><span>EGP {subtotal}</span></div>
          <div className="summary-row"><span>Shipping</span><span>EGP {shipping}</span></div>
          <div className="summary-row total"><span>Total</span><span>EGP {total}</span></div>
          <button type="submit" className="button button-dark button-block" style={{ marginTop: 22 }} disabled={loading}>
            <Lock size={14} /> {loading ? 'Redirecting to payment…' : 'Pay with Paymob'}
          </button>
          <p className="form-note" style={{ textAlign: 'center', marginTop: 12 }}>
            You'll be redirected to Paymob's secure payment page.
          </p>
        </aside>
      </form>
    </main>
  );
}
