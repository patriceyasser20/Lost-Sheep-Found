'use client';

import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import type { Product } from '../../lib/products';

export default function QuickViewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  if (!product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-brown/[.45] p-5"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative grid w-full max-w-[720px] grid-cols-1 gap-0 bg-cream md:grid-cols-2"
      >
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-[14px] top-[14px] cursor-pointer border-0 bg-transparent"
        >
          <X size={20} />
        </button>
        <div className="relative flex aspect-[.88] flex-col items-center justify-center border-0 bg-paper-light text-gold before:absolute before:h-[67%] before:w-[58%] before:rounded-[48%_48%_4%_4%] before:border before:border-gold/[.55] before:content-['']">
          <span className="relative z-10 text-[27px]">✦</span>
          <span className="relative z-10 mt-[10px] text-[9px] tracking-[.15em] uppercase">{product.tag}</span>
        </div>
        <div className="p-[34px]">
          <p className="mb-[17px] text-[10px] tracking-[.22em] uppercase text-gold font-semibold">{product.tag}</p>
          <h3 className="m-0 mb-[10px] text-[26px] font-display">{product.name}</h3>
          <p className="mb-5 text-[13.5px] leading-[1.7] text-brown-soft">
            {product.description}
          </p>
          <button className="mb-[14px] inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]">
            Add to cart <ShoppingBag size={16} />
          </button>
          <div>
            <Link href={`/product/${product.id}`} className="text-xs tracking-[.08em] uppercase border-b border-gold pb-[5px]">
              View full details <span className="ml-[7px]">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}