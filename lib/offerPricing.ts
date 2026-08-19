import type { Product } from './products';
import { findOfferForProduct, type Offer } from './offers';

export type AppliedOfferResult = {
  offer: Offer;
  discountedQty: number;
  discountAmount: number; // EGP, rounded
};

type LineLike = { qty: number };

// Offers apply across every product that resolves to the same offer (same
// product target, same category, or 'all'), pooled together — not per
// individual product. Three different products that each qualify for the
// same "buy 2 get 1" offer combine toward one shared threshold.
//
// When the group spans multiple price points, the cheapest qualifying
// units are the ones discounted (standard "cheapest item free" behavior
// for mixed-price bundles), computed against each unit's *effective*
// price (post sale-price, pre-offer) so an already-discounted item isn't
// discounted twice.
export function computeOfferDiscounts(
  lines: Array<{ line: LineLike; product: Product }>,
  offers: Offer[],
  effectivePriceOf: (product: Product) => number
): AppliedOfferResult[] {
  const groups = new Map<string, { offer: Offer; units: number[] }>();

  for (const { line, product } of lines) {
    const offer = findOfferForProduct(product, offers);
    if (!offer) continue;

    const unitPrice = effectivePriceOf(product);
    const group = groups.get(offer.id) ?? { offer, units: [] };
    for (let i = 0; i < line.qty; i++) group.units.push(unitPrice);
    groups.set(offer.id, group);
  }

  const results: AppliedOfferResult[] = [];

  for (const { offer, units } of groups.values()) {
    const groupSize = offer.buyQty + offer.getQty;
    if (groupSize <= 0) continue;

    const fullGroups = Math.floor(units.length / groupSize);
    if (fullGroups <= 0) continue; // not enough combined quantity yet

    const discountedQty = fullGroups * offer.getQty;
    const pctOff = offer.offerType === 'buy_x_get_y_free' ? 100 : offer.discountPct;

    // Cheapest units first — those are the ones that become free/discounted.
    const cheapestFirst = [...units].sort((a, b) => a - b);
    const discountedUnits = cheapestFirst.slice(0, discountedQty);
    const discountAmount = Math.round(
      discountedUnits.reduce((sum, price) => sum + price, 0) * (pctOff / 100)
    );

    if (discountAmount <= 0) continue;

    results.push({ offer, discountedQty, discountAmount });
  }

  return results;
}

// "Add 2 more to get 1 free" style hint for a product that has an active
// offer but the pooled quantity across every product under that same
// offer hasn't hit a qualifying threshold yet. Returns null once the
// pooled quantity is exactly at (or has just passed) a threshold, since
// at that point the discount itself is the feedback.
export function getOfferHint(
  product: Product,
  offers: Offer[],
  lines: Array<{ line: LineLike; product: Product }>
): string | null {
  const offer = findOfferForProduct(product, offers);
  if (!offer) return null;

  const groupSize = offer.buyQty + offer.getQty;
  if (groupSize <= 0) return null;

  // Pool quantity across every line whose product resolves to this same offer.
  const pooledQty = lines.reduce((sum, l) => {
    const lineOffer = findOfferForProduct(l.product, offers);
    return lineOffer?.id === offer.id ? sum + l.line.qty : sum;
  }, 0);

  const remainder = pooledQty % groupSize;
  if (remainder === 0) return null;

  const remaining = groupSize - remainder;
  const action =
    offer.offerType === 'buy_x_get_y_free'
      ? `get ${offer.getQty} free`
      : `get ${offer.getQty} at -${offer.discountPct}%`;

  return `Add ${remaining} more to ${action}`;
}