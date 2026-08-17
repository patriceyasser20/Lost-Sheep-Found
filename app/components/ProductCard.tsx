'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useCurrency } from '../context/CurrencyContext';
import { getActiveOffersClient, findOfferForProduct, offerBadgeText, type Offer } from '../../lib/offers';
import { getWishlist, addToWishlist, removeFromWishlist } from '../../lib/localCart';
import type { Product } from '../../lib/products';

type ProductWithSale = Product & {
  isOnSale?: boolean;
  discountPercentage?: number;
  hasVariantSale?: boolean;
  maxVariantDiscount?: number;
};

export default function ProductCard({ product }: { product: ProductWithSale }) {
  const { format } = useCurrency();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(getWishlist().includes(product.id));

    function sync() {
      setActive(getWishlist().includes(product.id));
    }
    window.addEventListener('wishlist-updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('wishlist-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, [product.id]);

  function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (active) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
    setActive(!active);
  }

  const [offers, setOffers] = useState<Offer[]>([]);
  useEffect(() => {
    let mounted = true;
    getActiveOffersClient().then((data) => { if (mounted) setOffers(data); });
    return () => { mounted = false; };
  }, []);

  const activeOffer = findOfferForProduct(product, offers);
  const discount = product.discountPercentage || 0;
  const salePrice = product.isOnSale ? product.price * (1 - discount / 100) : product.price;
  const hasSaleBadge = (product.isOnSale && discount > 0) || (!product.isOnSale && product.hasVariantSale && (product.maxVariantDiscount || 0) > 0);

  return (
    <Link href={`/product/${product.slug}`} className="group block border border-line bg-cream">
      <div className="relative aspect-square overflow-hidden border-b border-line bg-paper-light">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gold">
            <span className="text-2xl">✦</span>
            <span className="text-[9px] uppercase tracking-[.15em] text-brown-soft">{product.tag}</span>
          </div>
        )}

        {product.isOnSale && discount > 0 && (
          <div className="absolute left-3 top-3 z-10 bg-[#a14b3c] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[.06em] text-cream">
            -{discount}%
          </div>
        )}
        {!product.isOnSale && product.hasVariantSale && (product.maxVariantDiscount || 0) > 0 && (
          <div className="absolute left-3 top-3 z-10 bg-gold px-2.5 py-1 text-[10px] font-medium uppercase tracking-[.06em] text-cream">
            Up to -{product.maxVariantDiscount}%
          </div>
        )}
        {activeOffer && (
          <div
            className="absolute left-3 z-10 bg-brown px-2.5 py-1 text-[10px] font-medium uppercase tracking-[.06em] text-cream"
            style={{ top: hasSaleBadge ? '2.75rem' : '0.75rem' }}
          >
            {offerBadgeText(activeOffer)}
          </div>
        )}

        <button
          aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={toggleWishlist}
          className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full shadow transition hover:scale-110 ${
            active ? 'bg-gold text-cream' : 'bg-cream/90 text-gold'
          }`}
        >
          <Heart size={16} strokeWidth={1.6} fill={active ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="truncate font-display text-lg font-medium tracking-[-.01em] text-brown">
          {product.name}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          {product.isOnSale && discount > 0 ? (
            <>
              <span className="text-[13px] text-brown-soft line-through">{format(product.price)}</span>
              <span className="text-lg font-medium text-[#a14b3c]">{format(salePrice)}</span>
            </>
          ) : (
            <span className="text-[13px] text-brown-soft">{product.priceLabel}</span>
          )}
        </div>
      </div>
    </Link>
  );
}