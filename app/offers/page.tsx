'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import VerseBlock from '../components/VerseBlock';
import { getProductsClient, type Product } from '../../lib/products';
import { getActiveOffersClient, findOfferForProduct, offerBadgeText, type Offer } from '../../lib/offers';

export default function OffersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProductsClient(), getActiveOffersClient()]).then(([p, o]) => {
      setProducts(p);
      setOffers(o.filter((offer) => offer.offerType === 'buy_x_get_y_free'));
      setLoading(false);
    });
  }, []);

  // Group matching products under whichever offer they qualify for, so a
  // product only shows once even if (in theory) more than one offer could
  // apply — first match wins, same rule findOfferForProduct already uses.
  const groups = offers
    .map((offer) => ({
      offer,
      items: products.filter((p) => findOfferForProduct(p, offers)?.id === offer.id),
    }))
    .filter((g) => g.items.length > 0);

  if (loading) {
    return (
      <main className="mx-auto max-w-[640px] px-[30px] pb-14 pt-[95px] text-center">
        <p className="text-[15px] text-brown-soft">Loading offers…</p>
      </main>
    );
  }

  return (
    <main>
      <section className="mx-auto max-w-[640px] px-5 pb-10 pt-[65px] text-center md:px-[30px] md:pb-[55px] md:pt-[95px]">
        <p className="mb-[17px] block text-[10px] font-semibold uppercase tracking-[.22em] text-gold">Right now</p>
        <h1 className="my-[18px] font-display text-[clamp(46px,5.6vw,76px)] font-medium leading-[.92] tracking-[-.045em]">Offers</h1>
        <p className="mx-auto max-w-[460px] text-[15px] leading-[1.8] text-brown-soft">
          A few pieces with something extra attached — for a limited time.
        </p>
      </section>

      {groups.length === 0 ? (
        <div className="px-[30px] pb-[110px] text-center">
          <h2 className="font-display text-3xl font-medium">No offers running right now</h2>
          <p className="my-4 text-[14px] text-brown-soft">Check back soon, or browse the full collection.</p>
          <Link
            href="/shop"
            className="inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]"
          >
            Shop everything <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="mx-auto max-w-[1240px] px-[30px] pb-[110px]">
          {groups.map(({ offer, items }) => (
            <div key={offer.id} className="mb-[70px] last:mb-0">
              <div className="mb-[22px] border-b border-line pb-[18px]">
                <p className="mb-1 text-[10px] uppercase tracking-[.16em] text-gold">{offerBadgeText(offer)}</p>
                <h2 className="font-display text-2xl font-medium tracking-[-.02em]">{offer.title}</h2>
              </div>
              <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
                {items.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <VerseBlock
        verse="Give, and it will be given to you. Good measure, pressed down, shaken together, running over, will be put into your lap."
        reference="Luke 6:38"
      />
    </main>
  );
}