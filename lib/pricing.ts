import type { Product } from './products';
import type { SaleSettings } from './sale';

export function getEffectivePrice(
  product: Pick<Product, 'price' | 'priceLabel' | 'categorySlug'>,
  sale: SaleSettings | null
) {
  const applies =
    !!sale &&
    sale.active &&
    sale.discountPct > 0 &&
    (sale.categorySlugs.length === 0 || sale.categorySlugs.includes(product.categorySlug));

  const discount = applies ? sale!.discountPct : 0;
  const finalPrice = discount > 0 ? Math.round(product.price * (1 - discount / 100)) : product.price;

  return { discount, finalPrice, onSale: discount > 0 };
}