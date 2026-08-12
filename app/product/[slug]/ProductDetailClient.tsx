'use client';

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
  return (
    <main>
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/shop">Shop</Link>
        <span>/</span>
        <span className="current">{product.name}</span>
      </nav>

      <div className="product-detail">
        <div className="product-gallery">
          <span className="product-mark" style={{ fontSize: 40, zIndex: 1 }}>✦</span>
        </div>

        <div className="product-info-panel">
          <p className="eyebrow">{product.tag}</p>
          <h1>{product.name}</h1>
          <p className="product-price">{product.priceLabel}</p>
          <p className="product-desc">{product.description}</p>

          <blockquote className="product-verse">
            "{product.verse}"
            <span>{product.verseRef}</span>
          </blockquote>

          {product.customizable && (
            <div className="personalize-field">
              <label htmlFor="personalize">Add a name or verse (optional)</label>
              <input id="personalize" type="text" placeholder="e.g. Mariam, or Psalm 46:10" />
            </div>
          )}

          <div className="product-actions">
            <button className="button button-dark">
              Add to cart <ShoppingBag size={16} />
            </button>
            <button className="button button-line">
              Save <Heart size={16} />
            </button>
          </div>

          <div className="product-details-list">
            <h3>Details</h3>
            <ul>
              {product.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section featured">
          <div className="section-heading" style={{ padding: 0, marginBottom: 38 }}>
            <div>
              <p className="eyebrow">You might also like</p>
              <h2>More from this collection</h2>
            </div>
          </div>
          <div className="page-container" style={{ padding: 0 }}>
            <div className="product-grid">
              {related.map((item) => (
                <ProductCard product={item} key={item.id} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
