"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { products } from "../../lib/products";

const initialSaved = ["still-waters-journal", "be-still-wood-block", "faithful-tote"];

export default function WishlistPage() {
  const [saved, setSaved] = useState<string[]>(initialSaved);

  const items = products.filter((p) => saved.includes(p.id));

  function remove(id: string) {
    setSaved((prev) => prev.filter((s) => s !== id));
  }

  return (
    <main>
      <section className="mx-auto max-w-[640px] px-[30px] pt-[95px] pb-[55px] text-center">
        <p className="mb-[17px] text-[10px] font-semibold uppercase tracking-[.22em] text-gold">
          Kept for later
        </p>
        <h1 className="mt-[18px] mb-[22px] text-[clamp(46px,5.6vw,76px)] capitalize leading-[.92] tracking-[-.045em]">
          Your Wishlist
        </h1>
        <p className="mx-auto max-w-[460px] text-[15px] leading-[1.8] text-brown-soft">
          Pieces you've set aside — ready whenever you are.
        </p>
      </section>

      {items.length === 0 ? (
        <div className="px-[30px] py-[100px] text-center">
          <Heart size={30} className="mx-auto text-gold" strokeWidth={1.3} />
          <h2 className="mt-[18px] text-[clamp(30px,3.6vw,38px)] tracking-[-.03em]">Nothing saved yet</h2>
          <p className="my-[14px] mb-[28px] text-[14.5px] leading-[1.85] text-brown-soft">
            Tap the heart on any piece to keep it here.
          </p>
          <Link
            href="/shop"
            className="inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-[.25s] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]"
          >
            Explore the collection <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="mx-auto max-w-[1240px] px-5 pb-[110px] md:px-[30px]">
          <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
            {items.map((product) => (
              <div key={product.id}>
                <Link href={`/product/${product.id}`}>
                  <div className="relative flex aspect-[.88] flex-col items-center justify-center border border-line bg-paper-light text-gold">
                    <span className="text-[27px]">✦</span>
                    <span className="mt-[10px] text-[9px] uppercase tracking-[.15em]">{product.tag}</span>
                  </div>
                </Link>
                <div className="flex items-center justify-between px-1 py-[17px]">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="m-0 mb-1 text-[22px]">{product.name}</h3>
                    <p className="m-0 text-[11px] tracking-[.05em] text-brown-soft">{product.priceLabel}</p>
                  </Link>
                </div>
                <div className="mt-1 flex gap-[10px]">
                  <button className="flex flex-1 min-h-[46px] cursor-pointer items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-[.25s] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]">
                    Add to cart <ShoppingBag size={14} />
                  </button>
                  <button
                    className="inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-[10px] border border-brown bg-transparent px-5 text-[11px] uppercase tracking-[.08em] text-brown transition duration-[.25s] hover:bg-brown hover:text-cream"
                    aria-label="Remove from wishlist"
                    onClick={() => remove(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <section className="flex min-h-[520px] flex-col items-center justify-center bg-paper-light px-[30px] py-[110px] text-center">
        <div className="text-[20px] text-gold">✦</div>
        <blockquote className="mx-auto mt-[18px] mb-2 max-w-[850px] text-[clamp(34px,5vw,58px)] italic tracking-[-.04em]">
          "Delight thyself also in the Lord; and he shall give thee the desires of thine heart."
        </blockquote>
        <p className="m-0 text-[9px] uppercase tracking-[.2em] text-gold">Psalm 37:4</p>
      </section>
    </main>
  );
}
