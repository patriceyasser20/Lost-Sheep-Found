'use client';
import { useEffect, useMemo, useState } from 'react';
import ProductCustomizer, { type Selections } from '../../components/ProductCustomizer';
import Link from 'next/link';
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import VerseBlock from '../../components/VerseBlock';
import type { Product } from '../../../lib/products';
import { mergeChildSkus } from '../../../lib/sku';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { getWishlist, setWishlist as persistWishlist } from '../../../lib/localCart';
import { getEffectivePrice } from '../../../lib/pricing';
import { getActiveSaleClient, type SaleSettings } from '../../../lib/sale';

export default function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { addToCart } = useCart();
  const [customSelections, setCustomSelections] = useState<Selections>({});
  const [customComplete, setCustomComplete] = useState(!product.customizable);
  const [saved, setSaved] = useState(false);
  const [sale, setSale] = useState<SaleSettings | null>(null);
  useEffect(() => {
    getActiveSaleClient().then(setSale);
  }, []);

  useEffect(() => {
    setSaved(getWishlist().includes(product.id));
  }, [product.id]);

  const gallery = product.images.length > 0 ? product.images : product.imageUrl ? [product.imageUrl] : [];
  const [activeImage, setActiveImage] = useState(0);
  const currentImage = gallery[activeImage] ?? null;

  const addDisabled = product.customizable && !customComplete;
  const outOfStock = product.stock <= 0;

  const router = useRouter();

  // Recomputes live as the customer picks options — combines the product's
  // own SKU with the child SKU of whichever choices are currently selected.
  // Relies on ProductCustomizer including `sku` on each selection it emits;
  // if it doesn't yet, this quietly falls back to just the parent SKU (or
  // null if there isn't one either) rather than showing something wrong.
  const combinedSku = useMemo(
    () => mergeChildSkus(product.sku, customSelections as any),
    [product.sku, customSelections]
  );

  function handleAddToCart() {
    if (addDisabled || outOfStock) return;

    // Carry the merged SKU along inside the same customization blob that
    // already flows to the cart, checkout, orders, and account pages — no
    // schema change needed, it just rides along as one more entry, the
    // same way each individual option selection already does.
    const selectionsToSave = combinedSku
      ? { ...customSelections, _sku: { optionName: 'SKU', value: combinedSku } }
      : customSelections;

    addToCart(product.id, 1, selectionsToSave);
    router.push('/cart');
  }

  function handleSave() {
    const current = getWishlist();
    const next = current.includes(product.id)
      ? current.filter((id) => id !== product.id)
      : [...current, product.id];
    persistWishlist(next);
    setSaved(next.includes(product.id));
  }

  return (
    <main>
      <nav className="mx-auto flex max-w-[1240px] items-center gap-2 px-[30px] pt-7 text-[11px] uppercase tracking-[.06em] text-brown-soft">
        <Link href="/" className="hover:text-brown">Home</Link>
        <span className="text-gold">/</span>
        <Link href="/shop" className="hover:text-brown">Shop</Link>
        <span className="text-gold">/</span>
        <span className="text-brown">{product.name}</span>
      </nav>

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-start gap-[34px] px-5 pb-20 pt-5 md:grid-cols-[1.15fr_0.85fr] md:gap-[90px] md:px-[30px] md:pb-[110px] md:pt-[30px]">
        <div className="sticky top-[110px]">
          <div className="flex aspect-[.9] items-center justify-center overflow-hidden border border-line bg-paper-light text-gold">
            {currentImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentImage} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <span className="relative z-10 text-[40px]">✦</span>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {gallery.map((url, i) => (
                <button
                  key={url + i}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show picture ${i + 1} of ${gallery.length}`}
                  aria-current={i === activeImage}
                  className={`relative aspect-square overflow-hidden border bg-paper-light transition ${
                    i === activeImage ? 'border-brown' : 'border-line hover:border-gold'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.22em] text-gold">
            {product.categoryName}
          </p>
          <h1 className="mb-[14px] font-display text-[clamp(34px,4vw,48px)] font-medium leading-none tracking-[-.035em]">
            {product.name}
          </h1>
          {(() => {
            const { discount, finalPrice, onSale } = getEffectivePrice(product, sale);
            return onSale ? (
              <p className="mb-[26px] flex items-baseline gap-3">
                <span className="font-display text-[16px] text-brown-soft line-through">{product.priceLabel}</span>
                <span className="font-display text-[22px] text-[#a14b3c]">EGP {finalPrice}</span>
                <span className="bg-[#a14b3c] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[.06em] text-cream">
                  -{discount}%
                </span>
              </p>
            ) : (
              <p className="mb-[26px] font-display text-[22px] text-brown-soft">{product.priceLabel}</p>
            );
          })()}
          <p className="mb-[30px] max-w-[460px] text-[14.5px] leading-[1.85] text-brown-soft">
            {product.description}
          </p>

          {outOfStock && (
            <p className="mb-6 border border-line bg-paper-light px-4 py-2 text-[12px] uppercase tracking-[.06em] text-brown-soft">
              Currently out of stock
            </p>
          )}

          {product.customizable && (
            
              <ProductCustomizer
                productId={product.id}
                productName={product.name}
                onChange={(selections, complete) => {
                  setCustomSelections(selections);
                  setCustomComplete(complete);
                }}
              />
          )}

          {combinedSku && (
            <p className="mb-6 text-[11px] uppercase tracking-[.1em] text-brown-soft">
              SKU: <span className="font-mono normal-case tracking-normal text-brown">{combinedSku}</span>
            </p>
          )}

          <div className="mb-9 flex gap-[14px]">
            <button
              onClick={handleAddToCart}
              disabled={addDisabled || outOfStock}
              className="inline-flex min-h-[46px] items-center justify-center gap-[10px] border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              Add to cart <ShoppingBag size={16} />
            </button>
            <button
              onClick={handleSave}
              className={`inline-flex min-h-[46px] items-center justify-center gap-[10px] border px-5 text-[11px] uppercase tracking-[.08em] transition duration-200 ${
                saved
                  ? 'border-gold bg-gold text-cream'
                  : 'border-brown bg-transparent text-brown hover:bg-brown hover:text-cream'
              }`}
            >
              {saved ? 'Saved' : 'Save'} <Heart size={16} className={saved ? 'fill-cream' : ''} />
            </button>
          </div>

          {product.customizable && addDisabled && (
            <p className="-mt-6 mb-9 text-[12px] text-brown-soft">
              Choose the required options above before adding this piece to your cart.
            </p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1240px] px-5 py-[65px] md:px-[30px] md:py-[90px]">
          <div className="mb-[38px]">
            <p className="mb-[10px] text-[10px] font-semibold uppercase tracking-[.22em] text-gold">You might also like</p>
            <h2 className="m-0 font-display text-[clamp(43px,5vw,62px)] font-medium leading-[.95] tracking-[-.045em]">More from this collection</h2>
          </div>
          <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
            {related.map((item) => (
              <ProductCard product={item} key={item.id} />
            ))}
          </div>
        </section>
      )}
      <VerseBlock
        verse="Your word is a lamp for my feet, a light on my path."
        reference="Psalm 119:105"
      />
    </main>
  );
}