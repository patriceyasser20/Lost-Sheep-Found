'use client';

import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import type { Product } from '../../lib/products';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group">
      <Link href={`/product/${product.id}`}>
        <div className="relative flex aspect-[.88] flex-col items-center justify-center border border-line bg-paper-light text-gold before:absolute before:h-[67%] before:w-[58%] before:rounded-[48%_48%_4%_4%] before:border before:border-gold/[.55] before:content-['']">
          <span className="relative z-10 text-[27px]">✦</span>
          <span className="relative z-10 mt-[10px] text-[9px] tracking-[.15em] uppercase">{product.tag}</span>
        </div>
      </Link>
      <div className="flex items-center justify-between px-1 py-[17px]">
        <Link href={`/product/${product.id}`}>
          <h3 className="mb-1 font-display text-[22px] font-medium">{product.name}</h3>
          <p className="text-[11px] tracking-[.05em] text-brown-soft">{product.priceLabel}</p>
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