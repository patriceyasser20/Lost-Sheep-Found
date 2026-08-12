'use client';

import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import type { Product } from '../../lib/products';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <Link href={`/product/${product.id}`}>
        <div className="product-placeholder">
          <span className="product-mark">✦</span>
          <span>{product.tag}</span>
        </div>
      </Link>
      <div className="product-meta">
        <Link href={`/product/${product.id}`}>
          <h3>{product.name}</h3>
          <p>{product.priceLabel}</p>
        </Link>
        <div style={{ display: 'flex', gap: 10 }}>
          <button aria-label="Add to wishlist" style={{ border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--gold)' }}>
            <Heart size={16} strokeWidth={1.6} />
          </button>
          <ArrowRight size={17} />
        </div>
      </div>
    </div>
  );
}
