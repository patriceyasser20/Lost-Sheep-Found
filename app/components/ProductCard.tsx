'use client';

import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import type { Product } from '../../lib/products';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <Link href={`/product/${product.slug}`}>
        <div className="relative flex aspect-[.88] flex-col items-center justify-center border border-line bg-paper-light text-gold">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <div className="absolute h-[67%] w-[58%] border border-gold/[.55] [border-radius:48%_48%_4%_4%]" />
              <span className="relative z-[1] text-[27px]">✦</span>
              <span className="relative z-[1] mt-[10px] text-[9px] uppercase tracking-[.15em]">
                {product.categoryName}
              </span>
            </>
          )}
        </div>
      </Link>
      <div className="flex items-center justify-between px-1 py-[17px]">
        <Link href={`/product/${product.slug}`}>
          <h3 className="m-0 mb-1 text-[22px]">{product.name}</h3>
          <p className="m-0 text-[11px] tracking-[.05em] text-brown-soft">{product.priceLabel}</p>
        </Link>
        <div className="flex gap-[10px]">
          <button aria-label="Add to wishlist" className="cursor-pointer border-0 bg-transparent text-gold">
            <Heart size={16} strokeWidth={1.6} />
          </button>
          <ArrowRight size={17} />
        </div>
      </div>
    </div>
  );
}