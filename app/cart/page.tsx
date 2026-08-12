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
      <section className="mx-auto max-w-[640px] px-5 pb-10 pt-[65px] text-center md:px-[30px] md:pb-[55px] md:pt-[95px]">
        <p className="mb-[17px] block text-[10px] font-semibold uppercase tracking-[.22em] text-gold">Your bag</p>
        <h1 className="my-[18px] font-display text-[clamp(46px,5.6vw,76px)] font-medium leading-[.92] tracking-[-.045em]">Shopping Cart</h1>
      </section>

      {lines.length === 0 ? (
        <div className="px-[30px] py-[100px] text-center">
          <h2 className="font-display text-3xl font-medium">Your cart is empty</h2>
          <p className="my-[14px] mb-7 text-brown-soft">Nothing here yet — find a piece to carry with you.</p>
          <Link href="/shop" className="inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]">
            Explore the collection <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-start gap-10 px-5 py-[60px] md:grid-cols-[1.55fr_.95fr] md:gap-[60px] md:px-[30px] md:py-[90px]">
          <div>
            <div className="border-t border-line">
              {lines.map(({ line, product }) => (
                <div
                  key={line.id}
                  className="grid grid-cols-[70px_1fr] grid-rows-[auto_auto_auto] items-center gap-x-4 gap-y-[10px] border-b border-line py-[26px] md:grid-cols-[96px_1fr_auto_auto] md:grid-rows-1 md:gap-[22px]"
                >
                  <div className="relative row-span-3 flex h-[82px] w-[70px] flex-shrink-0 items-center justify-center border border-line bg-paper-light text-gold before:absolute before:h-[65%] before:w-[55%] before:rounded-[48%_48%_4%_4%] before:border before:border-gold/[.5] before:content-[''] md:row-span-1 md:h-[108px] md:w-[96px]">
                    <span className="relative z-10">✦</span>
                  </div>
                  <div>
                    <h3 className="mb-[6px] text-lg tracking-[-.01em]">{product!.name}</h3>
                    <p className="m-0 text-[11px] tracking-[.04em] text-brown-soft">{product!.tag}</p>
                    <button
                      onClick={() => removeLine(line.id)}
                      className="mt-[10px] cursor-pointer border-0 bg-transparent p-0 text-[11px] uppercase tracking-[.06em] text-brown-soft underline underline-offset-[3px] hover:text-brown"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center border border-line">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => updateQty(line.id, -1)}
                      className="flex h-[34px] w-8 cursor-pointer items-center justify-center border-0 bg-transparent text-sm text-brown hover:bg-paper-light"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-[30px] text-center text-[13px]">{line.qty}</span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => updateQty(line.id, 1)}
                      className="flex h-[34px] w-8 cursor-pointer items-center justify-center border-0 bg-transparent text-sm text-brown hover:bg-paper-light"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="min-w-[80px] text-right text-sm">EGP {product!.price * line.qty}</div>
                </div>
              ))}
            </div>
            <Link href="/shop" className="mt-[30px] inline-block text-xs uppercase tracking-[.08em] border-b border-gold pb-[5px]">
              Continue shopping <span className="ml-[7px]">→</span>
            </Link>
          </div>

          <aside className="static border border-line bg-paper-light px-[30px] py-[34px] md:sticky md:top-[100px]">
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
              <button className="cursor-pointer border border-brown bg-transparent px-4 text-[11px] uppercase tracking-[.06em] text-brown">Apply</button>
            </div>
            <div className="flex justify-between pt-[18px] text-base text-brown">
              <span>Total</span>
              <span className="font-display text-xl">EGP {total}</span>
            </div>
            <Link href="/checkout" className="mt-[22px] flex w-full min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]">
              Checkout <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}