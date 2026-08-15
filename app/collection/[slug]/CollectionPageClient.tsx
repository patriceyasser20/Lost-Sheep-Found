'use client';

import ProductCard from '../../components/ProductCard';
import VerseBlock from '../../components/VerseBlock';
import type { Product } from '../../../lib/products';

export default function CollectionPageClient({
  name,
  products,
}: {
  name: string;
  products: Product[];
}) {
  return (
    <main>
      <section className="mx-auto max-w-[640px] px-5 pb-10 pt-[65px] text-center md:px-[30px] md:pb-[55px] md:pt-[95px]">
        <p className="mb-[17px] block text-[10px] font-semibold uppercase tracking-[.22em] text-gold">Collection</p>
        <h1 className="my-[18px] font-display text-[clamp(46px,5.6vw,76px)] font-medium capitalize leading-[.92] tracking-[-.045em]">{name}</h1>
      </section>

      <div className="mx-auto max-w-[1240px] px-[30px]">
        <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
          {products.map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>

        <div className="pb-[110px]">
          <VerseBlock
            verse="Whatever is true, whatever is noble, whatever is right, whatever is lovely — think about such things."
            reference="Philippians 4:8"
          />
        </div>
      </div>
    </main>
  );
}