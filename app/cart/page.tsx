"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { products } from "../../lib/products";

type CartLine = { id: string; qty: number };

const initialCart: CartLine[] = [
  { id: "the-shepherd-journal", qty: 1 },
  { id: "grace-and-truth-bookmark", qty: 2 },
];

const SHIPPING = 90;

export default function CartPage() {
  const [cart, setCart] = useState<CartLine[]>(initialCart);
  const [promo, setPromo] = useState("");

  const lines = cart
    .map((line) => ({ line, product: products.find((p) => p.id === line.id) }))
    .filter((l) => l.product);

  const subtotal = lines.reduce((sum, l) => sum + l.product!.price * l.line.qty, 0);
  const shipping = lines.length > 0 ? SHIPPING : 0;
  const total = subtotal + shipping;

  function updateQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: Math.max(1, l.qty + delta) } : l))
        .filter((l) => l.qty > 0)
    );
  }

  function removeLine(id: string) {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <main>
      <section className="page-hero">
        <p className="eyebrow">Your bag</p>
        <h1>Shopping Cart</h1>
      </section>

      {lines.length === 0 ? (
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Nothing here yet — find a piece to carry with you.</p>
          <Link href="/shop" className="button button-dark">
            Explore the collection <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            <div className="cart-list">
              {lines.map(({ line, product }) => (
                <div className="cart-row" key={line.id}>
                  <div className="cart-thumb">
                    <span className="product-mark" style={{ zIndex: 1 }}>✦</span>
                  </div>
                  <div className="cart-item-info">
                    <h3>{product!.name}</h3>
                    <p>{product!.tag}</p>
                    <button onClick={() => removeLine(line.id)}>Remove</button>
                  </div>
                  <div className="qty-stepper">
                    <button aria-label="Decrease quantity" onClick={() => updateQty(line.id, -1)}>
                      <Minus size={13} />
                    </button>
                    <span>{line.qty}</span>
                    <button aria-label="Increase quantity" onClick={() => updateQty(line.id, 1)}>
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="cart-line-price">EGP {product!.price * line.qty}</div>
                </div>
              ))}
            </div>
            <Link href="/shop" className="text-link" style={{ display: "inline-block", marginTop: 30 }}>
              Continue shopping <span>→</span>
            </Link>
          </div>

          <aside className="order-summary">
            <h3>Order summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>EGP {subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>EGP {shipping}</span>
            </div>
            <div className="promo-row">
              <input
                type="text"
                placeholder="Promo code"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
              />
              <button>Apply</button>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>EGP {total}</span>
            </div>
            <Link href="/checkout" className="button button-dark button-block" style={{ marginTop: 22 }}>
              Checkout <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
