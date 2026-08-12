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
      style={{
        position: 'fixed', inset: 0, background: 'rgba(76,60,46,.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--cream)', maxWidth: 720, width: '100%',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close quick view"
          style={{ position: 'absolute', top: 14, right: 14, border: 0, background: 'transparent', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
        <div className="product-placeholder" style={{ border: 0 }}>
          <span className="product-mark">✦</span>
          <span>{product.tag}</span>
        </div>
        <div style={{ padding: 34 }}>
          <p className="eyebrow">{product.tag}</p>
          <h3 style={{ fontSize: 26, margin: '0 0 10px' }}>{product.name}</h3>
          <p style={{ color: 'var(--brown-soft)', fontSize: 13.5, lineHeight: 1.7, marginBottom: 20 }}>
            {product.description}
          </p>
          <button className="button button-dark" style={{ marginBottom: 14 }}>
            Add to cart <ShoppingBag size={16} />
          </button>
          <div>
            <Link href={`/product/${product.id}`} className="text-link">View full details <span>→</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
