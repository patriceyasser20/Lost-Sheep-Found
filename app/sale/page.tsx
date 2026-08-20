import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import VerseBlock from '../components/VerseBlock';
import { getProducts } from '../../lib/productsServer';
import { getSaleSettingsServer } from '../../lib/salePage';

export const metadata = {
  title: 'Sale — Lost Sheep Found',
};

export default async function SalePage() {
  const [products, saleSettings] = await Promise.all([getProducts(), getSaleSettingsServer()]);

  if (!saleSettings.active) {
    return (
      <main>
        <section className="mx-auto max-w-[640px] px-5 pb-10 pt-[65px] text-center md:px-[30px] md:pb-[55px] md:pt-[95px]">
          <p className="mb-[17px] block text-[10px] font-semibold uppercase tracking-[.22em] text-gold">Sale</p>
          <h1 className="my-[18px] font-display text-[clamp(46px,5.6vw,76px)] font-medium leading-[.92] tracking-[-.045em]">
            No sale right now
          </h1>
          <p className="mx-auto max-w-[460px] text-[15px] leading-[1.8] text-brown-soft">
            Check back soon — sales run regularly.
          </p>
        </section>
        <div className="mx-auto max-w-[1240px] px-[30px] pb-[110px]">
          <div className="px-[30px] py-[60px] text-center">
            <Link href="/shop" className="inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]">
              Shop everything <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const saleItems =
    saleSettings.categorySlugs.length > 0
      ? products.filter((p) => saleSettings.categorySlugs.includes(p.categorySlug))
      : products;

  return (
    <main>
      <section className="mx-auto max-w-[640px] px-5 pb-10 pt-[65px] text-center md:px-[30px] md:pb-[55px] md:pt-[95px]">
        <p className="mb-[17px] block text-[10px] font-semibold uppercase tracking-[.22em] text-gold">Advent sale</p>
        <h1 className="my-[18px] font-display text-[clamp(46px,5.6vw,76px)] font-medium leading-[.92] tracking-[-.045em]">
          {saleSettings.title}
        </h1>
        <p className="mx-auto max-w-[460px] text-[15px] leading-[1.8] text-brown-soft">
          {saleSettings.subtitle}
        </p>
      </section>

      <div className="mx-auto max-w-[1240px] px-[30px]">
        {saleItems.length === 0 ? (
          <div className="px-[30px] py-[100px] text-center">
            <h2 className="font-display text-3xl font-medium">Nothing on sale right now</h2>
            <p className="my-[14px] text-brown-soft">Check back soon — new pieces go on sale often.</p>
            <Link href="/shop" className="inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]">
              View everything <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
              {saleItems.map((product) => (
                <ProductCard product={product} key={product.id} hideOfferBadge />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="pb-[110px] py-20" >
          <VerseBlock verse="Freely you have received; freely give." reference="Matthew 10:8" />
      </div>
    </main>
  );
}