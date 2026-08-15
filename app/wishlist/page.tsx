'use client';
import VerseBlock from '../components/VerseBlock';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { getProductsClient, type Product } from '../../lib/products';
import { getWishlist, setWishlist as persistWishlist } from '../../lib/localCart';

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    setSaved(getWishlist());
    getProductsClient().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const items = products.filter((p) => saved.includes(p.id));

  function remove(id: string) {
    setSaved((prev) => {
      const next = prev.filter((s) => s !== id);
      persistWishlist(next);
      return next;
    });
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-[640px] px-[30px] pb-14 pt-[95px] text-center">
        <p className="text-[15px] text-brown-soft">Loading your wishlist…</p>
      </main>
    );
  }

  return (
    <main>
      <section className="mx-auto max-w-[640px] px-[30px] pb-[55px] pt-[95px] text-center">
        <p className="mb-[18px] text-[10px] uppercase tracking-[.22em] text-gold">Kept for later</p>
        <h1 className="font-display text-[clamp(46px,5.6vw,76px)] font-medium leading-[.92] tracking-[-.045em]">
          Your Wishlist
        </h1>
        <p className="mx-auto mt-[22px] max-w-[460px] text-[15px] leading-[1.8] text-brown-soft">
          Pieces you've set aside — ready whenever you are.
        </p>
      </section>

      {items.length === 0 ? (
        <div className="px-[30px] pb-[110px] text-center">
          <Heart size={30} className="mx-auto text-gold" strokeWidth={1.3} />
          <h2 className="mt-[18px] font-display text-3xl font-medium">Nothing saved yet</h2>
          <p className="my-4 text-[14px] text-brown-soft">Tap the heart on any piece to keep it here.</p>
          <Link
            href="/shop"
            className="inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]"
          >
            Explore the collection <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="mx-auto max-w-[1240px] px-[30px] pb-[110px]">
          <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
            {items.map((product) => (
              <div key={product.id} className="border border-line">
                <Link href={`/product/${product.slug}`}>
                  <div className="relative flex aspect-[.88] items-center justify-center border-b border-line bg-paper-light text-gold">
                    <span className="text-[27px]">✦</span>
                    <span className="absolute bottom-[10px] text-[9px] uppercase tracking-[.15em]">{product.tag}</span>
                  </div>
                </Link>
                <div className="p-[17px_14px]">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="mb-1 text-lg">{product.name}</h3>
                    <p className="mb-3 text-[11px] tracking-[.05em] text-brown-soft">{product.priceLabel}</p>
                  </Link>
                  <div className="flex gap-2.5">
                    <button className="flex flex-1 min-h-[40px] items-center justify-center gap-2 border border-transparent bg-brown px-4 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]">
                      Add to cart <ShoppingBag size={14} />
                    </button>
                    <button
                      aria-label="Remove from wishlist"
                      onClick={() => remove(product.id)}
                      className="min-h-[40px] border border-brown bg-transparent px-4 text-[11px] uppercase tracking-[.08em] text-brown transition duration-200 hover:bg-brown hover:text-cream"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <VerseBlock
            verse="For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life."
            reference="John 3:16"
          />
        </div>
      )}
    </main>
  );
}