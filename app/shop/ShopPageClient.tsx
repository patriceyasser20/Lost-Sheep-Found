'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import VerseBlock from '../components/VerseBlock';
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
    if (activeCategory && p.categorySlug !== activeCategory) return false;
    if (customizableOnly && !p.customizable) return false;
    return true;
  });

  return (
    <main>
      <section className="mx-auto max-w-[640px] px-5 pb-10 pt-[65px] text-center md:px-[30px] md:pb-[55px] md:pt-[95px]">
        <p className="mb-[17px] block text-[10px] font-semibold uppercase tracking-[.22em] text-gold">The full collection</p>
        <h1 className="my-[18px] font-display text-[clamp(46px,5.6vw,76px)] font-medium capitalize leading-[.92] tracking-[-.045em]">
          {customizableOnly ? 'Personalized pieces' : 'Shop everything'}
        </h1>
        <p className="mx-auto max-w-[460px] text-[15px] leading-[1.8] text-brown-soft">
          Journals, wooden verses, and keepsakes — every piece made to hold a little Scripture close.
        </p>
      </section>

      <nav className="mb-10 flex flex-wrap items-center justify-center gap-[18px] border-b border-line px-[30px] pb-[35px] md:mb-[55px] md:gap-[30px] md:pb-[45px]" aria-label="Filter by category">
        {categories.map((cat) => (
          <Link
            key={cat.value}
            href={cat.value ? `/shop?category=${cat.value}` : '/shop'}
            className={`border-b pb-[9px] text-[11px] uppercase tracking-[.12em] text-brown-soft transition duration-200 hover:text-brown ${
              activeCategory === cat.value && !customizableOnly ? 'border-gold text-brown' : 'border-transparent'
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </nav>

      <div className="mx-auto max-w-[1240px] px-[30px]">
        {list.length === 0 ? (
          <div className="px-[30px] py-[100px] text-center">
            <h2 className="font-display text-3xl font-medium">Nothing here yet</h2>
            <p className="my-[14px] mb-7 text-brown-soft">Try a different collection.</p>
            <Link href="/shop" className="inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]">
              View everything <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
              {list.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
            <div className="pb-[110px]">
              <VerseBlock
                verse="But seek first the kingdom of God and his righteousness, and all these things will be added to you."
                reference="Matthew 6:33 "
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}