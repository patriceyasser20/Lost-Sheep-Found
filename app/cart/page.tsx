'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import { getProductsClient, type Product } from '../../lib/products';
import { getCart, setCart as persistCart, type CartLine } from '../../lib/localCart';
import VerseBlock from '../components/VerseBlock';

const SHIPPING = 90;

export default function CartPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [promo, setPromo] = useState('');

  useEffect(() => {
    setCart(getCart());
    getProductsClient().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const lines = cart
    .map((line) => ({ line, product: products.find((p) => p.id === line.id) }))
    .filter((l) => l.product);

  const subtotal = lines.reduce((sum, l) => sum + l.product!.price * l.line.qty, 0);
  const shipping = lines.length > 0 ? SHIPPING : 0;
  const total = subtotal + shipping;

  function updateQty(lineId: string, delta: number) {
    setCart((prev) => {
      const next = prev
        .map((l) => (l.lineId === lineId ? { ...l, qty: Math.max(1, l.qty + delta) } : l))
        .filter((l) => l.qty > 0);
      persistCart(next);
      return next;
    });
  }

  function removeLine(lineId: string) {
    setCart((prev) => {
      const next = prev.filter((l) => l.lineId !== lineId);
      persistCart(next);
      return next;
    });
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-[640px] px-[30px] pb-14 pt-[95px] text-center">
        <p className="text-[15px] text-brown-soft">Loading your cart…</p>
      </main>
    );
  }

  return (
    <main>
      <section className="mx-auto max-w-[640px] px-[30px] pb-[55px] pt-[95px] text-center">
        <p className="mb-[18px] text-[10px] uppercase tracking-[.22em] text-gold">Your bag</p>
        <h1 className="font-display text-[clamp(46px,5.6vw,76px)] font-medium leading-[.92] tracking-[-.045em]">
          Shopping Cart
        </h1>
      </section>

      {lines.length === 0 ? (
        <div className="px-[30px] pb-[110px] text-center">
          <h2 className="font-display text-3xl font-medium">Your cart is empty</h2>
          <p className="my-4 text-[14px] text-brown-soft">Nothing here yet — find a piece to carry with you.</p>
          <Link
            href="/shop"
            className="inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]"
          >
            Explore the collection <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-start gap-[60px] px-[30px] pb-[130px] md:grid-cols-[1.55fr_.95fr]">
          <div>
            <div className="border-t border-line">
              {lines.map(({ line, product }) => {
                const selectionEntries = line.selections ? Object.values(line.selections) : [];
                return (
                  <div key={line.lineId} className="grid grid-cols-[96px_1fr_auto_auto] items-center gap-[22px] border-b border-line py-[26px]">
                    <div className="flex h-[108px] w-24 flex-shrink-0 items-center justify-center border border-line bg-paper-light text-gold">
                      <span className="text-2xl">✦</span>
                    </div>
                    <div>
                      <h3 className="mb-[6px] text-lg tracking-[-.01em]">{product!.name}</h3>
                      {selectionEntries.length > 0 ? (
                        <p className="m-0 text-[11px] tracking-[.04em] text-brown-soft">
                          {selectionEntries.map((s: any) => `${s.optionName}: ${s.value}`).join(' · ')}
                        </p>
                      ) : (
                        <p className="m-0 text-[11px] tracking-[.04em] text-brown-soft">{product!.tag}</p>
                      )}
                      <button
                        onClick={() => removeLine(line.lineId)}
                        className="mt-2.5 border-0 bg-transparent p-0 text-[11px] uppercase tracking-[.06em] text-brown-soft underline underline-offset-[3px] hover:text-brown"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center border border-line">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => updateQty(line.lineId, -1)}
                        className="flex h-[34px] w-8 items-center justify-center border-0 bg-transparent text-brown hover:bg-paper-light"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-[30px] text-center text-[13px]">{line.qty}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => updateQty(line.lineId, 1)}
                        className="flex h-[34px] w-8 items-center justify-center border-0 bg-transparent text-brown hover:bg-paper-light"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="min-w-[80px] text-right text-sm">EGP {product!.price * line.qty}</div>
                  </div>
                );
              })}
            </div>
            <Link
              href="/shop"
              className="mt-[30px] inline-block border-b border-gold pb-[5px] text-xs uppercase tracking-[.08em]"
            >
              Continue shopping <span className="ml-[7px]">→</span>
            </Link>
          </div>

          <aside className="border border-line bg-paper-light p-[30px]">
            <h3 className="mb-[22px] text-xl">Order summary</h3>

            <div className="flex justify-between border-b border-line py-[11px] text-[13.5px] text-brown-soft">
              <span>Subtotal</span>
              <span className="text-brown">EGP {subtotal}</span>
            </div>
            <div className="flex justify-between border-b border-line py-[11px] text-[13.5px] text-brown-soft">
              <span>Shipping</span>
              <span className="text-brown">EGP {shipping}</span>
            </div>

            <div className="my-[18px] flex gap-2">
              <input
                type="text"
                placeholder="Promo code"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                className="flex-1 border border-line bg-cream px-3 py-[11px] text-[13px] outline-none"
              />
              <button className="cursor-pointer border border-brown bg-transparent px-4 text-[11px] uppercase tracking-[.06em] text-brown">
                Apply
              </button>
            </div>

            <div className="flex justify-between pt-[18px] text-base text-brown">
              <span>Total</span>
              <span className="font-display text-xl">EGP {total}</span>
            </div>

            <Link
              href="/checkout"
              className="mt-[22px] flex min-h-[46px] w-full items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]"
            >
              Checkout <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      )}
      <VerseBlock
        verse="Whenever I am afraid, I will trust in You."
        reference="Psalms 56:3"
      />
    </main>
  );
}