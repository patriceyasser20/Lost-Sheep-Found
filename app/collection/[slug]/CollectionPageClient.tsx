'use client';

import ProductCard from '../../components/ProductCard';
import type { Product } from '../../../lib/products';

export default function CollectionPageClient({
  name,
  products,
}: {
  name: string;
  products: Product[];
}) {
  return (
    <main className="shop-page">
      <section className="page-hero">
        <p className="eyebrow">Collection</p>
        <h1>{name}</h1>
      </section>

      <div className="page-container">
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>
      </div>
    </main>
  );
}
