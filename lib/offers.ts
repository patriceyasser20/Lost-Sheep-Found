import { supabaseClient } from './supabaseClient';
import type { Product } from './products';

export type OfferType = 'buy_x_get_y_free' | 'percent_off';
export type OfferAppliesTo = 'product' | 'category' | 'collection' | 'all';

export type Offer = {
  id: string;
  title: string;
  offerType: OfferType;
  buyQty: number;
  getQty: number;
  discountPct: number; // used when offerType === 'percent_off'
  appliesTo: OfferAppliesTo;
  targetId: string; // product/category slug or id — '' when appliesTo === 'all'
  targetLabel?: string;
  requireSameVariant: boolean;
  endsAt: string; // '' when no end date
  active: boolean;
};

function mapOffer(row: any): Offer {
  return {
    id: row.id,
    title: row.title,
    offerType: row.offer_type,
    buyQty: row.buy_qty,
    getQty: row.get_qty,
    discountPct: row.discount_pct,
    appliesTo: row.applies_to,
    targetId: row.target_id || '',
    targetLabel: row.target_label || '',
    requireSameVariant: row.require_same_variant,
    endsAt: row.ends_at || '',
    active: row.active,
  };
}

// Client-side read — active offers only, expired ones filtered out here so
// every caller gets the same "currently live" set without re-deriving it.
export async function getActiveOffersClient(): Promise<Offer[]> {
  const { data, error } = await supabaseClient.from('offers').select('*').eq('active', true);
  if (error) {
    console.error('getActiveOffersClient:', error.message);
    return [];
  }
  const now = Date.now();
  return (data || [])
    .map(mapOffer)
    .filter((o) => !o.endsAt || new Date(o.endsAt).getTime() >= now);
}

// First matching offer wins — 'product' and 'category' are the only scopes
// resolvable today; 'collection' is skipped because Product has no
// collection field yet (see note above).
export function findOfferForProduct(
  product: Pick<Product, 'id' | 'categoryId'>,
  offers: Offer[]
): Offer | null {
  for (const offer of offers) {
    if (offer.appliesTo === 'all') return offer;
    if (offer.appliesTo === 'product' && offer.targetId === product.id) return offer;
    if (offer.appliesTo === 'category' && offer.targetId === product.categoryId) return offer;
  }
  return null;
}

export function offerBadgeText(offer: Offer): string {
  return offer.offerType === 'buy_x_get_y_free'
    ? `Buy ${offer.buyQty} Get ${offer.getQty} Free`
    : `Buy ${offer.buyQty} Get ${offer.getQty} at -${offer.discountPct}%`;
}
export function findSaleOfferForProduct(
  product: Pick<Product, 'id' | 'categoryId'>,
  offers: Offer[]
): Offer | null {
  return findOfferForProduct(
    product,
    offers.filter((o) => o.offerType === 'percent_off')
  );
}