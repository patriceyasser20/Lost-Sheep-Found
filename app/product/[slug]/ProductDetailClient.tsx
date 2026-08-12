'use client';
import { useState } from 'react';
import ProductCustomizer, { type Selections } from '../../components/ProductCustomizer';
import Link from 'next/link';
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import type { Product } from '../../../lib/products';

export default function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [customSelections, setCustomSelections] = useState<Selections>({});
  const [customComplete, setCustomComplete] = useState(!product.customizable);

  const addDisabled = product.customizable && !customComplete;

  function handleAddToCart() {
    if (addDisabled) return;
    // TODO: once cart state is lifted out of local mock arrays, pass
    // customSelections through as line-item metadata, e.g.:
    //   addToCart({ id: product.id, qty: 1, customization: customSelections })
    console.log('Add to cart', { productId: product.id, customSelections });
  }

  return (
    <main>
      <nav className="mx-auto flex max-w-[1240px] items-center gap-2 px-[30px] pt-7 text-[11px] uppercase tracking-[.06em] text-brown-soft">
        <Link href="/" className="hover:text-brown">Home</Link>
        <span className="text-gold">/</span>
        <Link href="/shop" className="hover:text-brown">Shop</Link>
        <span className="text-gold">/</span>
        <span className="text-brown">{product.name}</span>
      </nav>

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-start gap-[34px] px-5 pb-20 pt-5 md:grid-cols-2 md:gap-[70px] md:px-[30px] md:pb-[110px] md:pt-[30px]">
        <div className="sticky top-[110px] flex aspect-[.9] items-center justify-center border border-line bg-paper-light text-gold">
          <span className="relative z-10 text-[40px]">✦</span>
        </div>

        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.22em] text-gold">{product.tag}</p>
          <h1 className="mb-[14px] font-display text-[clamp(34px,4vw,48px)] font-medium leading-none tracking-[-.035em]">{product.name}</h1>
          <p className="mb-[26px] font-display text-[22px] text-brown-soft">{product.priceLabel}</p>
          <p className="mb-[30px] max-w-[460px] text-[14.5px] leading-[1.85] text-brown-soft">{product.description}</p>

          <blockquote className="mb-[34px] border-l-2 border-gold pl-[18px] font-display text-[17px] italic">
            "{product.verse}"
            <span className="mt-[6px] block font-sans text-[9px] not-italic uppercase tracking-[.16em] text-gold">{product.verseRef}</span>
          </blockquote>

          {product.customizable && (
            <ProductCustomizer
              productId={product.id}
              productName={product.name}
              onChange={(selections, complete) => {
                setCustomSelections(selections);
                setCustomComplete(complete);
              }}
            />
          )}

          <div className="mb-9 flex gap-[14px]">
            <button
              onClick={handleAddToCart}
              disabled={addDisabled}
              className="inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              Add to cart <ShoppingBag size={16} />
            </button>
            <button className="inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-brown bg-transparent px-5 text-[11px] uppercase tracking-[.08em] text-brown transition duration-200 hover:bg-brown hover:text-cream">
              Save <Heart size={16} />
            </button>
          </div>

          {product.customizable && addDisabled && (
            <p className="-mt-6 mb-9 text-[12px] text-brown-soft">
              Choose the required options above before adding this piece to your cart.
            </p>
          )}

          <div className="border-t border-line pt-6">
            <h3 className="mb-[14px] text-[11px] font-semibold uppercase tracking-[.12em] text-brown-soft">Details</h3>
            <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
              {product.details.map((detail) => (
                <li key={detail} className="relative pl-4 text-[13.5px] text-brown-soft before:absolute before:left-0 before:top-1 before:text-[9px] before:text-gold before:content-['✦']">
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1240px] px-5 py-[65px] md:px-[30px] md:py-[90px]">
          <div className="mb-[38px]">
            <p className="mb-[10px] text-[10px] font-semibold uppercase tracking-[.22em] text-gold">You might also like</p>
            <h2 className="m-0 font-display text-[clamp(43px,5vw,62px)] font-medium leading-[.95] tracking-[-.045em]">More from this collection</h2>
          </div>
          <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
            {related.map((item) => (
              <ProductCard product={item} key={item.id} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}