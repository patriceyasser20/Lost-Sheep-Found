'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import type { Product } from '../../lib/products';

const categories = [
  { label: 'All Pieces', value: '' },
  { label: 'Bible Journals', value: 'bible-journals' },
  { label: 'Wooden Verses', value: 'wood-blocks' },
  { label: 'Keepsakes', value: 'keepsakes' },
];

export default function ShopPageClient({ initialProducts }: { initialProducts: Product[] }) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') ?? '';
  const customizableOnly = searchParams.get('customizable') === 'true';

  const list = initialProducts.filter((p) => {
    if (activeCategory && p.category !== activeCategory) return false;
    if (customizableOnly && !p.customizable) return false;
    return true;
  });

  return (
    <main className="shop-page">
      <section className="page-hero">
        <p className="eyebrow">The full collection</p>
        <h1>{customizableOnly ? 'Personalized pieces' : 'Shop everything'}</h1>
        <p>Journals, wooden verses, and keepsakes — every piece made to hold a little Scripture close.</p>
      </section>

      <nav className="category-filter" aria-label="Filter by category">
        {categories.map((cat) => (
          <Link
            key={cat.value}
            href={cat.value ? `/shop?category=${cat.value}` : '/shop'}
            className={activeCategory === cat.value && !customizableOnly ? 'active' : ''}
          >
            {cat.label}
          </Link>
        ))}
      </nav>

      <div className="page-container">
        {list.length === 0 ? (
          <div className="cart-empty">
            <h2>Nothing here yet</h2>
            <p>Try a different collection.</p>
            <Link href="/shop" className="button button-dark">
              View everything <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {list.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
