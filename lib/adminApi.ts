import type { PromoCode, Offer, AdminOrder, AdminOrderItem, OrderStatus,SaleSettings } from './adminTypes';

const ADMIN_ENDPOINT = '/api/admin-ops';


function getToken() {
  return typeof window === 'undefined' ? null : localStorage.getItem('adminToken');
}

function mapPromoCode(row: any): PromoCode {
  return {
    id: row.id,
    code: row.code,
    discountPct: row.discount_pct,
    usageLimit: row.usage_limit,
    usedCount: row.used_count,
    expiresAt: row.expires_at || '',
    active: row.active,
    freeDelivery: row.free_delivery ?? false,
  };
}

function mapOrder(row: any): AdminOrder {
  const addr = row.shipping_address || {};
  const customerName = [addr.firstName, addr.lastName].filter(Boolean).join(' ').trim() || 'Guest';

  const items: AdminOrderItem[] = (row.order_items || []).map((it: any) => ({
    productName: it.products?.name || 'Product',
    imageUrl: it.products?.image_url || null,
    quantity: it.quantity,
    unitPrice: Number(it.unit_price) || 0,
    originalPrice: it.original_price != null ? Number(it.original_price) : null,
    discountPercentage: Number(it.discount_percentage) || 0,
    customization: it.customization && typeof it.customization === 'object' ? it.customization : null,
  }));
  return {
    id: row.id,
    customerName,
    email: addr.email || '—',
    phone: addr.phone || '—',
    street: addr.street || '—',
    apartment: addr.apartment || '',
    city: row.city || '—',
    isRegistered: Boolean(row.user_id),
    items,
    subtotal: Number(row.subtotal) || 0,
    deliveryFee: Number(row.delivery_fee) || 0,
    discount: Number(row.discount) || 0,
    total: Number(row.total) || 0,
    createdAt: row.created_at
      ? new Date(row.created_at).toLocaleString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true,
        })
      : '—',
    status: (row.status as OrderStatus) ?? 'pending',
  };
}

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
    bannerText: row.banner_text || '',
    endsAt: row.ends_at || '',
    active: row.active,
  };
}


async function call(action: string, payload: any = {}) {
  const res = await fetch(ADMIN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': getToken() || '' },
    body: JSON.stringify({ action, payload }),
  });

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Server error (${res.status}): ${text.slice(0, 200)}`);
  }

  if (!res.ok) throw new Error(json.error || `Request failed: ${action}`);
  return json.data ?? json;
}

  export const adminApi = {
  // products
  insertProduct: (payload: any) => call('insert-product', payload),
  updateProduct: (id: string, payload: any) => call('update-product', { id, ...payload }),
  deleteProduct: (id: string) => call('delete-product', { id }),
  clearCollection: (collection: string) => call('clear-collection', { collection }),

  // variants
  insertVariants: (rows: any[]) => call('insert-variants', rows),
  updateVariantDiscount: (id: string, payload: any) => call('update-variant-discount', { id, ...payload }),
  restock: (variantId: string, stock: number) => call('restock', { variantId, stock }),

  // promo codes
  async getPromoCodes() {
    const data = await call('get-promo-codes');
    return (data || []).map(mapPromoCode);
  },
  async insertPromo(payload: Omit<PromoCode, 'id' | 'usedCount'>) {
    const data = await call('insert-promo', payload);
    return mapPromoCode(data);
  },
  async updatePromo(payload: PromoCode) {
    const data = await call('update-promo', payload);
    return mapPromoCode(data);
  },
  deletePromo: (id: string) => call('delete-promo', { id }),

  // shipping
  toggleCountry: (code: string, enabled: boolean) => call('toggle-country', { code, enabled }),
  upsertShippingCity: (payload: any) => call('upsert-shipping-city', payload),
  getShippingCities: (countryCode: string) => call('get-shipping-cities', { countryCode }),

  // featured / home page
  getFeatured: async (section: string) => {
    const { supabaseClient } = await import('./supabaseClient');
    const { data, error } = await supabaseClient
      .from('featured_products')
      .select('product_id')
      .eq('section', section)
      .order('position');
    if (error) throw new Error(error.message);
    return (data || []).map((r: any) => r.product_id as string);
  },
  setFeatured: (productId: string, section: string, position: number) =>
    call('set-featured', { product_id: productId, section, position }),
  unsetFeatured: (productId: string, section: string) => call('unset-featured', { productId, section }),
  clearFeatured: (section: string) => call('clear-featured', { section }),

  // offers
  async getOffers() {
    const data = await call('get-offers');
    return (data || []).map(mapOffer);
  },
  async insertOffer(payload: Omit<Offer, 'id'>) {
    const data = await call('insert-offer', payload);
    return mapOffer(data);
  },
  async updateOffer(payload: Offer) {
    const data = await call('update-offer', payload);
    return mapOffer(data);
  },
  deleteOffer: (id: string) => call('delete-offer', { id }),

  // customization options
  saveCustomizationOptions: (productId: string, options: any[]) =>
    call('save-customization-options', { productId, options }),
  saveProductImages: (productId: string, images: string[]) =>
    call('save-product-images', { productId, images }),
  deleteCustomizationOptionsForProduct: (productId: string) =>
    call('delete-customization-options', { productId }),

  // skus
  insertSku: (payload: any) => call('insert-sku', payload),
  updateSku: (payload: any) => call('update-sku', payload),
  deleteSku: (id: string) => call('delete-sku', { id }),
  getSkus: () => call('get-skus'),

  // orders
  async getOrders() {
    const data = await call('get-orders');
    return (data || []).map(mapOrder);
  },
  updateOrderStatus: (payload: { id: string; status: string }) => call('update-order-status', payload),

  // newsletter
  getSubscribers: () => call('get-subscribers'),
  sendNewsletter: (payload: any) => call('send-newsletter', payload),

   async getSaleSettings(): Promise<SaleSettings> {
  const data = await call('get-sale-settings');
  return {
    title: data?.title ?? '15% off, this week only',
    subtitle: data?.subtitle ?? '',
    bannerText: data?.banner_text ?? '',
    categorySlugs: data?.category_slugs ?? [],
    discountPct: data?.discount_pct ?? 0,
    active: data?.active ?? true,
  };
},
async updateSaleSettings(payload: SaleSettings) {
  const data = await call('update-sale-settings', {
    title: payload.title,
    subtitle: payload.subtitle,
    banner_text: payload.bannerText,
    category_slugs: payload.categorySlugs,
    discount_pct: payload.discountPct,
    active: payload.active,
  });
  return {
    title: data.title,
    subtitle: data.subtitle,
    bannerText: data.banner_text ?? '',
    categorySlugs: data.category_slugs ?? [],
    discountPct: data.discount_pct ?? 0,
    active: data.active ?? true,
  } as SaleSettings;
},
};